/// <reference types="astro/client" />

/**
 * PhotoSwipe 工具模块
 * 提供统一的图片画廊初始化功能，支持动态扫描和静态画廊两种模式
 */

/**
 * 检测当前是否为生产环境
 */
function isProduction(): boolean {
    // Astro 环境变量
    if (typeof import.meta !== "undefined" && import.meta.env) {
        return import.meta.env.PROD === true;
    }
    // Node.js 环境变量（使用类型断言避免 TypeScript 错误）
    if (typeof process !== "undefined" && (process as any).env) {
        return (process as any).env.NODE_ENV === "production";
    }
    // 默认开发环境
    return false;
}

export interface PhotoSwipeOptions {
    /** 画廊容器选择器 */
    gallerySelector: string;
    /** 画廊项选择器 */
    itemSelector: string;
    /** 是否显示下载按钮 */
    showDownloadButton?: boolean;
    /** 下载按钮标题 */
    downloadButtonTitle?: string;
    /** 背景透明度 (0-1) */
    bgOpacity?: number;
    /** 图片间距 (0-1) */
    spacing?: number;
    /** 是否启用鼠标滚轮缩放 */
    wheelToZoom?: boolean;
    /** 是否启用捏合关闭 */
    pinchToClose?: boolean;
    /** 是否启用垂直拖动关闭 */
    closeOnVerticalDrag?: boolean;
    /** 内边距 */
    padding?: { top: number; bottom: number; left: number; right: number };
    /** 是否显示上一张/下一张箭头 */
    arrowPrev?: boolean;
    arrowNext?: boolean;
    /** 是否启用键盘导航 */
    arrowKeys?: boolean;
    /** 是否启用缩放 */
    zoom?: boolean;
    /** 最大缩放级别 */
    maxZoomLevel?: number;
    /** 次要缩放级别 */
    secondaryZoomLevel?: number;
    /** 是否显示关闭按钮 */
    close?: boolean;
    /** 是否显示计数器 */
    counter?: boolean;
    /** 是否启用调试模式 */
    debug?: boolean;
}

export interface DynamicGalleryOptions extends PhotoSwipeOptions {
    /** 动态扫描模式：图片源选择器 */
    imageSelector?: string;
    /** 动态扫描模式：是否添加悬停效果 */
    addHoverEffects?: boolean;
    /** 动态扫描模式：图片尺寸获取策略 */
    sizeStrategy?: "natural" | "preload" | "default";
}

export interface StaticGalleryOptions extends PhotoSwipeOptions {
    /** 静态画廊模式：预加载图片尺寸 */
    preloadDimensions?: boolean;
}

/**
 * 默认 PhotoSwipe 配置
 */
export const DEFAULT_OPTIONS: PhotoSwipeOptions = {
    gallerySelector: "#photoswipe-gallery",
    itemSelector: "a",
    showDownloadButton: true,
    downloadButtonTitle: "下载",
    bgOpacity: 0.9,
    spacing: 0.05,
    wheelToZoom: true,
    pinchToClose: false,
    closeOnVerticalDrag: true,
    padding: { top: 20, bottom: 40, left: 20, right: 20 },
    arrowPrev: true,
    arrowNext: true,
    arrowKeys: true,
    zoom: true,
    maxZoomLevel: 4,
    secondaryZoomLevel: 2,
    close: true,
    counter: true,
    debug: false,
};

/**
 * 动态扫描模式默认配置
 */
export const DEFAULT_DYNAMIC_OPTIONS: DynamicGalleryOptions = {
    ...DEFAULT_OPTIONS,
    gallerySelector: "#content-photoswipe-gallery",
    imageSelector: "img",
    addHoverEffects: true,
    sizeStrategy: "natural",
    debug: false,
};

/**
 * 静态画廊模式默认配置
 */
export const DEFAULT_STATIC_OPTIONS: StaticGalleryOptions = {
    ...DEFAULT_OPTIONS,
    preloadDimensions: true,
    debug: false,
};

/**
 * 加载 PhotoSwipe CSS
 */
async function loadPhotoSwipeCSS(debug: boolean = false): Promise<void> {
    // 检查是否已加载 PhotoSwipe CSS
    if (document.querySelector('link[href*="photoswipe"]')) {
        if (debug) console.log("PhotoSwipe CSS 已加载");
        return;
    }

    try {
        await import("photoswipe/style.css");
        if (debug) console.log("PhotoSwipe CSS 动态加载成功");
    } catch (error) {
        console.warn("动态加载 PhotoSwipe CSS 失败，尝试使用 CDN 回退", error);
        // CDN 回退
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/photoswipe@5.4.4/dist/photoswipe.css";
        document.head.appendChild(link);
    }
}

