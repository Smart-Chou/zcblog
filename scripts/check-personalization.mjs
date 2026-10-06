#!/usr/bin/env node
/**
 * check-personalization.mjs — 去个人化门禁
 *
 * 扫描仓库中的个人标识（域名 / 昵称 / 邮箱 / 用户 ID 等）：
 *   --mode=personal（默认）：命中仅允许出现在白名单文件中，出现新泄漏点即失败
 *   --mode=theme            ：任何命中都失败（LICENSE/README/package.json 的作者署名除外；用于主题快照生成时的门禁）
 *   --dir=<path>            ：扫描指定目录而非当前仓库（用于对生成的快照做门禁）
 *
 * 用法:
 *   node scripts/check-personalization.mjs                          # 个人仓自检
 *   node scripts/check-personalization.mjs --mode=theme --dir=/tmp/dogeared
 */

import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const SELF = "scripts/check-personalization.mjs";
const MODE = process.argv.find((a) => a.startsWith("--mode="))?.split("=")[1] ?? "personal";
const DIR = process.argv.find((a) => a.startsWith("--dir="))?.split("=")[1] ?? null;
const ROOT = DIR ? path.resolve(DIR) : process.cwd();

// 个人标识模式：拆段拼接，避免脚本自身被扫中
const P = (...parts) => new RegExp(parts.join(""), "i");
const PATTERNS = [
    P("marx", "chou"),
    P("mif", "sh"),
    P("z1853838", "3923"),
    P("zc", "ily"),
    P("1246", "668"),
    P("chow", "cong"),
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
    "theme-template/",
    "scripts/snapshot-theme.mjs",
];

const isAllowed = (file) =>
    ALLOWLIST.some((p) => (p.endsWith("/") ? file.startsWith(p) : file === p));

const SKIP_DIR_NAMES = [
    "node_modules",
    ".git",
    "dist",
    ".astro",
    ".vite-cache",
    "test-results",
    "playwright-report",
    "_articles",
    "theme-snapshot",
];

function fromGit() {
    return execSync("git ls-files", { encoding: "utf8" }).split("\n").filter(Boolean);
}

function fromWalk(dir, out = []) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (SKIP_DIR_NAMES.includes(e.name)) continue;
        if (e.name === ".env" || (e.name.startsWith(".env.") && e.name !== ".env.example"))
            continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) fromWalk(p, out);
        else out.push(p);
    }
    return out;
}

// files：相对 ROOT 的 posix 路径
let files;
if (DIR) {
    files = fromWalk(ROOT).map((p) => path.relative(ROOT, p).split(path.sep).join("/"));
} else {
    try {
        files = fromGit();
    } catch {
        files = fromWalk(process.cwd()).map((p) =>
            path.relative(process.cwd(), p).split(path.sep).join("/"),
        );
    }
}

const hits = [];
for (const file of files) {
    if (file === SELF) continue;
    let text;
    try {
        const abs = path.join(ROOT, file);
        if (!statSync(abs).isFile()) continue;
        text = readFileSync(abs, "utf8");
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

// 主题模式允许保留的署名类文件（作者致谢 / License / 包元数据）
const THEME_ATTRIBUTION = ["LICENSE", "README.md", "package.json"];

const leaked =
    MODE === "theme"
        ? hits.filter((h) => !THEME_ATTRIBUTION.includes(h.file))
        : hits.filter((h) => !isAllowed(h.file));

console.log(
    `[check-personalization:${MODE}] 扫描 ${files.length} 个文件｜命中 ${hits.length} 处，白名单外 ${leaked.length} 处`,
);
for (const h of leaked) console.log(`  ${h.file}:${h.line}  ${h.text}`);

if (leaked.length > 0) {
    console.error(`\n❌ 发现 ${leaked.length} 处白名单外的个人标识`);
    process.exit(1);
}
console.log("✅ 门禁通过：白名单外零个人标识");
