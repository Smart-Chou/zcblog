import { getAllArticles } from "./article-stats";
import { sortByPubDate } from "./date-utils";
import { articleLang, type ArticleLang } from "./article-url";

// ── 模块级缓存：各语言的文章排序结果只计算一次 ──
const _sortedIdsByLang: Partial<Record<ArticleLang, string[]>> = {};

/** 使缓存失效（内容更新后调用）。 */
export function invalidateAdjacentCache(): void {
    _sortedIdsByLang.zh = undefined;
    _sortedIdsByLang.en = undefined;
}

/**
 * 获取当前文章在同一语言内的前后相邻文章。
 * 首次调用时按语言排序并缓存，后续调用 O(1) 索引查找。
 *
 * @param entryId 文章集合 id（英文文章形如 `foo.en`）
 * @param lang 语言（只会返回同语言文章的相邻项）
 * @returns {{ prev: string | null; next: string | null }} 前一/后一篇文章的集合 id
 */
export async function getAdjacentPosts(
    entryId: string,
    lang: ArticleLang,
): Promise<{
    prev: string | null;
    next: string | null;
}> {
    if (!_sortedIdsByLang[lang]) {
        const posts = (await getAllArticles()).filter((p) => articleLang(p) === lang);
        _sortedIdsByLang[lang] = sortByPubDate(posts).map((p) => p.id);
    }

    const sortedIds = _sortedIdsByLang[lang]!;
    const idx = sortedIds.indexOf(entryId);
    if (idx === -1) return { prev: null, next: null };

    return {
        prev: idx > 0 ? sortedIds[idx - 1] : null,
        next: idx < sortedIds.length - 1 ? sortedIds[idx + 1] : null,
    };
}
