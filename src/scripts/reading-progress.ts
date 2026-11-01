/**
 * 阅读进度条（D-0089）。
 *
 * 原来靠 CSS 滚动动画（`animation-timeline: scroll(root)`）。这条链上有两个不稳的环节：
 *
 * 1. 压缩器（lightningcss）会把 `animation` 简写和 `animation-timeline` 合并成
 *    `animation: linear reading-progress scroll(root)`，Chrome 不接受这种「简写里带时间轴」的写法，
 *    整条声明被丢弃 —— computed 变成 `animation-name: none`，进度条只剩一条 2px 实线，永远不动。
 * 2. 就算声明保住了，滚动时间轴在部分环境里也不活跃（实测无头 Chrome 里
 *    `getAnimations()[0].currentTime` 恒为 null，页面能滚但动画不走）。
 *
 * 所以改回最笨也最稳的做法：document 级 scroll + rAF，直接写 transform。
 * 成本是一次 passive scroll 监听 + 每帧一次样式写入，画面上没有布局计算。
 * 用常驻模块 + 事件委托（D-0080），SPA 换页后换的是元素，不是监听器。
 */

import { onPageReady } from "~/utils/page-lifecycle";

let bound = false;
let bar: HTMLElement | null = null;
let ticking = false;

function update(): void {
    ticking = false;
    if (!bar || !bar.isConnected) return;
    const se = (document.scrollingElement || document.documentElement) as HTMLElement;
    const max = se.scrollHeight - se.clientHeight;
    const progress = max > 0 ? se.scrollTop / max : 0;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}

function schedule(): void {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
}

onPageReady(() => {
    bar = document.querySelector<HTMLElement>(".reading-progress");
    if (!bound) {
        bound = true;
        document.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule, { passive: true });
    }
    update();
});
