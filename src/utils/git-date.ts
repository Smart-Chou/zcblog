import { execSync } from "child_process";
import { statSync } from "fs";
import path from "path";

/** 缓存 git 提交日期查询结果，避免重复执行 shell 命令 */
const cache = new Map<string, Date | null>();

/**
 * 获取文件在 git 仓库中的最后提交日期
 *
 * 策略：
 * 1. 执行 `git log --follow -1 --format=%aI -- <file>` 获取 ISO 8601 日期
 * 2. 若失败（文件未追踪、不在 git 仓库中等），回退到文件系统 mtime
 * 3. 都失败则返回 null
 *
 * @param relativePath 相对于项目根目录的文件路径，例如 "src/content/article/foo.md"
 * @returns 最后提交日期，获取失败时返回 null
 */
export function getGitCommitDate(relativePath: string): Date | null {
    if (cache.has(relativePath)) {
        return cache.get(relativePath)!;
    }

    try {
        const result = execSync(`git log --follow -1 --format=%aI -- "${relativePath}"`, {
            encoding: "utf-8",
            cwd: process.cwd(),
            stdio: ["pipe", "pipe", "pipe"],
        })
            .trim();

        if (result) {
            const date = new Date(result);
            if (!isNaN(date.getTime())) {
                cache.set(relativePath, date);
                return date;
            }
        }
    } catch {
        // git 命令失败（非 git 仓库、文件未追踪等），继续尝试 fallback
    }

    // Fallback：使用文件系统的修改时间
    try {
        const absPath = path.join(process.cwd(), relativePath);
        const stats = statSync(absPath);
        cache.set(relativePath, stats.mtime);
        return stats.mtime;
    } catch {
        // 文件也不存在，放弃
    }

    cache.set(relativePath, null);
    return null;
}

/** 清空缓存（主要用于测试） */
export function clearGitDateCache(): void {
    cache.clear();
}
