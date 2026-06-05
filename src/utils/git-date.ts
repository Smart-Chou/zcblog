import { execSync } from "child_process";
import { existsSync, statSync } from "fs";
import path from "path";

/** 缓存 git 提交日期查询结果，避免重复执行 shell 命令 */
const cache = new Map<string, Date | null>();

/** 文章私有仓库本地路径：CI 通过 ARTICLE_REPO_PATH 设置，本地用默认路径 */
const ARTICLE_REPO =
    process.env.ARTICLE_REPO_PATH || "/Users/chowcong/Documents/WebSiteCode/zcblog-articles";

/** 确认目录是一个 git 仓库（存在 .git 子目录） */
const isGitRepo = (dir: string) => existsSync(path.join(dir, ".git"));

/**
 * 对指定目录执行 git log 获取文件最后提交日期
 */
function gitLogDate(repoPath: string, fileName: string): string | null {
    try {
        const result = execSync(`git log --follow -1 --format=%aI -- "${fileName}"`, {
            encoding: "utf-8",
            cwd: repoPath,
            stdio: ["pipe", "pipe", "pipe"],
        }).trim();
        return result || null;
    } catch {
        return null;
    }
}

/**
 * 获取文件在 git 仓库中的最后提交日期
 *
 * 策略（按优先级）：
 * 1. 文章文件   → 私有文章仓库 git log（本地 dev / CI 均适用）
 * 2. 其他文件   → 当前仓库 git log
 * 3. 都失败     → 文件系统 mtime
 *
 * @param relativePath 相对于项目根目录的文件路径，例如 "src/content/article/foo.md"
 * @returns 最后提交日期，获取失败时返回 null
 */
export function getGitCommitDate(relativePath: string): Date | null {
    if (cache.has(relativePath)) {
        return cache.get(relativePath)!;
    }

    const isArticle = relativePath.startsWith("src/content/article/");
    const fileName = isArticle ? path.basename(relativePath) : relativePath;

    // 1. git 来源
    if (isArticle && isGitRepo(ARTICLE_REPO)) {
        const isoDate = gitLogDate(ARTICLE_REPO, fileName);
        if (isoDate) {
            const date = new Date(isoDate);
            if (!isNaN(date.getTime())) {
                cache.set(relativePath, date);
                return date;
            }
        }
    }

    if (!isArticle) {
        const isoDate = gitLogDate(process.cwd(), fileName);
        if (isoDate) {
            const date = new Date(isoDate);
            if (!isNaN(date.getTime())) {
                cache.set(relativePath, date);
                return date;
            }
        }
    }

    // 2. Fallback：文件系统 mtime
    try {
        const absPath = path.join(process.cwd(), relativePath);
        const stats = statSync(absPath);
        cache.set(relativePath, stats.mtime);
        return stats.mtime;
    } catch {
        // 文件不存在
    }

    cache.set(relativePath, null);
    return null;
}

/** 清空缓存（主要用于测试） */
export function clearGitDateCache(): void {
    cache.clear();
}
