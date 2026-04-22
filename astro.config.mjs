import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm"; // GitHub Flavored Markdown
import rehypeSlug from "rehype-slug"; // 标题添加ID
import rehypeAutolinkHeadings from "rehype-autolink-headings"; // 标题添加锚点
import { resetRemark } from "./src/remarkPlugin/reset-remark.js";
import { remarkAsides } from "./src/remarkPlugin/remark-asides.js";
import { remarkDeruntify } from "./src/remarkPlugin/remark-deruntify.js";
import astroExpressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import partytown from "@astrojs/partytown";
import redirectAttributeByLink from "./src/integrations/redirect.ts";
import playformInline from "@playform/inline";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import astroVtBot from "astro-vtbot";
import katex from "katex";

// 加载环境变量
const env = loadEnv("", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
    site: env.PUBLIC_SITE_URL || "https://marxchou.com",
    // experimental: {
    //     preserveScriptOrder: true,
    //     svgo: true,
    // },
    markdown: {
        remarkPlugins: [
            remarkMath,
            remarkDeruntify,
            resetRemark,
            remarkDirective,
            remarkAsides({}),
            remarkGfm, // 扩展MDX语法支持GitHub Flavored Markdown
        ],
        rehypePlugins: [
            [rehypeKatex, { katex }],
            rehypeSlug, // 标题添加ID
            [rehypeAutolinkHeadings, { behavior: "append" }], // 标题添加锚点
        ],
    },
    integrations: [
        redirectAttributeByLink(),
        sitemap(),
        icon(),
        astroExpressiveCode({
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
        mdx({
            remarkPlugins: [remarkGfm], // 扩展MDX语法
            rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "append" }], // 标题锚点
            ],
        }),
        partytown(),
        playformInline(),
        astroVtBot({
            viewTransitionsFallback: "animate",
        }),
    ],
    image: {
        service: {
            entrypoint: "astro/assets/services/sharp",
            config: {
                limitInputPixels: false,
            },
        },
    },
    domains: ["avatars.githubusercontent.com", "pic-api.marxchou.com"],
    remotePatterns: [
        {
            protocol: "https",
            hostname: "avatars.githubusercontent.com",
        },
        {
            protocol: "https",
            hostname: "pic-api.marxchou.com",
        },
    ],
    trailingSlash: "always",
    output: "static",
    // 构建输出配置
    build: {
        concurrency: 4, // 并行构建提升速度
    },
    vite: {
        define: {
            // 暴露环境变量到客户端
            "process.env.PUBLIC_SITE_URL": JSON.stringify(
                env.PUBLIC_SITE_URL || "https://marxchou.com",
            ),
        },
        build: {
            // 开启构建压缩
            minify: "terser",
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ["console.log", "console.info"],
                },
                mangle: {
                    safari10: true,
                },
            },
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
                            if (id.includes("lenis")) return "lenis";
                            return "vendor";
                        }
                    },
                },
            },
        },
        // 构建性能优化
        cacheDir: ".vite-cache",
        optimizeDeps: {
            include: ["dayjs", "astro-icon", "@waline/client"],
            exclude: [],
        },
    },
});
