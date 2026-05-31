/**
 * 按需从 CDN 加载脚本，自动去重。
 * @param src 脚本 URL
 * @param integrity SRI hash（可选，强烈建议提供以防止 CDN 劫持）
 */
export function ensureScript(src: string, integrity?: string): Promise<void> {
    return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const s = document.createElement("script");
        // crossorigin 必须在 src 之前设置
        if (integrity) {
            s.crossOrigin = "anonymous";
            s.integrity = integrity;
        }
        s.src = src;
        s.onload = () => resolve();
        document.head.appendChild(s);
    });
}

/**
 * 按需从 CDN 加载样式，自动去重。
 * @param href 样式 URL
 * @param id 可选 ID 用于去重
 * @param integrity SRI hash（可选，强烈建议提供）
 */
export function ensureLink(href: string, id?: string, integrity?: string): void {
    const selector = id ? `link[href="${href}"], link[id="${id}"]` : `link[href="${href}"]`;
    if (document.querySelector(selector)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    if (integrity) {
        l.crossOrigin = "anonymous";
        l.integrity = integrity;
    }
    l.href = href;
    if (id) l.id = id;
    document.head.appendChild(l);
}
