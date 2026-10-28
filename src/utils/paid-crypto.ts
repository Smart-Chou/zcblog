/**
 * 付费内容加密（构建期，Node）。
 * 格式：v3.<base64url(iv[12] | ciphertext | tag[16])>
 * AAD = slug（防止把 A 文章的密文粘到 B 文章）
 */
import { createCipheriv, createHmac, randomBytes } from "node:crypto";

const VERSION = "v3";
const IV_LEN = 12;
const TAG_LEN = 16;
const MASTER_LEN = 32;

export function derivePaidKey(masterB64url: string, slug: string): Buffer {
    const master = Buffer.from(masterB64url, "base64url");
    if (master.length !== MASTER_LEN) {
        throw new Error("[paid] PAID_MASTER_KEY 必须是 32 字节（base64url）");
    }
    return createHmac("sha256", master).update(`zcblog-paid:v1:${slug}`).digest();
}

export function encryptPaidContent(html: string, key: Buffer, slug: string): string {
    const iv = randomBytes(IV_LEN);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    cipher.setAAD(Buffer.from(slug, "utf8"));
    const ciphertext = Buffer.concat([cipher.update(html, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    if (tag.length !== TAG_LEN) throw new Error("[paid] GCM tag 长度异常");
    return `${VERSION}.${Buffer.concat([iv, ciphertext, tag]).toString("base64url")}`;
}

/** 粗略字数（去掉标签与空白），用于付费墙提示 */
export function countPaidChars(html: string): number {
    return html
        .replace(/<[^>]*>/g, "")
        .replace(/&[a-z#0-9]+;/gi, "")
        .replace(/\s+/g, "").length;
}
