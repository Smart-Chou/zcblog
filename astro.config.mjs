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

// https://astro.build/config
export default defineConfig({
    site: "https://marxchou.com",
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
                // 排除英文文章页：当前没有任何文章有 lang: en，所有 /en/article/ 页面
                // 渲染的是中文内容，不应被索引。等有英文翻译后移除此规则
                if (page.includes("/en/article/")) {
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
        plugins: [
            tailwindcss(),
            VitePWA({
                registerType: "autoUpdate",
                workbox: {
                    globPatterns: ["**/*.{html,js,css,svg,png,jpg,webp,woff2}"],
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
            }),
        ],
        build: {
            // esbuild 比 terser 内存占用更低，避免 Vercel OOM
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
                            if (id.includes("@waline")) return "waline";
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
