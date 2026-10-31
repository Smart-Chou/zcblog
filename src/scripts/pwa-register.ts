/**
 * 注册 Service Worker（D-0068）。
 *
 * 背景：vite-plugin-pwa 在本仓（Astro 7 / Vite 7）下不会自动注入注册脚本，
 * 而 `astro:build:done` 里我们又用 `api.generateSW()` 手工补了 sw.js 生成，
 * 于是长期以来 sw.js 每版都传、却从没被注册过——离线能力是死代码。
 *
 * 预览构建（PREVIEW_BUILD=1）必须跳过：那里写入的是一份「自毁 sw.js」
 * （activate 时清缓存 → 注销自己 → 重载窗口），再注册就会无限循环。
 * `__PWA_ENABLED__` 由 astro.config.mjs 的 vite.define 在构建期替换，
 * 预览构建里整段会被编译掉，产物中不留痕迹。
 */
declare const __PWA_ENABLED__: boolean;

const pwaEnabled = typeof __PWA_ENABLED__ === "boolean" ? __PWA_ENABLED__ : true;

if (pwaEnabled && typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
            // 注册失败不该影响页面可用性（隐私模式、企业策略都会拦）
            console.warn("[pwa] Service Worker 注册失败：", error);
        });
    });
}
