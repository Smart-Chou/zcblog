/**
 * 将 Base64 字符串解码为 UTF-8 字符串。
 *
 * 浏览器的 atob() 只能正确解码 Latin-1（单字节），
 * 中文等多字节 UTF-8 字符需要通过 TextDecoder 转换。
 */
export function b64ToUtf8(b64: string): string {
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}
