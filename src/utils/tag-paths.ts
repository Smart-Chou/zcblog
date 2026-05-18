import { getCollection } from "astro:content";

export async function tagPostsGetStaticPaths() {
    const allArticles = await getCollection("article");
    const allTags = allArticles.map((post) => post.data.tags || []).flat();
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
