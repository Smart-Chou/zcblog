/**
 * 首屏 + SPA 换页都要跑一次的初始化。
 *
 * 背景（D-0070）：ClientRouter 时代 `astro:page-load` 在**首屏**也会派发，
 * 换成 @swup/astro 之后，首次 `page:view` 在我们这些组件模块执行之前就派发完了
 * （swup 在 head 里初始化，模块脚本是 deferred）。结果是只监听该事件的组件
 * ——TOC、mermaid、评论、tabs、返回顶部、a11y 滚动区——首屏完全不初始化：
 * 目录空白、图表不渲染、页面看着「少了东西」，刷新也一样。
 *
 * 约定与仓库里已有的十来个组件保持一致：`DOMContentLoaded` 跑一次首屏，
 * `astro:page-load` 跑每一次换页。不要只监听 page-load。
 */
export function onPageReady(fn: () => void): void {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
        fn();
    }
    document.addEventListener("astro:page-load", fn);
}
