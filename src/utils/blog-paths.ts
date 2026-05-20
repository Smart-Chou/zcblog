import { getCollection } from "astro:content";
import { config } from "~/self.config";
import { enrichPost } from "~/utils/getPostsWithMeta";
import { compareByPubDate } from "~/utils";

export async function blogGetStaticPaths({
    paginate,
}: {
    paginate: (data: any[], options: { pageSize: number }) => any[];
}) {
    const allPosts = await getCollection("article");
    const pageSize = config.PageSize || 10;

    const postsWithPrecomputedMeta = allPosts.map((post) => {
        const enriched = enrichPost(post);
        const sticky = post.data.sticky || 0;
        return { ...enriched, sticky };
    });

    const sortedPosts = postsWithPrecomputedMeta.sort((a, b) => {
        const stickyDiff = (Number(b.sticky) || 0) - (Number(a.sticky) || 0);
        return stickyDiff || compareByPubDate(a, b);
    });
    return paginate(sortedPosts, { pageSize });
}
