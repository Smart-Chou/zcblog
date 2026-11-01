/**
 * 页内 tab 切换（豆瓣页：书籍/影视/音乐；番组页：动画/书籍/音乐/游戏/影视）。
 *
 * 为什么不写在组件里（D-0080）：
 * 组件里的 `<script type="module">` 会被 Astro 内联进 `<head>`，而 swup 的 head 插件
 * 只搬运 `link[rel=stylesheet] / script[src] / style` —— **内联 module 脚本在 SPA 换页时
 * 既不会被插入新 head、也不会被执行**。于是从别的页面点进 /douban/，tab 点了完全没反应
 * （直开或强刷却正常，这正是用户报告的「豆瓣页切不了」）。
 * 放进 BaseLayout 的常驻模块 + 事件委托，直开、换页、回退三条路径都成立。
 */

const BTN = "[data-tab]";

function doubanActivate(root: ParentNode, id: string): void {
    root.querySelectorAll<HTMLElement>(".tab-btn[data-tab]").forEach((btn) => {
        const on = btn.getAttribute("data-tab") === id;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-selected", String(on));
    });
    root.querySelectorAll<HTMLElement>(".tab-section[data-section]").forEach((sec) => {
        sec.classList.toggle("hidden", sec.getAttribute("data-section") !== id);
    });
}

function bangumiActivate(root: ParentNode, id: string): void {
    root.querySelectorAll<HTMLElement>(".tab-btn[data-tab]").forEach((btn) => {
        const on = btn.getAttribute("data-tab") === id;
        btn.classList.toggle("active", on);
        btn.setAttribute("aria-selected", String(on));
    });
    root.querySelectorAll<HTMLElement>(".bangumi-section").forEach((sec) => {
        const on = sec.getAttribute("data-section") === id;
        sec.style.display = on ? "block" : "none";
        if (!on) return;
        // 卡片图是懒加载的（data-src），切到该 tab 才真正取图
        sec.querySelectorAll<HTMLImageElement>("img[data-src]").forEach((img) => {
            const src = img.getAttribute("data-src");
            if (src) {
                img.src = src;
                img.removeAttribute("data-src");
            }
        });
    });
    const paginate = (window as unknown as { initPagination?: () => void }).initPagination;
    if (typeof paginate === "function") paginate();
}

function activate(btn: HTMLElement): void {
    const id = btn.getAttribute("data-tab");
    if (!id) return;
    const root = btn.closest("main") ?? document.body;

    if (root.querySelector(".bangumi-section")) bangumiActivate(root, id);
    else if (root.querySelector(".tab-section[data-section]")) doubanActivate(root, id);
}

/** 首屏 / 换页后：把「当前 active 的按钮」与实际显示同步一次（番组页初始靠内联 display） */
function sync(): void {
    document.querySelectorAll<HTMLElement>(".tab-nav").forEach((nav) => {
        const root = nav.closest("main") ?? document.body;
        if (!nav.querySelector(".bangumi-section") && !root.querySelector(".bangumi-section"))
            return;
        const active =
            nav.querySelector<HTMLElement>(".tab-btn[data-tab].active") ??
            nav.querySelector<HTMLElement>(".tab-btn[data-tab]");
        const id = active?.getAttribute("data-tab");
        if (id) bangumiActivate(root, id);
    });
}

// 委托：按钮随 <main> 被替换，绑在 document 上永远有效，且只绑一次
document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    const btn = target?.closest?.<HTMLElement>(BTN);
    if (!btn) return;
    activate(btn);
});

document.addEventListener("astro:page-load", sync);
if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", sync, { once: true });
else sync();
