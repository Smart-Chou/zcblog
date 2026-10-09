import type { CollectionEntry } from "astro:content";
import { config } from "~/config";
import { enrichPost } from "~/utils/get-posts-with-meta";
import { compareByPubDate } from "~/utils";
import { getAllArticles } from "~/utils/article-stats";
import {
    articleLang,
    articleSlug,
    articleUrl,
    filterByLang,
    type ArticleLang,
} from "~/utils/article-url";

interface PaginateFn {
    (
        data: unknown[],
        options: { pageSize: number },
    ): Promise<{
        data: unknown[];
        url: { prev?: string; next?: string };
        currentPage: number;
        lastPage: number;
    }>;
}

/**
 * 生成按语言过滤的博客列表 getStaticPaths：
 * - zh → /blog/N/（仅中文文章）
 * - en → /en/blog/N/（仅英文文章）
 */
export function makeBlogGetStaticPaths(lang: ArticleLang) {
    return async function blogGetStaticPaths({ paginate }: { paginate: PaginateFn }) {
        // 仅取对应语言的文章；一篇都没有时 paginate([]) 仍会生成第 1 页（空态）
        const allPosts = filterByLang(await getAllArticles(), lang);
        const pageSize = config.PageSize || 10;

        const postsWithPrecomputedMeta = allPosts.map((post: CollectionEntry<"article">) => {
            const enriched = enrichPost(post);
            const sticky = post.data.sticky || 0;
            return {
                ...enriched,
                slug: articleSlug(post),
                url: articleUrl(post),
                lang: articleLang(post),
                sticky,
            };
        });

        const sortedPosts = postsWithPrecomputedMeta.sort(
            (
                a: (typeof postsWithPrecomputedMeta)[number],
                b: (typeof postsWithPrecomputedMeta)[number],
            ) => {
                const stickyDiff = (Number(b.sticky) || 0) - (Number(a.sticky) || 0);
                return stickyDiff || compareByPubDate(a, b);
            },
        );
        return paginate(sortedPosts, { pageSize });
    };
}
