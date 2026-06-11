import type { CollectionEntry } from "astro:content";
import { getAllTags, getAllArticles } from "./article-stats";

export async function tagPostsGetStaticPaths() {
    const allArticles = await getAllArticles();
    const allTags = getAllTags(allArticles);
    const uniqueTags = [...new Set(allTags.map((tag) => tag.toUpperCase().replace(/\s+/g, "-")))];
    return uniqueTags.map((tag) => ({
        params: { tag },
        props: {
            articles: allArticles.filter((post: CollectionEntry<"article">) =>
                (post.data.tags || []).some((t: string) => t.toUpperCase() === tag),
            ),
        },
    }));
}
