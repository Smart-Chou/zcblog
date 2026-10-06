#!/usr/bin/env node
/**
 * check-personalization.mjs — 去个人化门禁
 *
 * 扫描仓库中的个人标识（域名 / 昵称 / 邮箱 / 用户 ID 等）：
 *   --mode=personal（默认）：命中仅允许出现在白名单文件中，出现新泄漏点即失败
 *   --mode=theme            ：任何命中都失败（用于主题快照生成时的最终门禁）
 *
 * 用法:
 *   node scripts/check-personalization.mjs            # 个人仓自检
 *   node scripts/check-personalization.mjs --mode=theme
 */

import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";

const SELF = "scripts/check-personalization.mjs";
const MODE = process.argv.find((a) => a.startsWith("--mode="))?.split("=")[1] ?? "personal";

// 个人标识模式：拆段拼接，避免脚本自身被扫中
const P = (...parts) => new RegExp(parts.join(""), "i");
const PATTERNS = [
    P("marx", "chou"),
    P("mif", "sh"),
    P("z1853838", "3923"),
    P("zc", "ily"),
    P("1246", "668"),
];

// personal 模式白名单（这些文件出现个人值为预期）
const ALLOWLIST = [
    "src/config/",
    "src/content/pages/",
    "src/data/",
    ".claude/DESIGN.md",
    ".claude/PRODUCT.md",
    "README.md",
    "LICENSE",
    "package.json",
    ".github/workflows/deploy.yml",
];

const isAllowed = (file) =>
    ALLOWLIST.some((p) => (p.endsWith("/") ? file.startsWith(p) : file === p));

function fromGit() {
    return execSync("git ls-files", { encoding: "utf8" }).split("\n").filter(Boolean);
}

function fromWalk(dir = ".", out = []) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (["node_modules", ".git", "dist", ".astro"].includes(e.name)) continue;
        if (e.name === ".env" || e.name.startsWith(".env.")) continue;
        const p = dir === "." ? e.name : `${dir}/${e.name}`;
        if (e.isDirectory()) fromWalk(p, out);
        else out.push(p);
    }
    return out;
}

let files;
try {
    files = fromGit();
} catch {
    files = fromWalk();
}

const hits = [];
for (const file of files) {
    if (file === SELF) continue;
    let text;
    try {
        if (!statSync(file).isFile()) continue;
        text = readFileSync(file, "utf8");
    } catch {
        continue;
    }
    if (text.includes("\u0000")) continue; // 跳过二进制
    text.split("\n").forEach((line, i) => {
        if (PATTERNS.some((re) => re.test(line))) {
            hits.push({ file, line: i + 1, text: line.trim().slice(0, 160) });
        }
    });
}

const leaked = MODE === "theme" ? hits : hits.filter((h) => !isAllowed(h.file));

console.log(`[check-personalization:${MODE}] 命中 ${hits.length} 处，白名单外 ${leaked.length} 处`);
for (const h of leaked) console.log(`  ${h.file}:${h.line}  ${h.text}`);

if (leaked.length > 0) {
    console.error(`\n❌ 发现 ${leaked.length} 处白名单外的个人标识`);
    process.exit(1);
}
console.log("✅ 门禁通过：白名单外零个人标识");
