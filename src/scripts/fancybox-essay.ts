/**
 * 初始化随笔图片的 Fancybox 支持。
 */

import { initEssayFancybox } from "~/utils/fancybox";

document.addEventListener("astro:page-load", initEssayFancybox);

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEssayFancybox);
} else {
    initEssayFancybox();
}
