/**
 * 相册页面 Fancybox 初始化脚本
 */

import { initAlbumFancybox } from "~/utils/fancybox";

document.addEventListener("astro:page-load", initAlbumFancybox);

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAlbumFancybox);
} else {
    initAlbumFancybox();
}