/**
 * 注册下载按钮
 */
function registerDownloadButton(lightbox: any, title: string = "下载"): void {
    if (!lightbox.pswp?.ui) {
        console.warn("无法注册下载按钮：PhotoSwipe UI 未初始化");
        return;
    }

    lightbox.pswp.ui.registerElement({
        name: "download-button",
        order: 8,
        isButton: true,
        html: `<button class="pswp__button pswp__button--download" title="${title}"></button>`,
        onClick: (_event: Event, _el: HTMLElement, pswp: any) => {
            const item = pswp.currSlide?.data;
            if (item?.src) {
                window.open(item.src, "_blank");
            }
        },
    });
}

/**
 * 预加载图片尺寸（用于静态画廊）
 */
async function preloadImageDimensions(
    gallerySelector: string,
    itemSelector: string,
    debug: boolean = false,
): Promise<void> {
    const gallery = document.querySelector(gallerySelector);
    if (!gallery) {
        console.warn(`未找到画廊容器: ${gallerySelector}`);
        return;
    }

    const items = gallery.querySelectorAll(itemSelector);
    const promises: Promise<void>[] = [];

    items.forEach((item, index) => {
        const img = item.querySelector("img");
        if (!img) return;

        // 如果图片已经加载完成，直接获取尺寸
        if (img.complete && img.naturalWidth > 0) {
            item.setAttribute("data-pswp-width", img.naturalWidth.toString());
            item.setAttribute("data-pswp-height", img.naturalHeight.toString());
            if (debug)
                console.log(
                    `图片 ${index} 尺寸: ${img.naturalWidth}x${img.naturalHeight} (缓存)`,
                );
            return;
        }

        // 否则创建一个 Promise 来加载图片
        const promise = new Promise<void>((resolve) => {
            const loader = new Image();
            loader.src = img.src;
            loader.onload = () => {
                item.setAttribute(
                    "data-pswp-width",
                    loader.naturalWidth.toString(),
                );
                item.setAttribute(
                    "data-pswp-height",
                    loader.naturalHeight.toString(),
                );
                if (debug)
                    console.log(
                        `图片 ${index} 尺寸: ${loader.naturalWidth}x${loader.naturalHeight} (加载)`,
                    );
                resolve();
            };
            loader.onerror = () => {
                // 加载失败时使用默认尺寸
                console.warn(`加载图片失败: ${img.src}`);
                item.setAttribute("data-pswp-width", "1920");
                item.setAttribute("data-pswp-height", "1280");
                resolve();
            };
        });
        promises.push(promise);
    });

    await Promise.all(promises);
    if (debug) console.log(`所有图片尺寸预加载完成 (${items.length} 张图片)`);
}

/**
 * 获取图片自然尺寸
 */
function getImageNaturalSize(img: HTMLImageElement): {
    width: number;
    height: number;
} {
    let width = img.naturalWidth || img.width || 1920;
    let height = img.naturalHeight || img.height || 1080;

    // 如果尺寸为 0，使用默认值
    if (width === 0 || height === 0) {
        width = 1920;
        height = 1080;
    }

    return { width, height };
}

/**
 * 为图片添加悬停效果
 */
function addImageHoverEffects(img: HTMLImageElement): void {
    img.style.cursor = "zoom-in";
    img.style.transition = "transform 0.2s ease";

    img.addEventListener("mouseenter", () => {
        img.style.transform = "scale(1.02)";
    });

    img.addEventListener("mouseleave", () => {
        img.style.transform = "scale(1)";
    });
}

/**
 * 初始化动态扫描模式的 PhotoSwipe
 * 适用于文章内容等动态生成的图片
 */
