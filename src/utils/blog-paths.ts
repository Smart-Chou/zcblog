import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { config } from "~/config";
import { enrichPost } from "~/utils/get-posts-with-meta";
import { compareByPubDate } from "~/utils";

export async function blogGetStaticPaths({
    paginate,
}: {
    paginate: (
        data: unknown[],
        options: { pageSize: number },
    ) => Promise<{
        data: unknown[];
        url: { prev?: string; next?: string };
        currentPage: number;
        lastPage: number;
    }>;
}) {
    const allPosts = await getCollection("article");
    const pageSize = config.PageSize || 10;

    const postsWithPrecomputedMeta = allPosts.map((post: CollectionEntry<"article">) => {
        const enriched = enrichPost(post);
        const sticky = post.data.sticky || 0;
        return { ...enriched, sticky };
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
}
