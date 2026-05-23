/**
 * Build-time content encryption using Node crypto.
 * AES-256-GCM with PBKDF2-derived key (deterministic per password+slug).
 * Output: base64(salt[16] + iv[12] + authTag[16] + ciphertext)
 */
import { createCipheriv, createHmac, pbkdf2Sync } from "node:crypto";

const ITERATIONS = 100000;
const SALT_LEN = 16;
const IV_LEN = 12;
const KEY_LEN = 32;

function deriveBytes(key: string, context: string, length: number): Buffer {
    return createHmac("sha256", key).update(context).digest().subarray(0, length);
}

export function encryptContent(html: string, password: string, slug: string): string {
    const salt = deriveBytes(password, `salt:${slug}`, SALT_LEN);
    const iv = deriveBytes(password, `iv:${slug}`, IV_LEN);
    const key = pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, "sha256");

    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([cipher.update(html, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, authTag, encrypted]).toString("base64");
}