export async function initDynamicPhotoSwipe(
    contentSelector: string = ".post__content",
    options: Partial<DynamicGalleryOptions> = {},
): Promise<{ lightbox: any; cleanup: () => void } | null> {
    // 如果未指定调试模式，根据环境自动设置（开发环境开启，生产环境关闭）
    const debug = options.debug ?? !isProduction();
    const config = { ...DEFAULT_DYNAMIC_OPTIONS, ...options, debug };

    try {
        if (debug) console.log("初始化动态扫描模式 PhotoSwipe");

        // 查找内容区域
        const content = document.querySelector(contentSelector);
        if (!content) {
            if (debug) console.warn(`未找到内容区域: ${contentSelector}`);
            return null;
        }

        // 查找所有图片
        const images = content.querySelectorAll<HTMLImageElement>(
            config.imageSelector || "img",
        );
        if (images.length === 0) {
            if (debug) console.log("内容区域没有图片");
            return null;
        }

        if (debug) console.log(`找到 ${images.length} 张图片`);

        // 创建隐藏的 PhotoSwipe 画廊容器
        const galleryContainer = document.createElement("div");
        galleryContainer.id = config.gallerySelector.substring(1);
        galleryContainer.style.display = "none";
        galleryContainer.style.position = "absolute";
        galleryContainer.style.zIndex = "-9999";
        galleryContainer.style.opacity = "0";
        galleryContainer.style.pointerEvents = "none";

        const imageData: Array<{
            src: string;
            width: number;
            height: number;
            alt: string;
            element: HTMLImageElement;
            index: number;
        }> = [];

        // 遍历图片，创建画廊项并存储数据
        images.forEach((img, index) => {
            const { width, height } = getImageNaturalSize(img);

            // 创建画廊链接
            const link = document.createElement("a");
            link.href = img.src;
            link.setAttribute("data-pswp-src", img.src);
            link.setAttribute("data-pswp-width", width.toString());
            link.setAttribute("data-pswp-height", height.toString());
            link.setAttribute("data-caption", img.alt || "");
            link.setAttribute("data-index", index.toString());

            // 复制图片用于画廊容器
            const imgClone = img.cloneNode(true) as HTMLImageElement;
            link.appendChild(imgClone);
            galleryContainer.appendChild(link);

            // 存储图片数据
            imageData.push({
                src: img.src,
                width,
                height,
                alt: img.alt || "",
                element: img,
                index,
            });

            // 为原图添加点击事件和样式
            if (config.addHoverEffects) {
                addImageHoverEffects(img);
            } else {
                img.style.cursor = "zoom-in";
            }

            // 点击事件
            img.addEventListener("click", (e) => {
                e.preventDefault();
                openPhotoSwipe(index);
            });
        });

        // 将画廊容器添加到页面
        document.body.appendChild(galleryContainer);

        // PhotoSwipe 实例
        let lightbox: any = null;
        let isPhotoSwipeReady = false;

        // 打开 PhotoSwipe
        const openPhotoSwipe = (index: number) => {
            if (!lightbox || !isPhotoSwipeReady) {
                console.warn("PhotoSwipe 未初始化，请稍后再试");
                // 显示用户友好的提示
                const img = imageData[index]?.element;
                if (img) {
                    const originalCursor = img.style.cursor;
                    img.style.cursor = "not-allowed";
                    setTimeout(() => {
                        img.style.cursor = originalCursor;
                    }, 1000);
                }
                return;
            }

            // 加载并打开指定索引的图片
            lightbox.loadAndOpen(index);
        };

        // 加载 PhotoSwipe 资源
        await loadPhotoSwipeCSS(debug);
        const { default: PhotoSwipeLightbox } =
            await import("photoswipe/lightbox");

        // 创建 PhotoSwipe 实例
        lightbox = new PhotoSwipeLightbox({
            gallery: config.gallerySelector,
            children: config.itemSelector,
            pswpModule: () => import("photoswipe"),
            showHideAnimationType: "fade",
            zoomAnimationDuration: 300,
            bgOpacity: config.bgOpacity,
            spacing: config.spacing,
            wheelToZoom: config.wheelToZoom,
            pinchToClose: config.pinchToClose,
            closeOnVerticalDrag: config.closeOnVerticalDrag,
            padding: config.padding,
            arrowPrev: config.arrowPrev,
            arrowNext: config.arrowNext,
            arrowKeys: config.arrowKeys,
            zoom: config.zoom,
            maxZoomLevel: config.maxZoomLevel,
            secondaryZoomLevel: config.secondaryZoomLevel,
            close: config.close,
            counter: config.counter,
        });

        // 注册下载按钮
        if (config.showDownloadButton) {
            lightbox.on("uiRegister", () => {
                registerDownloadButton(lightbox, config.downloadButtonTitle);
            });
        }

        // 初始化
        lightbox.init();
        isPhotoSwipeReady = true;

        if (debug)
            console.log(
                `PhotoSwipe lightbox 初始化完成，图片数量: ${imageData.length}`,
            );

        // 初始化完成后，更新所有图片的光标样式为可点击
        imageData.forEach(({ element }) => {
            if (element) {
                element.style.cursor = "zoom-in";
            }
        });

        // 页面卸载时清理
        const cleanup = () => {
            if (lightbox) {
                lightbox.destroy();
                lightbox = null;
            }
            isPhotoSwipeReady = false;
            if (galleryContainer && galleryContainer.parentNode) {
                galleryContainer.parentNode.removeChild(galleryContainer);
            }
            if (debug) console.log("PhotoSwipe 清理完成");
        };

        // 监听页面卸载
        window.addEventListener("beforeunload", cleanup);
        document.addEventListener("astro:page-load", cleanup);

        return { lightbox, cleanup };
    } catch (error) {
        console.error("初始化动态 PhotoSwipe 时出错:", error);
        return null;
    }
}

