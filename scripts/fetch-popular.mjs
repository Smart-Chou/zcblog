/**
 * fetch-popular.mjs
 * 从 Umami 统计 API 抓取「近 30 个完整自然日、按路径聚合」的访问量，
 * 映射到当前已发布文章，生成首页「近期热门」榜单数据 src/data/popular.json。
 *
 * 环境变量（未配置时静默跳过并保留旧数据；建议使用 Umami 只读/view-only 账号）:
 *   UMAMI_API_URL      Umami 服务地址（如 https://umami.example.com）
 *   UMAMI_WEBSITE_ID   Umami 站点 ID
 *   UMAMI_USERNAME     只读账号用户名
 *   UMAMI_PASSWORD     只读账号密码
 *
 * 用法: node scripts/fetch-popular.mjs
 */

import { readdir, writeFile } from "node:fs/promises";
import { loadEnvFile } from "./lib/env.mjs";

const OUTPUT = "src/data/popular.json";
const ARTICLE_DIR = "src/content/article";
const WINDOW_DAYS = 30; // 完整自然日窗口（不含今天）
const TOP_N = 8; // 写入条数；页面展示数量由 src/config/feature.ts 的 popular.limit 决定
const PAGE_LIMIT = 500;
const REQUEST_TIMEOUT = 15000;
const CN_OFFSET_MS = 8 * 3600 * 1000;

/** 今天 00:00（Asia/Shanghai）对应的时刻 */
function startOfTodayCN() {
    const now = new Date();
    const cn = new Date(now.getTime() + CN_OFFSET_MS);
    const utcMidnight = Date.UTC(cn.getUTCFullYear(), cn.getUTCMonth(), cn.getUTCDate());
    return new Date(utcMidnight - CN_OFFSET_MS);
}

async function main() {
    loadEnvFile();

    const base = (process.env.UMAMI_API_URL ?? "").replace(/\/+$/, "");
    const websiteId = process.env.UMAMI_WEBSITE_ID ?? "";
    const username = process.env.UMAMI_USERNAME ?? "";
    const password = process.env.UMAMI_PASSWORD ?? "";

    if (!base || !websiteId || !username || !password) {
        console.warn("⚠ 未配置 UMAMI_* 环境变量，跳过获取热门文章数据（保留旧数据）");
        process.exit(0);
    }

    try {
        // 1) 登录（只读账号；token 会过期，每次运行重新登录）
        const loginRes = await fetch(`${base}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            signal: AbortSignal.timeout(REQUEST_TIMEOUT),
        });
        if (!loginRes.ok) throw new Error(`登录失败 HTTP ${loginRes.status}`);
        const { token } = await loginRes.json();
        if (!token) throw new Error("登录响应缺少 token");

        // 2) 固定窗口：近 WINDOW_DAYS 个完整自然日（已结束窗口，避免分页期间数据漂移）
        const endAt = startOfTodayCN();
        const startAt = new Date(endAt.getTime() - WINDOW_DAYS * 86400000);

        // 3) 分页拉取按 path 聚合的访问量
        //    注意：expanded 接口的 pageviews 才是浏览数（普通 /metrics 的 y 是访客数）
        const rows = [];
        for (let offset = 0; ; offset += PAGE_LIMIT) {
            const url = new URL(`${base}/api/websites/${websiteId}/metrics/expanded`);
            url.searchParams.set("startAt", String(startAt.getTime()));
            url.searchParams.set("endAt", String(endAt.getTime()));
            url.searchParams.set("type", "path");
            url.searchParams.set("limit", String(PAGE_LIMIT));
            url.searchParams.set("offset", String(offset));

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
                signal: AbortSignal.timeout(REQUEST_TIMEOUT),
            });
            if (!res.ok) throw new Error(`metrics 请求失败 HTTP ${res.status}`);

            const data = await res.json();
            const batch = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
            rows.push(...batch);
            if (batch.length < PAGE_LIMIT) break;
        }

        // 4) 映射到当前已发布文章（以内容目录中的文件名为准）
        const files = await readdir(ARTICLE_DIR);
        const slugs = new Set(
            files.filter((f) => /\.(md|mdx)$/.test(f)).map((f) => f.replace(/\.(md|mdx)$/, "")),
        );

        const bySlug = new Map();
        for (const row of rows) {
            const name = typeof row?.name === "string" ? row.name : "";
            const match = name.match(/^\/article\/([^/]+)\/?$/);
            if (!match) continue;
            let slug = match[1];
            try {
                slug = decodeURIComponent(slug);
            } catch {
                /* 解码失败时保留原始值 */
            }
            if (!slugs.has(slug)) continue;
            const pv = Number(row.pageviews) || 0;
            bySlug.set(slug, (bySlug.get(slug) ?? 0) + pv);
        }

        if (bySlug.size === 0) {
            // 一条都没匹配到：多半是配置或接口变化（而非真的无流量），保留旧数据
            throw new Error("窗口内没有匹配到任何已发布文章路径");
        }

        const items = [...bySlug.entries()]
            .map(([slug, pv]) => ({ slug, pv }))
            .sort((a, b) => b.pv - a.pv)
            .slice(0, TOP_N);

        const payload = {
            syncedAt: new Date().toISOString(),
            windowStart: startAt.toISOString(),
            windowEnd: endAt.toISOString(),
            items,
        };

        await writeFile(OUTPUT, JSON.stringify(payload, null, 4) + "\n");
        console.log(
            `✅ 热门文章数据已更新：${items.length} 条（窗口 ${payload.windowStart.slice(0, 10)} ~ ${payload.windowEnd.slice(0, 10)}）`,
        );
    } catch (err) {
        console.warn(`⚠ 获取热门文章数据失败：${err.message}（保留旧数据）`);
    }
}

await main();
