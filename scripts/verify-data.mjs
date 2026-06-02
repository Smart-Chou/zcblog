/**
 * verify-data.mjs
 * 在所有 fetch 脚本完成后验证数据文件内容。
 * 检查: (1) 文件存在且非空 (2) 至少 1 条记录 (3) 数据时效性。
 *
 * 用法: node scripts/verify-data.mjs
 */

import { readFile, stat } from "node:fs/promises";

const DATA_FILES = [
    {
        path: "src/data/douban.json",
        label: "豆瓣",
        checkFreshness: true,
        maxAgeDays: 30,
    },
    {
        path: "src/data/talks.json",
        label: "Talks (Blinko)",
        checkFreshness: true,
        maxAgeDays: 7,
    },
    {
        path: "src/data/friends-articles.json",
        label: "友链文章",
        checkFreshness: true,
        maxAgeDays: 7,
    },
    {
        path: "src/data/bangumi.json",
        label: "Bangumi",
        checkFreshness: true,
        maxAgeDays: 7,
    },
];

/**
 * Extract the most recent timestamp from a JSON data file.
 * Supports common patterns: `date`, `pubDate`, `created`, `updated`, `time_stamp`, `timestamp`.
 */
function getLatestTimestamp(data) {
    const records = Array.isArray(data) ? data : data.data || data.items || [];
    if (records.length === 0) return null;

    let latest = null;
    for (const record of records) {
        const ts =
            record.date ||
            record.pubDate ||
            record.created ||
            record.updated ||
            record.time_stamp ||
            record.timestamp;
        if (!ts) continue;
        const d = new Date(ts);
        if (!isNaN(d.getTime()) && (!latest || d > latest)) {
            latest = d;
        }
    }
    return latest;
}

function getRecordCount(data) {
    if (Array.isArray(data)) return data.length;
    if (Array.isArray(data.data)) return data.data.length;
    if (Array.isArray(data.items)) return data.items.length;
    // If it's a record-style JSON (e.g., friends-articles.json with keyed entries)
    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
        const keys = Object.keys(data);
        if (keys.length > 0) return keys.length;
    }
    return 0;
}

let hasError = false;

for (const { path, label, checkFreshness, maxAgeDays = 7 } of DATA_FILES) {
    try {
        // 1. Check file exists and is non-empty
        const s = await stat(path);
        if (s.size === 0) {
            console.warn(`⚠️  [fetch:verify] ${label} 数据文件为空: ${path}`);
            hasError = true;
            continue;
        }

        // 2. Read and parse JSON
        const raw = await readFile(path, "utf-8");
        let data;
        try {
            data = JSON.parse(raw);
        } catch {
            console.warn(`⚠️  [fetch:verify] ${label} JSON 解析失败: ${path}`);
            hasError = true;
            continue;
        }

        // 3. Check at least 1 record
        const count = getRecordCount(data);
        if (count === 0) {
            console.warn(`⚠️  [fetch:verify] ${label} 数据为空数组/对象: ${path}`);
            hasError = true;
            continue;
        }

        // 4. Freshness check (optional per data source)
        let ageInfo = "";
        if (checkFreshness) {
            const latest = getLatestTimestamp(data);
            if (latest) {
                const ageDays = (Date.now() - latest.getTime()) / (1000 * 60 * 60 * 24);
                ageInfo = `，最新数据: ${latest.toISOString().slice(0, 10)} (${ageDays.toFixed(1)} 天前)`;
                if (ageDays > maxAgeDays) {
                    console.warn(
                        `⚠️  [fetch:verify] ${label} 数据过期 (>${maxAgeDays} 天)${ageInfo}: ${path}`,
                    );
                    hasError = true;
                    continue;
                }
            } else {
                ageInfo = "，无时间戳字段（跳过时效检查）";
            }
        }

        console.log(
            `✅ [fetch:verify] ${label} 数据正常: ${count} 条记录 (${(s.size / 1024).toFixed(1)} KB)${ageInfo}`,
        );
    } catch {
        console.warn(`⚠️  [fetch:verify] ${label} 数据文件缺失: ${path}`);
        hasError = true;
    }
}

if (hasError) {
    console.warn("⚠️  [fetch:verify] 部分数据异常，请检查 fetch 脚本运行状态。");
    process.exit(1);
}

console.log("✅ [fetch:verify] 所有数据验证通过。");
process.exit(0);
