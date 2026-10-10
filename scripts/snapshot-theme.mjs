#!/usr/bin/env node
/**
 * snapshot-theme.mjs — 从个人仓生成 dogeared 主题快照
 *
 * 三步：
 *   1) 复制仓库树 → 排除个人资产 / 个人数据 / 本地文件（见 isExcluded）
 *   2) 应用 theme-template/ 覆盖（占位配置、示例数据、演示内容、主题 README、通用工作流）
 *   3) 文本替换（品牌串、i18n 站点文案）→ 去个人化门禁（theme 模式，任一泄漏即失败）
 *
 * 用法:
 *   node scripts/snapshot-theme.mjs --out ../dogeared [--force]
 *   pnpm snapshot:theme -- --out ../dogeared
 */

import { execFileSync } from "node:child_process";
import {
    copyFileSync,
    cpSync,
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    rmSync,
    statSync,
    writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = "theme-template";

// ---------- 参数 ----------
const args = process.argv.slice(2);
const argValue = (name) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : null;
};
const OUT = path.resolve(process.cwd(), argValue("out") ?? path.join(ROOT, "..", "dogeared"));
const FORCE = args.includes("--force");

// ---------- 排除规则（相对仓库根的 posix 路径） ----------
const EXCLUDED_DIR_NAMES = new Set([
    ".git",
    "node_modules",
    "dist",
    ".astro",
    ".vite-cache",
    "test-results",
    "playwright-report",
    "theme-snapshot",
    "_articles",
    "tasks",
    ".claude",
    ".superpowers",
    ".codegraph",
    ".impeccable",
    TEMPLATE_DIR,
]);
const EXCLUDED_PATHS = [
    "README.md", // 由 theme-template 提供
    ".env", // 本地环境变量
    "scripts/check-content-sync.py", // 个人仓专用的内容同步检查
    "scripts/check-personalization.mjs", // 个人仓门禁工具（快照无需携带）
    "scripts/snapshot-theme.mjs", // 本脚本自身
    "public/pagefind", // 构建期生成
    "public/images", // 个人内容图片
    "public/qr", // 个人二维码目录
    "src/assets/coverimage", // 文章封面（个人资产）
    "src/assets/fonts", // 文章字体（个人资产）
];
// 文章目录：仅保留功能演示文章，其余个人文章不入快照
const ARTICLE_KEEP = new Set(["blog-feature-demo.md"]);

const isExcluded = (rel, isDir) => {
    const base = path.posix.basename(rel);
    if (base === ".DS_Store") return true;
    // 站点验证文件（IndexNow key / Bing / Google / Baidu 验证等）：站主专属，主题用户需自建
    if (
        rel.startsWith("public/") &&
        (/\.txt$/i.test(base) ||
            /^(BingSiteAuth\.xml|google[0-9a-z]+\.html|baidu_verify_.+\.html)$/i.test(base))
    )
        return true;
    // public/assets：仅收 rss/（预览样式表，随主题分发）；其余（如 note/ 个人内容图片）排除。
    // 注意：不能把 public/assets 整体放进 EXCLUDED_PATHS —— 父目录被排除后不会下钻，子目录例外无法生效。
    if (rel.startsWith("public/assets/") && !rel.startsWith("public/assets/rss")) return true;
    if (!isDir) {
        if (rel === ".env" || (rel.startsWith(".env.") && rel !== ".env.example")) return true;
        if (rel.startsWith("src/content/article/")) return !ARTICLE_KEEP.has(base);
        if (rel.startsWith("src/content/pages/")) return true; // 由 theme-template 提供通用页
        if (rel.startsWith("src/assets/qr/")) return true; // 由 theme-template 提供占位图
        if (rel.startsWith("src/data/") && !rel.startsWith("src/data/i18n/")) return true; // 示例数据由 theme-template 提供
    }
    for (const e of EXCLUDED_PATHS) {
        if (rel === e || rel.startsWith(e + "/")) return true;
    }
    const segs = rel.split("/");
    if (segs.some((s) => EXCLUDED_DIR_NAMES.has(s))) return true;
    // 文章配图目录（src/assets/<slug>-illustrations/）
    if (
        segs[0] === "src" &&
        segs[1] === "assets" &&
        segs.length >= 3 &&
        segs[2].endsWith("-illustrations")
    )
        return true;
    return false;
};

// ---------- 1) 复制仓库树 ----------
const relPosix = (p) => path.relative(ROOT, p).split(path.sep).join("/");

console.log(`📦 主题快照目标：${OUT}`);
if (existsSync(OUT) && readdirSync(OUT).length > 0) {
    if (!FORCE) {
        console.error("❌ 目标目录已存在且非空。使用 --force 覆盖，或指定其他 --out。");
        process.exit(1);
    }
    rmSync(OUT, { recursive: true, force: true });
    console.log("   （--force：已清空旧目录）");
}

cpSync(ROOT, OUT, {
    recursive: true,
    filter: (src) => {
        if (src === ROOT) return true;
        const rel = relPosix(src);
        return !isExcluded(rel, statSync(src).isDirectory());
    },
});
console.log("✅ 仓库树已复制（已排除个人资产 / 数据 / 本地文件）");

