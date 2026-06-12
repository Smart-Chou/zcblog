import { getAllArticles } from "./article-stats";
import { sortByPubDate } from "./date-utils";

// ── 模块级缓存：文章排序结果只计算一次 ──
let _sortedSlugs: string[] | null = null;

/** 使缓存失效（内容更新后调用）。 */
export function invalidateAdjacentCache(): void {
    _sortedSlugs = null;
}

/**
 * 获取当前文章的前后相邻文章 slug。
 * 首次调用时排序全部文章并缓存，后续调用 O(1) 索引查找。
 *
 * @returns {{ prev: string | null; next: string | null }} 前一/后一篇文章的 slug
 */
export async function getAdjacentPosts(slug: string): Promise<{
    prev: string | null;
    next: string | null;
}> {
    if (!_sortedSlugs) {
        const posts = await getAllArticles();
        _sortedSlugs = sortByPubDate(posts).map((p) => p.id);
    }

    const idx = _sortedSlugs.indexOf(slug);
    if (idx === -1) return { prev: null, next: null };

    return {
        prev: idx > 0 ? _sortedSlugs[idx - 1] : null,
        next: idx < _sortedSlugs.length - 1 ? _sortedSlugs[idx + 1] : null,
    };
}
