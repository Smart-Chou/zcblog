/**
 * 付费文章前端：取密钥 → WebCrypto 解密 → 渲染；以及激活码兑换。
 * 由 MarkdownLayout（文章页）与 /unlock/ 页引入。
 */

const API_BASE = import.meta.env.DEV
    ? `${location.protocol}//${location.hostname}:8788/api/pay`
    : "/api/pay";

type KeyResponse = { v: number; k: string };

function b64urlToBytes(input: string): Uint8Array<ArrayBuffer> {
    const s = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
    const bin = atob(s + pad);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
    return out;
}

async function fetchKey(slug: string): Promise<KeyResponse | null> {
    try {
        const res = await fetch(`${API_BASE}/key?slug=${encodeURIComponent(slug)}`, {
            credentials: "include",
            headers: { Accept: "application/json" },
        });
        if (!res.ok) return null;
        return (await res.json()) as KeyResponse;
    } catch {
        return null;
    }
}

async function decrypt(cipher: string, keyB64: string, slug: string): Promise<string> {
    if (!cipher.startsWith("v3.")) throw new Error("unsupported cipher version");
    const raw = b64urlToBytes(cipher.slice(3));
    if (raw.length < 12 + 16 + 1) throw new Error("cipher too short");
    const iv = raw.slice(0, 12);
    const tag = raw.slice(raw.length - 16);
    const data = raw.slice(12, raw.length - 16);

    const key = await crypto.subtle.importKey("raw", b64urlToBytes(keyB64), "AES-GCM", false, [
        "decrypt",
    ]);
    const combined = new Uint8Array(data.length + tag.length);
    combined.set(data, 0);
    combined.set(tag, data.length);

    const plain = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv,
            additionalData: new TextEncoder().encode(slug),
            tagLength: 128,
        },
        key,
        combined,
    );
    return new TextDecoder().decode(plain);
}

function setStatus(root: HTMLElement, text: string, kind: "info" | "error" = "info") {
    const msg = root.querySelector<HTMLElement>("[data-paid-msg]");
    if (!msg) return;
    msg.textContent = text;
    msg.dataset.kind = kind;
}

async function unlockBlock(root: HTMLElement, keyB64: string) {
    const slug = root.dataset.paidSlug || "";
    const payloadEl = root.querySelector<HTMLScriptElement>("[data-paid-payload]");
    const body = root.querySelector<HTMLElement>("[data-paid-body]");
    const gate = root.querySelector<HTMLElement>("[data-paid-gate]");
    if (!payloadEl || !body || !gate) return;

    let payload: { v: number; ct: string };
    try {
        payload = JSON.parse(payloadEl.textContent || "{}");
    } catch {
        setStatus(root, "内容数据损坏，请刷新页面", "error");
        return;
    }

    try {
        const html = await decrypt(payload.ct, keyB64, slug);
        body.innerHTML = html;
        body.hidden = false;
        gate.hidden = true;
        root.dataset.paidUnlocked = "1";
        document.dispatchEvent(new CustomEvent("paid:unlocked", { detail: { slug } }));
        // 目录刷新由 Toc.astro 监听 paid:unlocked 事件处理（tocbot 不在 window 上）
    } catch {
        setStatus(root, "内容已更新或密钥失效，请刷新页面", "error");
    }
}

async function tryAutoUnlock(root: HTMLElement) {
    const slug = root.dataset.paidSlug || "";
    if (!slug) return;
    const key = await fetchKey(slug);
    if (key?.k) await unlockBlock(root, key.k);
}

function wireBlock(root: HTMLElement) {
    if (root.dataset.paidWired === "1") return;
    root.dataset.paidWired = "1";

    const toggle = root.querySelector<HTMLButtonElement>("[data-paid-toggle]");
    const form = root.querySelector<HTMLFormElement>("[data-paid-form]");
    const input = root.querySelector<HTMLInputElement>("[data-paid-input]");
    const submit = root.querySelector<HTMLButtonElement>("[data-paid-submit]");

    toggle?.addEventListener("click", () => {
        if (!form) return;
        form.hidden = !form.hidden;
        if (!form.hidden) input?.focus();
    });

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const code = input?.value.trim() || "";
        if (!code) return;
        if (submit) submit.disabled = true;
        setStatus(root, "正在验证…");
        try {
            const res = await fetch(`${API_BASE}/redeem`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const data = (await res.json().catch(() => ({}))) as { error?: string };
            if (!res.ok) {
                setStatus(
                    root,
                    data.error === "code_revoked" ? "该激活码已被停用" : "激活码无效，请检查后重试",
                    "error",
                );
                return;
            }
            const slug = root.dataset.paidSlug || "";
            const key = await fetchKey(slug);
            if (key?.k) {
                await unlockBlock(root, key.k);
            } else {
                setStatus(root, "解锁成功但取密钥失败，请刷新页面", "error");
            }
        } catch {
            setStatus(root, "网络错误，请稍后重试", "error");
        } finally {
            if (submit) submit.disabled = false;
        }
    });

    void tryAutoUnlock(root).catch(() => {
        /* 未解锁是常态，不报错 */
    });
}

function wireUnlockPage() {
    const page = document.querySelector<HTMLElement>("[data-paid-unlock-page]");
    if (!page || page.dataset.paidWired === "1") return;
    page.dataset.paidWired = "1";
    const form = page.querySelector<HTMLFormElement>("[data-paid-unlock-form]");
    const input = page.querySelector<HTMLInputElement>("[data-paid-unlock-input]");
    const submit = page.querySelector<HTMLButtonElement>("[data-paid-unlock-submit]");
    const status = page.querySelector<HTMLElement>("[data-paid-unlock-status]");

    const say = (text: string, kind = "info") => {
        if (!status) return;
        status.textContent = text;
        status.dataset.kind = kind;
    };

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const code = input?.value.trim() || "";
        if (!code) return;
        if (submit) submit.disabled = true;
        say("正在验证…");
        try {
            const res = await fetch(`${API_BASE}/redeem`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const data = (await res.json().catch(() => ({}))) as { error?: string };
            if (!res.ok) {
                say(
                    data.error === "code_revoked" ? "该激活码已被停用" : "激活码无效，请重试",
                    "error",
                );
                return;
            }
            say("解锁成功，正在跳转…");
            const params = new URLSearchParams(location.search);
            const next = params.get("next") || "/";
            // 只允许站内相对路径，防止开放重定向
            location.href = next.startsWith("/") && !next.startsWith("//") ? next : "/";
        } catch {
            say("网络错误，请稍后重试", "error");
        } finally {
            if (submit) submit.disabled = false;
        }
    });
}

function init() {
    document.querySelectorAll<HTMLElement>("[data-paid-root]").forEach(wireBlock);
    wireUnlockPage();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
    init();
}

// View Transitions 后重新绑定
document.addEventListener("astro:page-load", init);
