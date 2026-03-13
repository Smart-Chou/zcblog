/**
 * 初始化文章内容图片的 PhotoSwipe 支持。
 * 使用统一的 PhotoSwipe 工具模块，提供更好的代码复用和维护性。
 */

import { initArticlePhotoSwipe } from '../utils/photoswipe';

// 页面加载后初始化
document.addEventListener('astro:page-load', initArticlePhotoSwipe);

// 如果页面已加载，立即初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initArticlePhotoSwipe);
} else {
  initArticlePhotoSwipe();
}
