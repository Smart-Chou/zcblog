import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import app from "../src/index.js";
import { codeKey, formatCode, generateCode, isEntitled, normalizeCode } from "../src/codes.js";
import { deriveArticleKey, bytesToBase64url } from "../src/crypto.js";

const MASTER = randomBytes(32).toString("base64url");

class MemKV {
    constructor() {
        this.map = new Map();
    }
    async get(key) {
        return this.map.has(key) ? this.map.get(key) : null;
    }
    async put(key, value) {
        this.map.set(key, value);
    }
    async delete(key) {
        this.map.delete(key);
    }
}

function makeEnv() {
    return { PAID_KV: new MemKV(), PAID_MASTER_KEY: MASTER };
}

async function call(env, path, { method = "GET", body, cookie } = {}) {
    const headers = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (cookie) headers["Cookie"] = cookie;
    const res = await app.fetch(
        new Request(`https://marxchou.com/api/pay${path}`, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
        }),
        env,
    );
    const data = await res.json().catch(() => null);
    return { res, data, cookie: res.headers.getSetCookie?.()[0]?.split(";")[0] || "" };
}

async function seedCode(env, code, overrides = {}) {
    const key = await codeKey(code);
    await env.PAID_KV.put(
        key,
        JSON.stringify({ v: 1, slugs: ["demo"], max: 3, revoked: false, ...overrides }),
    );
    return key;
}

test("码规范化与格式化", () => {
    assert.equal(normalizeCode("z7k4-9qmx"), "Z7K49QMX");
    assert.equal(normalizeCode("O0I1l"), "00111");
    assert.equal(formatCode("Z7K49QMX3TWP8R2N"), "Z7K4-9QMX-3TWP-8R2N");
    assert.equal(normalizeCode(generateCode()).length, 16);
});

test("授权判断", () => {
    assert.equal(isEntitled({ slugs: "*" }, "x"), true);
    assert.equal(isEntitled({ slugs: ["a", "b"] }, "b"), true);
    assert.equal(isEntitled({ slugs: ["a"] }, "b"), false);
    assert.equal(isEntitled(null, "a"), false);
});

test("无会话取密钥 → 401", async () => {
    const env = makeEnv();
    const { res, data } = await call(env, "/key?slug=demo");
    assert.equal(res.status, 401);
    assert.equal(data.error, "no_session");
});

test("错误码 → 404", async () => {
    const env = makeEnv();
    const { res, data } = await call(env, "/redeem", {
        method: "POST",
        body: { code: "NOPE-NOPE" },
    });
    assert.equal(res.status, 404);
    assert.equal(data.error, "invalid_code");
});

test("兑换 → 取密钥 → me → 吊销", async () => {
    const env = makeEnv();
    await seedCode(env, "TEST-CODE-0001");

    const redeem = await call(env, "/redeem", { method: "POST", body: { code: "test-code-0001" } });
    assert.equal(redeem.res.status, 200);
    assert.equal(redeem.data.ok, true);
    assert.ok(redeem.cookie.startsWith("zc_paid="));

    const key = await call(env, "/key?slug=demo", { cookie: redeem.cookie });
    assert.equal(key.res.status, 200);
    assert.equal(key.data.v, 3);
    assert.equal(Buffer.from(key.data.k, "base64url").length, 32);
    assert.equal(key.res.headers.get("cache-control"), "no-store");

    const me = await call(env, "/me", { cookie: redeem.cookie });
    assert.equal(me.res.status, 200);
    assert.deepEqual(me.data.slugs, ["demo"]);

    const wrong = await call(env, "/key?slug=other", { cookie: redeem.cookie });
    assert.equal(wrong.res.status, 403);
    assert.equal(wrong.data.error, "not_entitled");

    // 吊销
    const key2 = await codeKey("TEST-CODE-0001");
    const record = JSON.parse(await env.PAID_KV.get(key2));
    await env.PAID_KV.put(key2, JSON.stringify({ ...record, revoked: true }));

    const revoked = await call(env, "/key?slug=demo", { cookie: redeem.cookie });
    assert.equal(revoked.res.status, 403);
    assert.equal(revoked.data.error, "code_revoked");
});

test("超过设备上限踢最旧会话", async () => {
    const env = makeEnv();
    await seedCode(env, "MAX-TEST-0001", { max: 2 });

    const a = await call(env, "/redeem", { method: "POST", body: { code: "MAX-TEST-0001" } });
    const b = await call(env, "/redeem", { method: "POST", body: { code: "MAX-TEST-0001" } });
    const c = await call(env, "/redeem", { method: "POST", body: { code: "MAX-TEST-0001" } });

    assert.equal(a.res.status, 200);
    assert.equal(b.res.status, 200);
    assert.equal(c.res.status, 200);

    const oldA = await call(env, "/me", { cookie: a.cookie });
    const newB = await call(env, "/me", { cookie: b.cookie });
    const newC = await call(env, "/me", { cookie: c.cookie });
    assert.equal(oldA.res.status, 401);
    assert.equal(newB.res.status, 200);
    assert.equal(newC.res.status, 200);
});

test("退出会话后取密钥 → 401", async () => {
    const env = makeEnv();
    await seedCode(env, "LOGOUT-0001");
    const { cookie } = await call(env, "/redeem", {
        method: "POST",
        body: { code: "LOGOUT-0001" },
    });

    const out = await call(env, "/logout", { method: "POST", cookie });
    assert.equal(out.res.status, 200);

    const key = await call(env, "/key?slug=demo", { cookie });
    assert.equal(key.res.status, 401);
});

test("Worker 与构建侧派生同一把密钥", async () => {
    const slug = "demo";
    const workerKey = bytesToBase64url(await deriveArticleKey(MASTER, slug));
    const { data } = await (async () => {
        const env = makeEnv();
        await seedCode(env, "DERIVE-0001");
        const r = await call(env, "/redeem", { method: "POST", body: { code: "DERIVE-0001" } });
        return call(env, "/key?slug=demo", { cookie: r.cookie });
    })();
    assert.equal(data.k, workerKey);
});
