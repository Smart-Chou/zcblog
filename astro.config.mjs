import { defineConfig } from "astro/config";
import os from "node:os";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm"; // GitHub Flavored Markdown
import rehypeSlug from "rehype-slug"; // 标题添加ID
import rehypeAutolinkHeadings from "rehype-autolink-headings"; // 标题添加锚点
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import { remarkCodeBlocks } from "./src/remark-plugin/remark-code-blocks.ts";
import { remarkInlineSyntax } from "./src/remark-plugin/remark-inline-syntax.ts";
import { remarkAsides } from "./src/remark-plugin/remark-asides.ts";
import { remarkImageGrid } from "./src/remark-plugin/remark-image-grid.ts";
import { remarkGithubCard } from "./src/remark-plugin/remark-github-card.ts";
import { GithubCardComponent } from "./src/rehype-plugin/rehype-github-card.ts";
import { remarkTabs } from "./src/remark-plugin/remark-tabs.ts";
import { remarkAlign } from "./src/remark-plugin/remark-align.ts";
import { remarkInclude } from "./src/remark-plugin/remark-include.ts";
import { remarkEncrypted } from "./src/remark-plugin/remark-encrypted.ts";
import { rehypeEncrypted } from "./src/remark-plugin/rehype-encrypted.ts";
import expressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import partytown from "@astrojs/partytown";
import redirectAttributeByLink from "./src/integrations/redirect.ts";
import { searchPagefind } from "./src/integrations/pagefind.ts";
import ogImage from "./src/integrations/og-image.ts";
import { pagefindConfig } from "./src/schemas/pagefind";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeCallouts from "rehype-callouts";
import astroVtBot from "astro-vtbot";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// ── PWA ──────────────────────────────────────────────────────────────────────
// Astro 7（Vite 7 环境模型）下，vite-plugin-pwa 自身的 closeBundle 不会在 client
// 构建中执行，导致 sw.js 从不生成（而 registerSW.js 仍被注入注册 → 线上 404）。
// 这里在 astro:build:done 阶段显式调用插件的 api.generateSW() 补上生成步骤；
// 该 integration 放在 integrations 末尾，确保 precache 清单收录 pagefind/og 等
// 构建收尾产物。2026-10-03 修复。
const pwaPlugins = VitePWA({
    registerType: "autoUpdate",
    workbox: {
        // 预缓存收敛为核心资源（HTML/JS/CSS/字体/图标）：约 31MB。
        // 图片不再预缓存（原 globPatterns 会让 SW 安装时拉 70MB+），
        // 改由下方 runtimeCaching 的 images-cache 在浏览时按需缓存。
        globPatterns: ["**/*.{html,js,css,woff2,woff,svg,ico}"],
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/marxchou\.com\/.*/,
                handler: "StaleWhileRevalidate",
                options: {
                    cacheName: "pages-cache",
                    expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
                },
            },
            {
                urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
                handler: "CacheFirst",
                options: {
                    cacheName: "images-cache",
                    expiration: { maxEntries: 200, maxAgeSeconds: 2592000 },
                },
            },
            {
                urlPattern: /\.(?:woff2?|ttf|otf|eot)$/,
                handler: "CacheFirst",
                options: {
                    cacheName: "fonts-cache",
                    expiration: { maxEntries: 50, maxAgeSeconds: 2592000 },
                },
            },
        ],
    },
    manifest: {
        name: "Marx's Blog",
        short_name: "MarxBlog",
        description: "Marx Chou's personal blog",
        theme_color: "#c2413b",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
            {
                src: "/favicon.svg",
                sizes: "any",
                type: "image/svg+xml",
            },
        ],
    },
});

const pwaServiceWorker = {
    name: "pwa-service-worker",
    hooks: {
        "astro:build:done": async ({ logger }) => {
            const main = pwaPlugins.find((p) => p && p.name === "vite-plugin-pwa");
            const api = main?.api;
            if (!api) {
                logger.warn("PWA: vite-plugin-pwa api 未找到，sw.js 未生成");
                return;
            }
            await api.generateSW();
            logger.info("PWA: service worker (sw.js) generated");
        },
    },
};

