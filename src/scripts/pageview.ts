/**
 * 文章浏览量（Waline pageview）的常驻初始化（D-0090）。
 *
 * 原来这个 util 由文章页/列表页的组件各自 `import "~/utils/waline-pageview"`。
 * SPA 换页时 `@swup/astro` 的 head 插件只会搬 `link[rel=stylesheet] / script[src] / style`，
 * 而同样的 module URL 在同一个 document 里**只会执行一次**（模块映射去重），
 * 于是「从别的页面点进文章」这条路径上 util 根本没跑：
 * 没有 /article 请求、`.waline-pageview-count` 一直停在构建期渲染的 0。
 * 直开/刷新文章页则正常（模块首次执行）—— 症状与用户反馈完全一致。
 *
 * 修法沿用 D-0080 的结论：把「按页初始化」搬到 BaseLayout 的常驻模块里，
 * 用 document 级事件驱动，别再指望页面级脚本被重新执行。
 * 这里再叠一层按需加载：没有计数元素的页面不下载 waline 的 pageview 模块。
 */

import { onPageReady } from "~/utils/page-lifecycle";

type PageviewModule = { initWalinePageview: () => void };

let loading: Promise<PageviewModule> | null = null;
/** 已经上报过的 path，避免同一次导航里重复计数（模块异步加载期间可能重复触发） */
let lastPath: string | null = null;

function ensureModule(): Promise<PageviewModule> {
    loading ??= import("~/utils/waline-pageview") as Promise<PageviewModule>;
    return loading;
}

function run(): void {
    if (!document.querySelector(".waline-pageview-count")) return;
    const path = location.pathname + location.search;
    if (path === lastPath) return;
    lastPath = path;

    void ensureModule()
        .then((mod) => {
            // 异步加载期间用户可能已经又换页了，此时不再替旧页面计数
            if (location.pathname + location.search !== path) return;
            mod.initWalinePageview();
        })
        .catch((err) => {
            console.error("[pageview]", err);
        });
}

if (typeof document !== "undefined") {
    onPageReady(run);
}
