/**
 * 初始化文章内容图片的 Fancybox 支持。
 */

import { initArticleFancybox } from "~/utils/fancybox";

document.addEventListener("astro:page-load", initArticleFancybox);

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initArticleFancybox);
} else {
    initArticleFancybox();
}
