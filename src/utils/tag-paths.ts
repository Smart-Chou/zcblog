import { getCollection } from "astro:content";

export async function tagPostsGetStaticPaths() {
    const allArticles = await getCollection("article");
    const uniqueTags = [
        ...new Set(allArticles.map((post) => post.data.tags || []).flat()),
    ];
    return uniqueTags.map((tag) => ({
        params: { tag },
        props: {
            articles: allArticles.filter((post) =>
                (post.data.tags || []).includes(tag),
            ),
        },
    }));
}
