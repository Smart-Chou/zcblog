/**
 * 独立运行 Pagefind 索引生成，不需要完整 astro build。
 *
 * 用法：  pnpm run pagefind
 * 前提：  dist/ 目录中已有构建好的 HTML（至少需要先跑过一次 astro build）
 *
 * 配置来源：src/schemas/pagefind.ts（修改时请同步更新下面的 CONFIG）
 */

import * as pagefind from "pagefind";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ── 配置（与 src/schemas/pagefind.ts 保持同步）──────────────────────────
const CONFIG = {
    forceLanguage: undefined, // ISO 639-1，不设置则自动检测
    excludeSelectors: ["nav", "footer", ".post-copyright", ".donate", ".toc", "script", "style"],
    keepIndexUrl: false,
    writePlayground: false,
    includeCharacters: `，。！？；：""''（）【】[]`,
    verbose: false,
    logfile: undefined,
    glob: "article/**/*.{html}",
    rootSelector: "[data-pagefind-body]",
};

// ── 工具函数 ────────────────────────────────────────────────────────────
function assertResponse(response, label) {
    if (response.errors && response.errors.length > 0) {
        for (const err of response.errors) console.error(`[pagefind] ${label} error:`, err);
        throw new Error(`Pagefind ${label} returned errors.`);
    }
    return response;
}

// ── 主流程 ──────────────────────────────────────────────────────────────
async function main() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const projectRoot = path.resolve(__dirname, "..");
    const distDir = path.join(projectRoot, "dist");
    const publicDir = path.join(projectRoot, "public");

    if (!existsSync(distDir)) {
        console.error("❌ dist/ 目录不存在，请先运行一次 pnpm build");
        process.exit(1);
    }

    const start = performance.now();
    console.log("🔍 Building Pagefind search index...");
    console.log(`   Source: ${distDir}`);
    console.log(`   Glob:   ${CONFIG.glob}`);

    // 1. 创建索引
    const { index } = assertResponse(
        await pagefind.createIndex({
            forceLanguage: CONFIG.forceLanguage,
            excludeSelectors: CONFIG.excludeSelectors,
            keepIndexUrl: CONFIG.keepIndexUrl,
            writePlayground: CONFIG.writePlayground,
            includeCharacters: CONFIG.includeCharacters,
            rootSelector: CONFIG.rootSelector,
            verbose: CONFIG.verbose,
            logfile: CONFIG.logfile,
        }),
        "createIndex",
    );

    // 2. 添加 HTML 文件
    const { page_count } = assertResponse(
        await index.addDirectory({
            path: distDir,
            glob: CONFIG.glob,
        }),
        "addDirectory",
    );
    console.log(`   Indexed ${page_count} pages.`);

    // 3. 写入 dist/pagefind/
    const outputPath = path.join(distDir, "pagefind");
    const writeResult = assertResponse(await index.writeFiles({ outputPath }), "writeFiles");
    console.log(`   Written to ${outputPath}`);

    // 4. 复制到 public/pagefind/（dev server 需要）
    const destPath = path.join(publicDir, "pagefind");
    if (!existsSync(destPath)) {
        mkdirSync(destPath, { recursive: true });
    }
    cpSync(outputPath, destPath, { recursive: true });
    console.log(`   Copied to ${destPath}`);

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);
    console.log(`✅ Done in ${elapsed}s`);

    await pagefind.close();
}

main().catch((err) => {
    console.error("❌", err);
    process.exit(1);
});