// https://astro.build/config
export default defineConfig({
    site: "https://marxchou.com",
    // /blog 与 /en/blog 本身无页面（规范入口为 /blog/1/）：加跳转兜底，避免历史外链 404（2026-10 审计）
    redirects: {
        "/blog": "/blog/1/",
        "/en/blog": "/en/blog/1/",
    },
    prefetch: {
        defaultStrategy: "hover",
    },
    // i18n 配置
    i18n: {
        defaultLocale: "zh",
        locales: ["zh", "en"],
        routing: {
            prefixDefaultLocale: false, // 默认语言(中文)不带前缀
        },
    },
    markdown: {
        processor: unified({
            remarkPlugins: [
                [remarkMath, { singleDollarTextMath: false }],
                remarkInlineSyntax,
                remarkCodeBlocks,
                remarkDirective,
                remarkInclude,
                remarkAlign,
                remarkAsides({}),
                remarkGfm,
                remarkImageGrid,
                remarkGithubCard,
                remarkTabs,
                remarkEncrypted,
            ],
            rehypePlugins: [
                rehypeKatex,
                rehypeCallouts,
                rehypeSlug, // 标题添加ID
                [rehypeAutolinkHeadings, { behavior: "append" }], // 标题添加锚点
                [rehypeComponents, { components: { github: GithubCardComponent } }],
                rehypeEncrypted,
            ],
        }),
    },
    integrations: [
        redirectAttributeByLink(),
        ogImage(),
        sitemap({
            // 多语言站点地图配置
            i18n: {
                defaultLocale: "zh",
                locales: {
                    zh: "zh-CN",
                    en: "en-US",
                },
            },
            // 过滤不需要收录的页面
            filter: (page) => {
                // 排除跳转中转页
                if (
                    page === "https://marxchou.com/redirect/" ||
                    page === "https://marxchou.com/en/redirect/"
                ) {
                    return false;
                }
                // 排除英文文章页（防御性）：当前不生成 /en/article/ 路由（仓库无 lang: en 文章）；
                // 若未来启用英文文章路由，重新评估此规则
                if (page.includes("/en/article/")) {
                    return false;
                }
                // 排除标签页（已设置 noindex）
                if (page.includes("/tags/")) {
                    return false;
                }
                // 排除博客分页
                if (/\/blog\/\d+\/$/.test(page)) {
                    return false;
                }
                // 排除薄内容页
                const thinPages = [
                    "/albums/",
                    "/en/albums/",
                    "/bangumi/",
                    "/en/bangumi/",
                    "/talks/",
                    "/en/talks/",
                    "/donate/",
                    "/en/donate/",
                    "/cookies/",
                    "/en/cookies/",
                    "/copyright/",
                    "/en/copyright/",
                    "/friends/",
                    "/en/friends/",
                ];
                if (thinPages.some((p) => page.includes(p))) {
                    return false;
                }
                return true;
            },
        }),
        icon(),
        expressiveCode({
            plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
            themes: ["github-dark"],
            useDarkModeMediaQuery: false,
            // 启用复制按钮
            enableCopyButton: true,
            // 显示语言标识
            showLanguage: true,
            // 优化渲染性能
            renderInPlace: true,
        }),
        mdx(),
        partytown(),
        {
            name: "pagefind-integration",
            hooks: {
                "astro:build:done": async ({ dir, logger }) => {
                    await searchPagefind({ dir, logger, pagefindConfig });
                },
            },
        },
        astroVtBot({
            viewTransitionsFallback: "animate",
        }),
        pwaServiceWorker,
    ],
    image: {
        layout: "constrained",
        responsiveStyles: true,
        domains: ["avatars.githubusercontent.com"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
        service: {
            entrypoint: "astro/assets/services/sharp",
            config: {
                limitInputPixels: false,
            },
        },
    },
    trailingSlash: "always",
    output: "static",
    // 构建输出配置
    build: {
        concurrency: Number(process.env.BUILD_CONCURRENCY) || os.cpus().length,
    },
    vite: {
        plugins: [tailwindcss(), ...pwaPlugins],
        build: {
            // esbuild 比 terser 内存占用更低，适合内存受限的 CI 构建环境
            minify: "esbuild",
            // 静态资源哈希，用于缓存失效
            assetsDir: "assets",
            rollupOptions: {
                output: {
                    entryFileNames: "assets/[name].[hash].js",
                    chunkFileNames: "assets/[name].[hash].js",
                    assetFileNames: "assets/[name].[hash].[ext]",
                    // 代码分割：按模块拆分JS
                    manualChunks(id) {
                        if (id.includes("node_modules")) {
                            // pageview 单独成 chunk（文章/列表页浏览计数会静态引入，
                            // 避免把整个 @waline/client 主包连带提前加载；主包仅在
                            // 用户首次展开评论时按需加载）2026-10-03
                            if (id.includes("@waline")) {
                                // ?url 资源模块（waline.css?url）不能并入懒加载主包，
                                // 否则按需 import 的 URL 字符串会把整个主包拖成同步依赖
                                if (id.includes("?") || id.endsWith(".css")) return undefined;
                                if (id.includes("pageview")) return "waline-pv";
                                return "waline";
                            }
                            if (id.includes("astro-icon")) return "icons";
                            return "vendor";
                        }
                    },
                },
            },
        },
        // CSS 优化
        cssCodeSplit: true,
        cssMinify: "esbuild",
        assetsInlineLimit: 4096,
        // 构建性能优化
        cacheDir: ".vite-cache",
        optimizeDeps: {
            include: ["astro-icon", "@waline/client"],
            exclude: [],
        },
    },
});
