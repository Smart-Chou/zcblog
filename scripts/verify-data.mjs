/**
 * verify-data.mjs
 * 在所有 fetch 脚本完成后验证数据文件非空。
 * 如果数据缺失，打印警告但不阻塞构建——允许在数据不完整时继续构建。
 *
 * 用法: node scripts/verify-data.mjs
 */

import { stat } from "node:fs/promises";

const DATA_FILES = [
    { path: "src/data/douban.json", label: "豆瓣" },
    { path: "src/data/talks.json", label: "Talks (Blinko)" },
    { path: "src/data/friends-articles.json", label: "友链文章" },
    { path: "src/data/bangumi.json", label: "Bangumi" },
];

let hasError = false;

for (const { path, label } of DATA_FILES) {
    try {
        const s = await stat(path);
        if (s.size === 0) {
            console.warn(`⚠️  [fetch:verify] ${label} 数据文件为空: ${path}`);
            hasError = true;
        } else {
            console.log(`✅ [fetch:verify] ${label} 数据正常 (${(s.size / 1024).toFixed(1)} KB)`);
        }
    } catch {
        console.warn(`⚠️  [fetch:verify] ${label} 数据文件缺失: ${path}`);
        hasError = true;
    }
}

if (hasError) {
    console.warn("⚠️  [fetch:verify] 部分数据缺失，构建将继续但页面可能缺少内容。");
}

// 始终返回 0——不阻塞构建，但在 CI 日志中可见警告
process.exit(0);
