/**
 * csp-hash.mjs — 构建后为内联脚本计算 SHA-256 hash 并注入 CSP
 *
 * 读取 dist/ 下的 HTML 文件，提取所有内联 <script> 内容，
 * 计算 SHA-256 hash，将 'unsafe-inline' 替换为 hash 列表。
 *
 * 用法: node scripts/csp-hash.mjs
 * 应在 astro build 之后运行。
 */

import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { glob } from "node:fs/promises";

const DIST_DIR = "dist";

/**
 * 提取 HTML 中所有内联 <script> 标签的内容
 */
function extractInlineScripts(html) {
    const scripts = [];
    const regex = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
        const content = match[1].trim();
        if (content && !content.startsWith("import ")) {
            // 排除 Vite 的 import 语句（这些是模块脚本，不是内联脚本）
            scripts.push(content);
        }
    }
    return scripts;
}

/**
 * 计算内容的 SHA-256 hash (base64)
 */
function sha256(content) {
    return createHash("sha256").update(content, "utf-8").digest("base64");
}

/**
 * 更新 HTML 中的 CSP meta 标签，用 hash 替代 'unsafe-inline'
 */
function updateCSP(html, hashes) {
    const hashList = hashes.map((h) => `'sha256-${h}'`).join(" ");
    // 将 script-src 中的 'unsafe-inline' 替换为具体的 hash 列表
    // 保留 data: 和 CDN 域名白名单
    // 注意：style-src 中保留 'unsafe-inline'（style 标签/属性的 hash 方案不实用）
    return html.replace(
        /('unsafe-inline')\s+/,
        `${hashList} `,
    );
}

async function main() {
    const files = [];
    for await (const f of glob(`${DIST_DIR}/**/*.html`)) {
        files.push(f);
    }

    if (files.length === 0) {
        console.log("No HTML files found in dist/. Run `astro build` first.");
        return;
    }

    let totalScripts = 0;
    let totalHashes = new Set();

    for (const file of files) {
        const html = await readFile(file, "utf-8");
        const scripts = extractInlineScripts(html);
        if (scripts.length === 0) continue;

        const hashes = scripts.map(sha256);
        hashes.forEach((h) => totalHashes.add(h));
        totalScripts += scripts.length;

        const updated = updateCSP(html, hashes);
        await writeFile(file, updated, "utf-8");
    }

    console.log(
        `CSP hashes injected: ${totalScripts} inline scripts → ${totalHashes.size} unique hashes across ${files.length} HTML files.`,
    );
}

main().catch((err) => {
    console.error("CSP hash injection failed:", err);
    process.exit(1);
});
