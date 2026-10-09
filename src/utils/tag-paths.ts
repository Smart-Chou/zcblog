import type { CollectionEntry } from "astro:content";
import { getAllTags, getAllArticles, normalizeTag } from "./article-stats";
import { filterByLang, type ArticleLang } from "./article-url";

/**
 * 生成按语言过滤的标签页 getStaticPaths：
 * - zh → /tags/<tag>/（仅中文文章）
 * - en → /en/tags/<tag>/（仅英文文章）
 */
export function makeTagPostsGetStaticPaths(lang: ArticleLang) {
    return async function tagPostsGetStaticPaths() {
        const allArticles = filterByLang(await getAllArticles(), lang);
        const allTags = getAllTags(allArticles);
        const uniqueTags = [...new Set(allTags.map(normalizeTag))];
        return uniqueTags.map((tag) => ({
            params: { tag },
            props: {
                articles: allArticles.filter((post: CollectionEntry<"article">) =>
                    (post.data.tags || []).some((t: string) => normalizeTag(t) === tag),
                ),
            },
        }));
    };
}
