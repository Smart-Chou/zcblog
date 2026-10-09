import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
import { getCollection } from "astro:content";
import { formatPosts } from "~/utils/format-posts";
import { site } from "~/config";

export async function GET(context: { site: URL }) {
    const article = await getCollection(
        "article",
        ({ data }: { data: { lang?: string } }) => data.lang === "en",
    );
    const formattedBlogs = formatPosts(article);
    const siteUrl = (context.site?.toString() || "").replace(/\/+$/, "");

    const feed = {
        version: "https://jsonfeed.org/version/1.1",
        title: `${site.title} (English)`,
        home_page_url: `${siteUrl}/en/`,
        feed_url: `${siteUrl}/en/feed.json`,
        description: site.description,
        language: "en",
        items: formattedBlogs.map((post) => {
            const pubDate =
                post.data.pubDate instanceof Date ? post.data.pubDate : new Date(post.data.pubDate);
            const url = `${siteUrl}/en/article/${post.id.replace(/-en$/, "")}/`;
            return {
                id: url,
                url,
                title: post.data.title as string,
                summary: (post.data.description as string) || undefined,
                content_html: sanitizeHtml(marked.parse((post.data.description as string) || "")),
                date_published: pubDate.toISOString(),
                tags: Array.isArray(post.data.tags) ? post.data.tags : undefined,
            };
        }),
    };

    return new Response(JSON.stringify(feed, null, 2), {
        headers: { "Content-Type": "application/feed+json; charset=utf-8" },
    });
}
