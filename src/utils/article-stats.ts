import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import getReadingTime from "reading-time";
import { articleLang, type ArticleLang } from "./article-url";

/**
 * 获取所有「已发布」文章（Astro 内部已缓存，多次调用不会重复读取）。
 * 默认排除草稿：列表 / 归档 / 标签 / 相邻文章导航 / 统计 / OG 图等入口共享此函数。
 */
export function getAllArticles(): Promise<CollectionEntry<"article">[]> {
    return getCollection(
        "article",
        ({ data }: CollectionEntry<"article">) => !(data.draft ?? false),
    );
}

/** 获取指定语言的已发布文章（zh 含无 lang 字段的文章；en 仅 lang: en） */
export async function getArticlesByLang(lang: ArticleLang): Promise<CollectionEntry<"article">[]> {
    return (await getAllArticles()).filter((post) => articleLang(post) === lang);
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
    /** 总字数 — 使用 reading-time 库（与文章页 wordCount 统计口径一致） */
    totalWords: number;
}

/** 标准化标签名（大小写合并 + 空格转连字符），保证标签统计口径一致 */
export function normalizeTag(tag: string): string {
    return tag.toUpperCase().replace(/\s+/g, "-");
}

export async function getArticleStats(): Promise<ArticleStats> {
    if (_statsCache) return _statsCache;

    // 与首页/列表口径保持一致：草稿不计入站点统计
    const allPosts = (await getAllArticles()).filter((post) => !(post.data.draft ?? false));
    const totalPosts = allPosts.length;
    const totalTags = new Set(getAllTags(allPosts).map(normalizeTag)).size;
    const totalWords = allPosts.reduce((sum: number, post: CollectionEntry<"article">) => {
        const body = post.body || "";
        return sum + getReadingTime(body).words;
    }, 0);
    _statsCache = { totalPosts, totalTags, totalWords };
    return _statsCache;
}

/**
 * Extract tags from posts.
 * Use `new Set(getAllTags(posts).map(normalizeTag))` for unique, normalized count.
 * @param maxPerPost - Max tags to take from each post (default: all).
 */
export function getAllTags(posts: CollectionEntry<"article">[], maxPerPost?: number): string[] {
    return posts.flatMap((p) => {
        const tags = p.data.tags || [];
        return maxPerPost != null ? tags.slice(0, maxPerPost) : tags;
    });
}
