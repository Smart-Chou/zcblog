/// <reference types="astro/client" />

/**
 * Fancybox 工具模块
 * 提供统一的图片画廊初始化功能，支持动态扫描和静态画廊两种模式
 */

/**
 * 检测当前是否为生产环境
 */
function isProduction(): boolean {
    if (typeof import.meta !== "undefined" && import.meta.env) {
        return import.meta.env.PROD === true;
    }
    if (typeof process !== "undefined" && (process as any).env) {
        return (process as any).env.NODE_ENV === "production";
    }
    return false;
}

interface FancyboxOptions {
    /** 画廊容器选择器 */
    gallerySelector: string;
    /** 是否启用键盘导航 */
    keyboard?: boolean;
    /** 背景透明度 (0-1) */
    backdropOpacity?: number;
    /** 是否显示关闭按钮 */
    closeButton?: boolean;
    /** 是否显示计数器 */
    counter?: boolean;
    /** 动画类型 */
    animationEffect?: "slide" | "zoom" | "fade" | false;
    /** 过渡动画时长 */
    transitionDuration?: number;
    /** 是否启用调试模式 */
    debug?: boolean;
}

const DEFAULT_OPTIONS: FancyboxOptions = {
    gallerySelector: "#fancybox-gallery",
    keyboard: true,
    backdropOpacity: 0.9,
    closeButton: true,
    counter: true,
    animationEffect: "slide",
    transitionDuration: 300,
};

/**
 * 初始化动态扫描模式的 Fancybox
 */
async function initDynamicFancybox(
    contentSelector: string = ".post-content",
    options: Partial<FancyboxOptions> = {},
): Promise<void> {
    const debug = options.debug ?? !isProduction();

    try {
        if (debug) console.log("初始化动态扫描模式 Fancybox");

        const content = document.querySelector(contentSelector);
        if (!content) return;

        const images = content.querySelectorAll<HTMLImageElement>("img");
        if (images.length === 0) return;

        if (debug) console.log(`找到 ${images.length} 张图片`);

        images.forEach((img) => {
            if (img.closest("a")) return;
            if (img.classList.contains("plantuml-image")) return;

            img.style.cursor = "zoom-in";

            const link = document.createElement("a");
            link.href = img.src;
            link.setAttribute("data-fancybox", "gallery");
            link.setAttribute("data-caption", img.alt || "");
            link.style.display = "contents";

            img.parentNode?.insertBefore(link, img);
            link.appendChild(img);
        });

        const { Fancybox } = await import("@fancyapps/ui");
        Fancybox.bind(contentSelector + " img[src]", {
            groupAll: true,
            Carousel: { transition: "slide" },
        });

        if (debug) console.log("Fancybox 绑定完成");
    } catch (error) {
        console.error("初始化动态 Fancybox 时出错:", error);
    }
}

/**
 * 初始化静态画廊模式的 Fancybox
 */
async function initStaticFancybox(options: Partial<FancyboxOptions> = {}): Promise<void> {
    const debug = options.debug ?? !isProduction();
    const config = { ...DEFAULT_OPTIONS, ...options, debug };

    try {
        if (debug) console.log("初始化静态画廊模式 Fancybox");

        const gallery = document.querySelector(config.gallerySelector);
        if (!gallery) return;

        const { Fancybox } = await import("@fancyapps/ui");

        Fancybox.bind(`${config.gallerySelector} a[href]`, {
            groupAll: true,
            Carousel: { transition: config.animationEffect as any },
        });

        if (debug) console.log("Fancybox 静态画廊初始化完成");
    } catch (error) {
        console.error("初始化静态 Fancybox 时出错:", error);
    }
}

/**
 * 注册一个 Fancybox 初始化函数，自动处理 SSR、astro:page-load 和首屏加载
 */
// 防止 View Transitions 跨页面导航时重复注册监听器
const _fancyboxHandlers = new Set<() => Promise<void>>();

function registerFancybox(fn: () => Promise<void>): void {
    if (typeof document === "undefined") return;

    // 同名函数已注册则跳过
    if (_fancyboxHandlers.has(fn)) return;
    _fancyboxHandlers.add(fn);

    const init = async () => {
        await fn();
    };

    document.addEventListener("astro:page-load", init);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
}

export const initEssayFancybox = () =>
    registerFancybox(() => initDynamicFancybox(".essay-images", { debug: false }));

export const initArticleFancybox = () =>
    registerFancybox(() => initDynamicFancybox(".post-content", { debug: false }));

export const initAlbumFancybox = () => registerFancybox(() => initStaticFancybox({ debug: false }));
