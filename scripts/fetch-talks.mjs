/**
 * fetch-talks.mjs
 * 从 Blinko REST API 抓取公开笔记，生成 talks.json
 *
 * 环境变量: BLINKO_API_TOKEN  (Blinko 设置 → API Token)
 * 用法:      node scripts/fetch-talks.mjs
 */

import { writeFile } from "node:fs/promises";

const BLINKO_API = "https://memos.marxchou.com/api/v1/note/list";
const BLINKO_BASE = "https://memos.marxchou.com";
const OUTPUT = "src/data/talks.json";

// ── 工具函数 ──

function relativeTime(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return "刚刚";
    const units = [
        [3600, 60, "分钟"],
        [86400, 3600, "小时"],
        [2592000, 86400, "天"],
        [31104000, 2592000, "个月"],
        [Infinity, 31104000, "年"],
    ];
    for (const [max, div, unit] of units) {
        if (diff < max) return `${Math.floor(diff / div)}${unit}前`;
    }
}

function formatDate(iso) {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** 补全协议 + 补全域名 */
const fullUrl = (raw) => {
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
        return raw.replace(/^http:/, "https:");
    }
    return BLINKO_BASE + (raw.startsWith("/") ? "" : "/") + raw;
};

/** 从笔记中提取所有图片 URL */
function extractImages(note) {
    const urls = [];

    // 结构化附件
    for (const a of note.attachments || []) {
        if (
            a.mimeType?.startsWith("image/") ||
            /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(a.fileName || a.path || "")
        ) {
            urls.push(fullUrl(a.url || a.path));
        }
    }

    // Markdown 兜底
    for (const [, url] of (note.content || "").matchAll(
        /!\[.*?\]\(([^)\s]+)\)/g,
    )) {
        urls.push(fullUrl(url));
    }

    return [...new Set(urls)];
}

// ── 主逻辑 ──

async function main() {
    try {
        process.loadEnvFile();
    } catch {
        /* .env 不存在时忽略（如 CI 环境） */
    }

    const TOKEN = process.env.BLINKO_API_TOKEN;
    if (!TOKEN) {
        console.error("❌ 未设置 BLINKO_API_TOKEN 环境变量");
        process.exit(1);
    }

    let notes;
    try {
        const res = await fetch(BLINKO_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify({
                isShare: true,
                isRecycle: false,
                isArchived: false,
                orderBy: "desc",
                size: 50,
                page: 1,
            }),
            signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        notes = await res.json();
    } catch (err) {
        console.warn(`⚠ 无法获取 Blinko API: ${err.message}，保留旧数据`);
        process.exit(0);
    }

    if (!Array.isArray(notes)) {
        console.warn("⚠ API 返回格式异常，保留旧数据");
        process.exit(0);
    }

    // 只保留真正公开的笔记（无密码、未过期）
    const publicNotes = notes.filter(
        (n) =>
            n.isShare &&
            !n.sharePassword &&
            (!n.shareExpiryDate || new Date(n.shareExpiryDate) > new Date()),
    );

    if (publicNotes.length === 0) {
        console.warn("⚠ 无有效公开笔记，保留旧数据");
        process.exit(0);
    }

    const items = publicNotes.map((n) => {
        const iso = n.updatedAt || n.createdAt;
        const images = extractImages(n);

        return {
            datetime: formatDate(iso),
            display: relativeTime(iso),
            url: `${BLINKO_BASE}/share/${n.shareEncryptedUrl || n.id}`,
            content: n.content || "",
            ...(images.length > 0 && { images }),
        };
    });

    items.sort((a, b) => (b.datetime > a.datetime ? 1 : -1));

    await writeFile(OUTPUT, JSON.stringify(items, null, 2) + "\n", "utf-8");
    console.log(`✅ talks.json 已更新 (${items.length} 条)`);
}

main();
