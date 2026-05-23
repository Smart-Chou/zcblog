/**
 * Link Checker — 构建后检查所有外部链接的死链
 *
 * 用法: node scripts/link-check.mjs [dist目录] [--verbose]
 */
import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve, join } from "path";

const distDir = process.argv[2] || "./dist";
const verbose = process.argv.includes("--verbose");

const EXTERNAL_URL = /^https?:\/\//;
const HREF_ATTR = /href="(https?:\/\/[^"]+)"/g;
const SRC_ATTR = /src="(https?:\/\/[^"]+)"/g;
const TIMEOUT = 10000;

function collectHtmlFiles(dir) {
    const files = [];
    function walk(d) {
        if (!existsSync(d)) return;
        for (const entry of readdirSync(d, { withFileTypes: true })) {
            const full = join(d, entry.name);
            if (
                entry.isDirectory() &&
                !entry.name.startsWith(".") &&
                entry.name !== "node_modules"
            ) {
                walk(full);
            } else if (entry.name.endsWith(".html")) {
                files.push(full);
            }
        }
    }
    walk(dir);
    return files;
}

function extractUrls(filePath) {
    const content = readFileSync(filePath, "utf-8");
    const urls = new Set();
    for (const m of content.matchAll(HREF_ATTR)) urls.add(m[1]);
    for (const m of content.matchAll(SRC_ATTR)) urls.add(m[1]);
    return [...urls];
}

async function checkUrl(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    try {
        const res = await fetch(url, {
            method: "HEAD",
            signal: controller.signal,
            headers: { "User-Agent": "zcblog-link-checker/1.0" },
            redirect: "follow",
        });
        if (!res.ok && res.status >= 400) {
            return { url, status: res.status };
        }
        return null;
    } catch {
        return { url, status: "error" };
    } finally {
        clearTimeout(timer);
    }
}

async function main() {
    console.log(`\n  Link Checker — scanning ${resolve(distDir)}\n`);

    const files = collectHtmlFiles(distDir);
    console.log(`  Found ${files.length} HTML files\n`);

    const allUrls = new Map();
    for (const f of files) {
        const urls = extractUrls(f);
        for (const url of urls) {
            if (!allUrls.has(url)) allUrls.set(url, new Set());
            allUrls.get(url).add(f.replace(distDir, ""));
        }
    }

    const externalUrls = [...allUrls.keys()].filter((u) => EXTERNAL_URL.test(u));
    console.log(`  Checking ${externalUrls.length} external URLs...\n`);

    const results = [];
    const batchSize = 8;
    for (let i = 0; i < externalUrls.length; i += batchSize) {
        const batch = externalUrls.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(checkUrl));
        for (const r of batchResults) {
            if (r) results.push(r);
        }
        if (verbose) {
            const done = Math.min(i + batchSize, externalUrls.length);
            process.stdout.write(`\r  Progress: ${done}/${externalUrls.length}`);
        }
    }
    if (verbose) process.stdout.write("\n");

    if (results.length === 0) {
        console.log("  All external links are reachable.\n");
    } else {
        console.log(`  Found ${results.length} broken link(s):\n`);
        for (const { url, status } of results) {
            const sources = [...(allUrls.get(url) || [])].slice(0, 3);
            console.log(`  ${status === "error" ? "ERR " : status + " "} ${url}`);
            for (const s of sources) {
                console.log(`       in ${s}`);
            }
            console.log();
        }
    }
}

main().catch((err) => {
    console.error("Link checker failed:", err.message);
    process.exit(1);
});
