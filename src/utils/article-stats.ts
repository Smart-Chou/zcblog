import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

/** 获取所有文章（Astro 内部已缓存，多次调用不会重复读取）。 */
export function getAllArticles(): Promise<CollectionEntry<"article">[]> {
    return getCollection("article");
}

export interface ArticleStats {
    totalPosts: number;
    totalTags: number;
    totalWordCount: number;
}

export async function getArticleStats(): Promise<ArticleStats> {
    const allPosts = await getAllArticles();
    const totalPosts = allPosts.length;
    const totalTags = new Set(getAllTags(allPosts)).size;
    const totalWordCount = allPosts.reduce((sum: number, post: CollectionEntry<"article">) => {
        const body = post.body || "";
        return sum + body.replace(/\s+/g, "").length;
    }, 0);
    return { totalPosts, totalTags, totalWordCount };
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
