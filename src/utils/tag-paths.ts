import { getCollection } from "astro:content";
import { getAllTags } from "./article-stats";

export async function tagPostsGetStaticPaths() {
    const allArticles = await getCollection("article");
    const allTags = getAllTags(allArticles);
    const uniqueTags = [...new Set(allTags.map((tag) => tag.toUpperCase()))];
    return uniqueTags.map((tag) => ({
        params: { tag },
        props: {
            articles: allArticles.filter((post) =>
                (post.data.tags || []).some((t) => t.toUpperCase() === tag),
            ),
        },
    }));
}