/**
 * 初始化静态画廊模式的 PhotoSwipe
 * 适用于相册等预定义结构的图片画廊
 */
export async function initStaticPhotoSwipe(
    options: Partial<StaticGalleryOptions> = {},
): Promise<{ lightbox: any; cleanup: () => void } | null> {
    // 如果未指定调试模式，根据环境自动设置（开发环境开启，生产环境关闭）
    const debug = options.debug ?? !isProduction();
    const config = { ...DEFAULT_STATIC_OPTIONS, ...options, debug };
    const { gallerySelector, itemSelector, preloadDimensions } = config;

    try {
        if (debug) console.log("初始化静态画廊模式 PhotoSwipe");

        // 检查画廊容器是否存在
        const gallery = document.querySelector(gallerySelector);
        if (!gallery) {
            console.warn(`未找到画廊容器: ${gallerySelector}`);
            return null;
        }

        // 预加载图片尺寸
        if (preloadDimensions) {
            await preloadImageDimensions(gallerySelector, itemSelector, debug);
        }

        // 加载 PhotoSwipe 资源
        await loadPhotoSwipeCSS(debug);
        const { default: PhotoSwipeLightbox } =
            await import("photoswipe/lightbox");

        // 创建 PhotoSwipe 实例
        const lightbox = new PhotoSwipeLightbox({
            gallery: gallerySelector,
            children: itemSelector,
            pswpModule: () => import("photoswipe"),
            showHideAnimationType: "fade",
            zoomAnimationDuration: 300,
            bgOpacity: config.bgOpacity,
            spacing: config.spacing,
            wheelToZoom: config.wheelToZoom,
            pinchToClose: config.pinchToClose,
            closeOnVerticalDrag: config.closeOnVerticalDrag,
            padding: config.padding,
            arrowPrev: config.arrowPrev,
            arrowNext: config.arrowNext,
            arrowKeys: config.arrowKeys,
            zoom: config.zoom,
            maxZoomLevel: config.maxZoomLevel,
            secondaryZoomLevel: config.secondaryZoomLevel,
            close: config.close,
            counter: config.counter,
        });

        // 注册下载按钮
        if (config.showDownloadButton) {
            lightbox.on("uiRegister", () => {
                registerDownloadButton(lightbox, config.downloadButtonTitle);
            });
        }

        // 初始化
        lightbox.init();

        if (debug) console.log("PhotoSwipe 静态画廊初始化完成");

        // 清理函数
        const cleanup = () => {
            if (lightbox) {
                lightbox.destroy();
            }
            if (debug) console.log("PhotoSwipe 静态画廊清理完成");
        };

        // 监听页面卸载
        window.addEventListener("beforeunload", cleanup);
        document.addEventListener("astro:page-load", cleanup);

        return { lightbox, cleanup };
    } catch (error) {
        console.error("初始化静态 PhotoSwipe 时出错:", error);
        return null;
    }
}

/**
 * 简化版初始化函数 - 自动检测模式
 */
export async function initPhotoSwipe(
    selector: string = ".post__content",
    options: Partial<PhotoSwipeOptions> = {},
): Promise<void> {
    // 如果未指定调试模式，根据环境自动设置（开发环境开启，生产环境关闭）
    const debug = options.debug ?? !isProduction();
    const config = { ...DEFAULT_OPTIONS, ...options, debug };

    // 检查是否存在预定义画廊
    const gallery = document.querySelector(config.gallerySelector);
    if (gallery && gallery.querySelector(config.itemSelector)) {
        if (debug) console.log("检测到静态画廊，使用静态模式");
        await initStaticPhotoSwipe(config);
    } else {
        if (debug) console.log("未检测到静态画廊，使用动态扫描模式");
        await initDynamicPhotoSwipe(selector, config);
    }
}

/**
 * 便捷函数：初始化文章内容图片的 PhotoSwipe
 */
export function initArticlePhotoSwipe(): void {
    if (typeof document === "undefined") return;

    const init = async () => {
        await initDynamicPhotoSwipe(".post__content", { debug: false });
    };

    // 页面加载后初始化
    document.addEventListener("astro:page-load", init);

    // 如果页面已加载，立即初始化
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
}

/**
 * 便捷函数：初始化相册图片的 PhotoSwipe
 */
export function initAlbumPhotoSwipe(): void {
    if (typeof document === "undefined") return;

    const init = async () => {
        await initStaticPhotoSwipe({
            gallerySelector: "#photoswipe-gallery",
            itemSelector: "a.photo-item",
            debug: false,
        });
    };

    document.addEventListener("astro:page-load", init);
}
