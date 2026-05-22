import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm"; // GitHub Flavored Markdown
import rehypeSlug from "rehype-slug"; // 标题添加ID
import rehypeAutolinkHeadings from "rehype-autolink-headings"; // 标题添加锚点
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import { remarkCodeBlocks } from "./src/remarkPlugin/remark-code-blocks.mjs";
import { remarkInlineSyntax } from "./src/remarkPlugin/remark-inline-syntax.mjs";
import { remarkAsides } from "./src/remarkPlugin/remark-asides.mjs";
import { remarkImageGrid } from "./src/remarkPlugin/remark-image-grid.mjs";
import { remarkGithubCard } from "./src/remarkPlugin/remark-github-card.mjs";
import { GithubCardComponent } from "./src/remarkPlugin/rehype-github-card.mjs";
import { remarkEncrypted } from "./src/remarkPlugin/remark-encrypted.mjs";
import { rehypeEncrypted } from "./src/remarkPlugin/rehype-encrypted.mjs";
import expressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import partytown from "@astrojs/partytown";
import redirectAttributeByLink from "./src/integrations/redirect.ts";
import { starlightPagefind } from "./src/integrations/pagefind.ts";
import { pagefindConfig } from "./src/schemas/pagefind";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeCallouts from "rehype-callouts";
import astroVtBot from "astro-vtbot";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    site: "https://marxchou.com",
    // i18n 配置
    i18n: {
        defaultLocale: "zh",
        locales: ["zh", "en"],
        routing: {
            prefixDefaultLocale: false, // 默认语言(中文)不带前缀
        },
    },
    markdown: {
        remarkPlugins: [
            remarkMath,
            remarkInlineSyntax,
            remarkCodeBlocks,
            remarkDirective,
            remarkAsides({}),
            remarkGfm,
            remarkImageGrid,
            remarkGithubCard,
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
    },
    integrations: [
        redirectAttributeByLink(),
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
            filter: (page) =>
                page !== "https://marxchou.com/redirect/" &&
                page !== "https://marxchou.com/en/redirect/",
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
                    await starlightPagefind({ dir, logger, pagefindConfig });
                },
            },
        },
        astroVtBot({
            viewTransitionsFallback: "none",
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
        concurrency: Number(process.env.BUILD_CONCURRENCY) || 2,
    },
    vite: {
        plugins: [tailwindcss()],
        define: {},
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
