/**
 * 激活码规范化与哈希（Worker 与脚本共用，纯函数）。
 * 码格式：16 位 Crockford Base32，展示为 4 组，如 Z7K4-9QMX-3TWP-8R2N。
 */

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** 去掉分隔符/小写/易混字符（I、L → 1，O → 0） */
export function normalizeCode(raw) {
    return String(raw || "")
        .toUpperCase()
        .replace(/[^0-9A-Z]/g, "")
        .replace(/[IL]/g, "1")
        .replace(/O/g, "0");
}

/** 生成一条新码（16 位，80 bit） */
export function generateCode() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    let out = "";
    for (const b of bytes) out += ALPHABET[b % 32];
    return out;
}

/** 展示格式：4-4-4-4 */
export function formatCode(code) {
    const c = normalizeCode(code);
    return c.match(/.{1,4}/g)?.join("-") ?? c;
}

export async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** 码的存储键 = SHA-256(规范化后的码) */
export async function codeKey(raw) {
    return `code:${await sha256Hex(normalizeCode(raw))}`;
}

/** 授权判断：slugs 为 "*" 或包含该 slug */
export function isEntitled(record, slug) {
    if (!record) return false;
    if (record.slugs === "*") return true;
    return Array.isArray(record.slugs) && record.slugs.includes(slug);
}
