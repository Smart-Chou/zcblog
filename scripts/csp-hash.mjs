/**
 * csp-hash.mjs — 构建后为内联脚本计算 SHA-256 hash 并注入 CSP
 *
 * 读取 dist/ 下的 HTML 文件，提取所有内联 <script> 内容，
 * 计算 SHA-256 hash，追加到 script-src 中（与 'unsafe-inline' 共存）。
 *
 * 策略：纵深防御 —— hash 匹配的脚本享受更严格的校验，
 * 其余脚本回退到 'unsafe-inline'，不阻断任何合法内容。
 *
 * 用法: node scripts/csp-hash.mjs
 * 应在 astro build 之后运行。
 */

import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { glob } from "node:fs/promises";

const DIST_DIR = "dist";

/**
 * 提取 HTML 中所有内联 <script> 标签的内容。
 * 跳过模块脚本（import 开头）和空脚本。
 */
function extractInlineScripts(html) {
    const scripts = [];
    const regex = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
        const content = match[1].trim();
        if (content && !content.startsWith("import ")) {
            scripts.push(content);
        }
    }
    return scripts;
}

function sha256(content) {
    return createHash("sha256").update(content, "utf-8").digest("base64");
}

/**
 * 在 script-src 中追加 hash 列表（保留 'unsafe-inline'）
 */
function updateCSP(html, hashes) {
    const hashList = hashes.map((h) => `'sha256-${h}'`).join(" ");
    // 追加 hash 到 'unsafe-inline' 之前（纵深防御，hash 优先匹配）
    return html.replace(
        /('unsafe-inline')/,
        `${hashList} $1`,
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
