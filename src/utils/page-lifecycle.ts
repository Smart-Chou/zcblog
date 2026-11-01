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
 *
 * 背景二（D-0080）：`@swup/astro` 开着 `reloadScripts`，**每次换页会把页面里的
 * script 全部重新执行一遍**（包括打包后的模块脚本，模块作用域因此会被重置成初始值）。
 * 于是每个组件的 `onPageReady` 调用都会再往 document 上挂一个 `astro:page-load`
 * 监听器，换 N 次页就有 N 份；每次事件要把 N 份初始化逻辑全跑一遍，越用越慢。
 * 这里用「函数体文本」做去重键：模块被重复执行时，同一个组件传进来的 fn 源码完全一致，
 * 于是第二次起只登记一次。真正需要「每次换页都跑」的仍然是同一个 fn，在派发时统一跑。
 */

type ReadyFn = () => void;

interface Registry {
    /** 已登记的回调：key = fn.toString()，value = 实际函数（取首次登记的那份） */
    fns: Map<string, ReadyFn>;
    /** 是否已经挂过 astro:page-load 派发器 */
    bound: boolean;
    /** 是否已经挂过首屏 DOMContentLoaded 派发器 */
    dclBound: boolean;
}

const w = window as unknown as { __pageReadyRegistry?: Registry };

function registry(): Registry {
    if (!w.__pageReadyRegistry) {
        w.__pageReadyRegistry = { fns: new Map(), bound: false, dclBound: false };
    }
    return w.__pageReadyRegistry;
}

/**
 * 换页后的入场动画（D-0084）。
 *
 * 不用 @swup/fade-theme：它把淡出和淡入串在换页链路里，swup 要等淡出结束才替换内容，
 * 实测每次换页多花 0.7–2.4s。这里改成「先换、再淡入」——动画不参与换页时序。
 * 只动 opacity，不加 transform：`main` 上任何 transform 都会给 fixed 的 TOC / 返回顶部
 * 造出新的包含块，滚动时它们会跳。
 */
function playEnterAnimation(): void {
    const main = document.querySelector("main");
    if (!main) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    // 后台标签页里动画时间轴会被节流成「停在第一帧」，那种情况下宁可不播（否则整页偏暗）
    if (document.visibilityState !== "visible") return;
    main.classList.remove("page-enter");
    // 强制重排，让动画能被重新触发
    void main.getBoundingClientRect();
    main.classList.add("page-enter");
}

function dispatch(): void {
    playEnterAnimation();
    const { fns } = registry();
    fns.forEach((fn) => {
        try {
            fn();
        } catch (err) {
            // 单个组件炸掉不该拖死整页初始化
            console.error("[page-ready]", err);
        }
    });
}

export function onPageReady(fn: ReadyFn): void {
    const reg = registry();
    const key = fn.toString();
    const isNew = !reg.fns.has(key);

    if (isNew) reg.fns.set(key, fn);

    if (!reg.bound) {
        reg.bound = true;
        document.addEventListener("astro:page-load", dispatch);
    }

    if (document.readyState === "loading") {
        // 首屏：统一等 DOMContentLoaded 再一次性跑，避免「后登记的把先登记的又跑一遍」
        if (!reg.dclBound) {
            reg.dclBound = true;
            document.addEventListener("DOMContentLoaded", dispatch, { once: true });
        }
        return;
    }

    // 模块被重复执行（换页 reloadScripts）：这份 fn 早就登记过，不要重复跑
    if (!isNew) return;
    try {
        fn();
    } catch (err) {
        console.error("[page-ready]", err);
    }
}
