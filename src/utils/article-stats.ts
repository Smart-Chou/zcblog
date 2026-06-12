import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

/** 获取所有文章（Astro 内部已缓存，多次调用不会重复读取）。 */
export function getAllArticles(): Promise<CollectionEntry<"article">[]> {
    return getCollection("article");
}

// ── 模块级缓存：全站统计只计算一次 ──
let _statsCache: ArticleStats | null = null;

/** 使缓存失效（内容更新后调用）。 */
export function invalidateStatsCache(): void {
    _statsCache = null;
}

export interface ArticleStats {
    totalPosts: number;
    totalTags: number;
    /** 去除空格后的总字符数（中文博客中"字数"以字符计） */
    totalCharCount: number;
}

export async function getArticleStats(): Promise<ArticleStats> {
    if (_statsCache) return _statsCache;

    const allPosts = await getAllArticles();
    const totalPosts = allPosts.length;
    const totalTags = new Set(getAllTags(allPosts)).size;
    const totalCharCount = allPosts.reduce((sum: number, post: CollectionEntry<"article">) => {
        const body = post.body || "";
        return sum + body.replace(/\s+/g, "").length;
    }, 0);
    _statsCache = { totalPosts, totalTags, totalCharCount };
    return _statsCache;
}

/**
 * Extract tags from posts.
 * Use `new Set(getAllTags(posts))` for unique.
 * @param maxPerPost - Max tags to take from each post (default: all).
 */
export function getAllTags(posts: CollectionEntry<"article">[], maxPerPost?: number): string[] {
    return posts.flatMap((p) => {
        const tags = p.data.tags || [];
        return maxPerPost != null ? tags.slice(0, maxPerPost) : tags;
    });
}
