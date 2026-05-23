import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export interface ArticleStats {
    totalPosts: number;
    totalTags: number;
    totalWordCount: number;
}

export async function getArticleStats(): Promise<ArticleStats> {
    const allPosts = await getCollection("article");
    const totalPosts = allPosts.length;
    const totalTags = new Set(getAllTags(allPosts)).size;
    const totalWordCount = allPosts.reduce((sum: number, post: CollectionEntry<"article">) => {
        const body = post.body || "";
        return sum + body.replace(/\s+/g, "").length;
    }, 0);
    return { totalPosts, totalTags, totalWordCount };
}

/** Extract all tags (including duplicates) from posts. Use `new Set(getAllTags(posts))` for unique. */
export function getAllTags(posts: CollectionEntry<"article">[]): string[] {
    return posts.flatMap((p) => p.data.tags || []);
}
