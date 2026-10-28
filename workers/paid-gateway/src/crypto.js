/**
 * 文章密钥派生与编码（Worker 侧）。
 * K = HMAC-SHA256(MASTER, "zcblog-paid:v1:" + slug)
 * MASTER 为 32 字节，base64url 编码。
 */

const enc = new TextEncoder();

export function base64urlToBytes(input) {
    const s = String(input || "")
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
    const bin = atob(s + pad);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
    return out;
}

export function bytesToBase64url(bytes) {
    let bin = "";
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function deriveArticleKey(masterB64url, slug) {
    const master = base64urlToBytes(masterB64url);
    if (master.length !== 32) {
        throw new Error("PAID_MASTER_KEY 必须是 32 字节（base64url）");
    }
    const hmacKey = await crypto.subtle.importKey(
        "raw",
        master,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", hmacKey, enc.encode(`zcblog-paid:v1:${slug}`));
    return new Uint8Array(sig);
}

export function randomToken(bytes = 32) {
    const buf = new Uint8Array(bytes);
    crypto.getRandomValues(buf);
    return bytesToBase64url(buf);
}
