/**
 * zcblog-paid — 付费阅读授权网关
 *
 * 路由（部署到 https://marxchou.com/api/pay/*）：
 *   POST /redeem   {code}            兑换激活码，建立 90 天会话
 *   GET  /key?slug=xxx               取文章密钥（需会话 + 授权）
 *   GET  /me                         当前会话的授权摘要
 *   POST /logout                     退出当前会话
 *   GET  /health                     健康检查
 *
 * KV：
 *   code:<sha256>      激活码记录（只存哈希）
 *   sess:<sid>         会话
 *   sessions:<sha256>  同一码的会话索引（设备数控制）
 */

import { codeKey, isEntitled, normalizeCode } from "./codes.js";
import { bytesToBase64url, deriveArticleKey, randomToken } from "./crypto.js";

const COOKIE_NAME = "zc_paid";
const SESSION_TTL_SECONDS = 90 * 24 * 60 * 60;
const SESSION_MAX_MS = SESSION_TTL_SECONDS * 1000;
const MAX_CODE_LEN = 64;

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // 只接受自有域名（同源部署时浏览器通常不带 Origin；带了就必须匹配）
        const origin = request.headers.get("Origin");
        if (env.ALLOWED_ORIGIN && origin && origin !== env.ALLOWED_ORIGIN) {
            return json({ error: "bad_origin" }, 403);
        }

        const path = url.pathname.replace(/^\/api\/pay/, "") || "/";

        try {
            if (request.method === "GET" && path === "/health") {
                return json({ ok: true, ts: Date.now() });
            }
            if (request.method === "POST" && path === "/redeem") {
                return await handleRedeem(request, env, url);
            }
            if (request.method === "GET" && path === "/key") {
                return await handleKey(request, env, url);
            }
            if (request.method === "GET" && path === "/me") {
                return await handleMe(request, env);
            }
            if (request.method === "POST" && path === "/logout") {
                return await handleLogout(request, env, url);
            }
            return json({ error: "not_found" }, 404);
        } catch (err) {
            console.error("[paid] unhandled", err);
            return json({ error: "internal_error" }, 500);
        }
    },
};

async function handleRedeem(request, env, url) {
    const body = await readJson(request);
    const raw = body && typeof body.code === "string" ? body.code : "";
    if (!raw || raw.length > MAX_CODE_LEN) return json({ error: "invalid_request" }, 400);

    const key = await codeKey(raw);
    if (!key || normalizeCode(raw).length < 8) return json({ error: "invalid_code" }, 404);

    const record = await getJson(env, key);
    if (!record) return json({ error: "invalid_code" }, 404);
    if (record.revoked) return json({ error: "code_revoked" }, 410);

    const now = Date.now();
    const indexKey = `sessions:${key.slice("code:".length)}`;
    const max = Number(record.max) > 0 ? Number(record.max) : 3;

    const sessions = (await getJson(env, indexKey)) || [];
    // 只保留未过期的会话
    const alive = sessions.filter((s) => s && s.sid && s.exp > now);

    // 超出设备上限：踢掉最旧的
    while (alive.length >= max) {
        const oldest = alive.shift();
        if (oldest) await env.PAID_KV.delete(`sess:${oldest.sid}`);
    }

    const sid = randomToken(32);
    const exp = now + SESSION_MAX_MS;
    const ua = await sha256Short(request.headers.get("User-Agent") || "");
    await putJson(
        env,
        `sess:${sid}`,
        { v: 1, ch: key.slice("code:".length), iat: now, exp, ua },
        SESSION_TTL_SECONDS,
    );

    alive.push({ sid, iat: now, exp });
    await putJson(env, indexKey, alive, SESSION_TTL_SECONDS + 30 * 24 * 60 * 60);

    return json({ ok: true, slugs: record.slugs, exp }, 200, {
        "Set-Cookie": buildCookie(sid, url, SESSION_TTL_SECONDS),
    });
}

async function handleKey(request, env, url) {
    const slug = url.searchParams.get("slug") || "";
    if (!/^[a-z0-9][a-z0-9-]{0,80}$/i.test(slug)) return json({ error: "bad_slug" }, 400);

    const session = await readSession(request, env);
    if (!session.ok) return json({ error: session.error }, session.status);

    const record = await getJson(env, `code:${session.sess.ch}`);
    if (!record) {
        await env.PAID_KV.delete(`sess:${session.sid}`);
        return json({ error: "no_session" }, 401);
    }
    if (record.revoked) {
        await env.PAID_KV.delete(`sess:${session.sid}`);
        return json({ error: "code_revoked" }, 403);
    }
    if (!isEntitled(record, slug)) return json({ error: "not_entitled" }, 403);

    const key = await deriveArticleKey(env.PAID_MASTER_KEY, slug);
    return json({ v: 3, k: bytesToBase64url(key) });
}

async function handleMe(request, env) {
    const session = await readSession(request, env);
    if (!session.ok) return json({ error: session.error }, session.status);

    const record = await getJson(env, `code:${session.sess.ch}`);
    if (!record || record.revoked) return json({ error: "no_session" }, 401);
    return json({ ok: true, slugs: record.slugs, exp: session.sess.exp });
}

async function handleLogout(request, env, url) {
    const sid = readCookie(request);
    if (sid) {
        const sess = await getJson(env, `sess:${sid}`);
        await env.PAID_KV.delete(`sess:${sid}`);
        if (sess && sess.ch) {
            const indexKey = `sessions:${sess.ch}`;
            const sessions = (await getJson(env, indexKey)) || [];
            const rest = sessions.filter((s) => s && s.sid !== sid);
            if (rest.length > 0)
                await putJson(env, indexKey, rest, SESSION_TTL_SECONDS + 30 * 24 * 60 * 60);
            else await env.PAID_KV.delete(indexKey);
        }
    }
    return json({ ok: true }, 200, { "Set-Cookie": buildCookie("", url, 0) });
}

async function readSession(request, env) {
    const sid = readCookie(request);
    if (!sid) return { ok: false, status: 401, error: "no_session" };

    const sess = await getJson(env, `sess:${sid}`);
    if (!sess) return { ok: false, status: 401, error: "no_session" };
    if (sess.exp <= Date.now()) {
        await env.PAID_KV.delete(`sess:${sid}`);
        return { ok: false, status: 401, error: "session_expired" };
    }
    return { ok: true, sid, sess };
}

function readCookie(request) {
    const header = request.headers.get("Cookie") || "";
    for (const part of header.split(";")) {
        const [name, ...rest] = part.trim().split("=");
        if (name === COOKIE_NAME) return decodeURIComponent(rest.join("="));
    }
    return "";
}

function buildCookie(value, url, maxAge) {
    const secure = url.protocol === "https:" ? "; Secure" : "";
    return `${COOKIE_NAME}=${encodeURIComponent(value)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

async function readJson(request) {
    const type = request.headers.get("Content-Type") || "";
    if (!type.includes("application/json")) return null;
    try {
        return await request.json();
    } catch {
        return null;
    }
}

async function sha256Short(text) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(digest)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, 16);
}

async function getJson(env, key) {
    const raw = await env.PAID_KV.get(key);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

async function putJson(env, key, value, ttlSeconds) {
    const opts = ttlSeconds ? { expirationTtl: ttlSeconds } : undefined;
    await env.PAID_KV.put(key, JSON.stringify(value), opts);
}

function json(body, status = 200, extraHeaders = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "no-referrer",
            ...extraHeaders,
        },
    });
}
