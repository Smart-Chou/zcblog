/**
 * 按需从 CDN 加载脚本，自动去重
 */
export function ensureScript(src: string): Promise<void> {
    return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => resolve();
        document.head.appendChild(s);
    });
}

/**
 * 按需从 CDN 加载样式，自动去重
 */
export function ensureLink(href: string, id?: string): void {
    const selector = id ? `link[href="${href}"], link[id="${id}"]` : `link[href="${href}"]`;
    if (document.querySelector(selector)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    if (id) l.id = id;
    document.head.appendChild(l);
}
