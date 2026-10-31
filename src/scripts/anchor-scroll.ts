/**
 * 锚点跳转的统一偏移（D-0075）。
 *
 * 背景：v1 靠 `html { scroll-padding-top: 100px }` 让标题落在导航栏下方；
 * 换成 swup 后，站内 `#hash` 点击由 swup 的滚动插件接管，它按元素
 * offsetTop 直接滚，**不认 scroll-padding-top** —— 实测标题被顶到
 * `top: 0`，正好压在 72px 高的导航栏下面。
 *
 * 做法：在捕获阶段接管同页锚点点击（先于 swup 的冒泡监听），
 * 自己算 offset 再滚，并用 replaceState 更新地址栏，保持单条历史记录。
 * 偏移量优先读 `scroll-padding-top`，保持与 CSS 单一来源。
 */

function headerOffset(): number {
    const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    if (Number.isFinite(padding) && padding > 0) return padding;

    const nav = document.querySelector<HTMLElement>(".nav-shell");
    return nav ? nav.getBoundingClientRect().height + 16 : 100;
}

function scrollToHash(hash: string, smooth = true): boolean {
    let id: string;
    try {
        id = decodeURIComponent(hash.replace(/^#/, ""));
    } catch {
        id = hash.replace(/^#/, "");
    }
    if (!id) return false;

    const target = document.getElementById(id);
    if (!target) return false;

    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset());
    window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
    return true;
}

document.addEventListener(
    "click",
    (event) => {
        if (event.defaultPrevented) return;

        const anchor = (event.target as HTMLElement | null)?.closest?.(
            'a[href^="#"]',
        ) as HTMLAnchorElement | null;
        if (!anchor) return;

        const hash = anchor.getAttribute("href");
        if (!hash || hash === "#") return;
        if (!scrollToHash(hash)) return;

        event.preventDefault();
        event.stopPropagation();
        history.replaceState(null, "", hash);
    },
    true,
);

// 从别处带着 hash 进来（或 SPA 换页后 URL 仍有 hash）时，按同一偏移对齐
document.addEventListener("astro:page-load", () => {
    if (!location.hash) return;
    requestAnimationFrame(() => scrollToHash(location.hash, false));
});