// ---------- 2) 应用 theme-template 覆盖 ----------
function copyTemplate(dir, relBase = "") {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const rel = relBase ? `${relBase}/${e.name}` : e.name;
        const from = path.join(dir, e.name);
        const to = path.join(OUT, rel);
        if (e.isDirectory()) {
            copyTemplate(from, rel);
        } else {
            mkdirSync(path.dirname(to), { recursive: true });
            copyFileSync(from, to);
        }
    }
}
copyTemplate(path.join(ROOT, TEMPLATE_DIR));
console.log(`✅ 已应用模板覆盖（${TEMPLATE_DIR}/ → 快照根）`);

// ---------- 3) 文本替换 ----------
const SUBSTITUTIONS = [
    // 品牌串（仅限已确认只含品牌名的文件）
    { file: "src/content/article/blog-feature-demo.md", from: /zcblog/g, to: "dogeared" },
    { file: "scripts/fetch-douban.mjs", from: /zcblog/g, to: "dogeared" },
    { file: "scripts/fetch-friends.mjs", from: /zcblog/g, to: "dogeared" },
    { file: "scripts/fetch-bangumi.mjs", from: /zcblog/g, to: "dogeared" },
    { file: "scripts/link-check.mjs", from: /zcblog/g, to: "dogeared" },
    { file: "src/styles/markdown-extend.css", from: /zcblog/g, to: "dogeared" },
    { file: "src/utils/git-date.ts", from: /zcblog-articles/g, to: "my-blog-articles" },
    // i18n 站点文案（zh）
    { file: "src/data/i18n/zh.json", from: /"title": "Marx's Blog"/g, to: '"title": "Dogeared"' },
    {
        file: "src/data/i18n/zh.json",
        from: /"subtitle": "这里没有答案，但有同路人。"/g,
        to: '"subtitle": "写下你的想法，折起这一角。"',
    },
    {
        file: "src/data/i18n/zh.json",
        from: /"description": "MarxChou 的个人博客。非科班独立开发者，记录工具调研、踩坑解法、想法验证与收入数据。"/g,
        to: '"description": "Dogeared 主题的演示站点：记录工具、教程与想法。"',
    },
    {
        file: "src/data/i18n/zh.json",
        from: /"coverImageAlt": "Marx's Blog Cover"/g,
        to: '"coverImageAlt": "Dogeared Cover"',
    },
    // i18n 站点文案（en）
    { file: "src/data/i18n/en.json", from: /"title": "Marx's Blog"/g, to: '"title": "Dogeared"' },
    {
        file: "src/data/i18n/en.json",
        from: /"subtitle": "No answers here, just fellow travelers."/g,
        to: '"subtitle": "Write it down, fold the corner."',
    },
    {
        file: "src/data/i18n/en.json",
        from: /"description": "Personal blog of MarxChou — a non-CS indie developer in Shenzhen, building SaaS products from scratch with AI-assisted coding. Documenting tool explorations, pitfalls, idea validation, and revenue data."/g,
        to: '"description": "Demo site for Dogeared — notes on tools, tutorials, and ideas."',
    },
    {
        file: "src/data/i18n/en.json",
        from: /"coverImageAlt": "Marx's Blog Cover"/g,
        to: '"coverImageAlt": "Dogeared Cover"',
    },
];

let totalSubs = 0;
for (const { file, from, to } of SUBSTITUTIONS) {
    const target = path.join(OUT, file);
    if (!existsSync(target)) {
        console.warn(`⚠️  替换跳过（文件不存在）：${file}`);
        continue;
    }
    const before = readFileSync(target, "utf8");
    const matches = before.match(from)?.length ?? 0;
    if (matches === 0) {
        console.warn(`⚠️  替换未命中（可能已漂移，请检查）：${file}`);
        continue;
    }
    writeFileSync(target, before.replace(from, to));
    totalSubs += matches;
}
console.log(`✅ 文本替换完成（${totalSubs} 处）`);

// ---------- 4) 去个人化门禁 ----------
console.log("\n🔎 运行去个人化门禁（theme 模式）...");
try {
    execFileSync(
        process.execPath,
        [path.join(ROOT, "scripts/check-personalization.mjs"), "--mode=theme", `--dir=${OUT}`],
        { stdio: "inherit" },
    );
} catch {
    console.error("\n❌ 门禁未通过：快照中存在个人标识（见上方输出）。快照已保留供排查。");
    process.exit(1);
}

// ---------- 汇总 ----------
function countFiles(dir, out = []) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (e.name === "node_modules" || e.name === ".git") continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) countFiles(p, out);
        else out.push(p);
    }
    return out;
}
const fileCount = countFiles(OUT).length;
console.log(`\n🎉 主题快照生成完成`);
console.log(`   目录：${OUT}`);
console.log(`   文件数：${fileCount}`);
console.log("\n下一步（阶段 5 建仓时）：");
console.log(`   cd ${OUT}`);
console.log("   pnpm install && pnpm build    # 独立构建验证");
console.log("   git init && git add -A && git commit -m 'chore: init dogeared'");
