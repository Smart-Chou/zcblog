/**
 * indexnow-submit.mjs
 * 将「新/更新文章」的 URL 主动推送给搜索引擎（IndexNow 协议，经 api.indexnow.org
 * 扇出 Bing / Yandex / Seznam / Naver / Yep）；可选同步推送百度「普通收录」。
 *
 * 用法：
 *   node scripts/indexnow-submit.mjs              # 窗口模式：pubDate/upDate 在近 N 小时内的文章
 *   node scripts/indexnow-submit.mjs --all        # 全量引导：提交 dist sitemap 内全部 URL
 *   node scripts/indexnow-submit.mjs --dry-run    # 只打印计划，不发送
 *
 * 环境变量：
 *   INDEXNOW_KEY          IndexNow key（缺失时静默跳过；验证文件 public/<key>.txt 需已部署）
 *   INDEXNOW_SINCE_HOURS  窗口模式的时间窗（默认 26 小时）
 *   BAIDU_TOKEN           百度普通收录 token（可选；缺失时跳过百度）
 *
 * 设计：作为部署后置步骤运行（GitHub Pages 部署完成后再提交，避免引擎抓到旧站）；
 * 任何网络失败只告警不影响部署。文章 URL 规则见 src/utils/article-url.ts
 * （zh: /article/<slug>/，en: /en/article/<slug>/）。
 */

import { readdir, readFile, access } from "node:fs/promises";
import { loadEnvFile } from "./lib/env.mjs";

const SITE_CONFIG = "src/config/site.ts";
const ARTICLE_DIR = "src/content/article";
const DIST_ARTICLE_DIR = "dist/article";
const DIST_EN_ARTICLE_DIR = "dist/en/article";
const SINCE_HOURS_DEFAULT = 26;
const REQUEST_TIMEOUT = 15000;

/** 从站点配置读取站点 URL（与 friend-link.mjs 同一策略，保证主题快照通用） */
async function readSiteUrl() {
    try {
        const text = await readFile(SITE_CONFIG, "utf8");
        const m = text.match(/url:\s*"([^"]+)"/);
        if (m) return m[1].replace(/\/+$/, "");
    } catch {
        /* fallthrough */
    }
    return "";
}

function parseDate(value) {
    if (!value) return null;
    const cleaned = value.replace(/["']/g, "").trim().replace(/\//g, "-");
    const d = new Date(cleaned);
    return isNaN(d.getTime()) ? null : d;
}

/** 解析 frontmatter 需要的最小字段：lang/draft/pubDate/upDate */
function parseFrontmatter(text) {
    const fm = text.split(/^---\s*$/m)[1] || "";
    const pick = (key) => {
        const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
        return m ? m[1].trim() : "";
    };
    return {
        lang: pick("lang").replace(/["']/g, ""),
        draft: pick("draft").toLowerCase() === "true",
        pubDate: parseDate(pick("pubDate")),
        upDate: parseDate(pick("upDate")),
    };
}

async function exists(p) {
    try {
        await access(p);
        return true;
    } catch {
        return false;
    }
}

/** 窗口模式：收集新/更新文章的 URL（并确认对应构建产物存在，草稿/未构建自动排除） */
async function collectWindowUrls(sinceHours) {
    const files = await readdir(ARTICLE_DIR);
    const cutoff = Date.now() - sinceHours * 3600 * 1000;
    const urls = [];
    for (const f of files) {
        if (!/\.(md|mdx)$/.test(f)) continue;
        const id = f.replace(/\.(md|mdx)$/, "");
        const text = await readFile(`${ARTICLE_DIR}/${f}`, "utf8");
        const meta = parseFrontmatter(text);
        if (meta.draft) continue;
        const latest = Math.max(meta.pubDate?.getTime() ?? 0, meta.upDate?.getTime() ?? 0);
        if (!latest || latest < cutoff) continue;
        const isEn = meta.lang === "en";
        const base = isEn ? id.replace(/-en$/, "") : id;
        const distPath = isEn
            ? `${DIST_EN_ARTICLE_DIR}/${base}/index.html`
            : `${DIST_ARTICLE_DIR}/${base}/index.html`;
        if (!(await exists(distPath))) continue;
        urls.push(isEn ? `/en/article/${base}/` : `/article/${base}/`);
    }
    return urls;
}

/** --all 模式：从 dist sitemap 提取全部可收录 URL（首次引导用） */
async function collectAllUrls() {
    for (const file of ["dist/sitemap-0.xml", "dist/sitemap.xml"]) {
        if (!(await exists(file))) continue;
        const xml = await readFile(file, "utf8");
        return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    }
    return [];
}

async function main() {
    loadEnvFile();
    const args = new Set(process.argv.slice(2));
    const dryRun = args.has("--dry-run");
    const all = args.has("--all");

    const key = (process.env.INDEXNOW_KEY || process.env.INDEXNOW_API_KEY || "").trim();
    if (!key) {
        console.log("⚠ 未配置 INDEXNOW_KEY，跳过 SEO 主动推送");
        return;
    }

    const siteUrl = await readSiteUrl();
    if (!siteUrl) {
        console.warn("⚠ 无法从 src/config/site.ts 读取站点 URL，跳过推送");
        return;
    }

    const sinceHours = Number(process.env.INDEXNOW_SINCE_HOURS) || SINCE_HOURS_DEFAULT;
    const urls = all
        ? await collectAllUrls()
        : (await collectWindowUrls(sinceHours)).map((p) => siteUrl + p);

    if (urls.length === 0) {
        console.log(`ℹ ${all ? "--all" : `近 ${sinceHours} 小时`} 无待推送 URL，跳过`);
        return;
    }

    console.log(`→ IndexNow 计划提交 ${urls.length} 条 URL${dryRun ? "（dry-run）" : ""}`);
    if (dryRun) {
        for (const u of urls.slice(0, 200)) console.log(`  ${u}`);
        return;
    }

    // IndexNow（api.indexnow.org 扇出到全部参与引擎；200/202 均为已受理）
    try {
        const res = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({
                host: new URL(siteUrl).host,
                key,
                keyLocation: `${siteUrl}/${key}.txt`,
                urlList: urls,
            }),
            signal: AbortSignal.timeout(REQUEST_TIMEOUT),
        });
        console.log(`✓ IndexNow 提交完成：HTTP ${res.status}（${urls.length} 条）`);
    } catch (err) {
        console.warn(`⚠ IndexNow 提交失败：${err.message}`);
    }

    // 百度普通收录（可选）
    const baiduToken = (process.env.BAIDU_TOKEN || "").trim();
    if (baiduToken) {
        try {
            const res = await fetch(
                `http://data.zz.baidu.com/urls?site=${encodeURIComponent(siteUrl)}&token=${baiduToken}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "text/plain" },
                    body: urls.join("\n"),
                    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
                },
            );
            const body = await res.text();
            console.log(`✓ 百度提交完成：HTTP ${res.status} ${body.slice(0, 200)}`);
        } catch (err) {
            console.warn(`⚠ 百度提交失败：${err.message}`);
        }
    }
}

await main();
