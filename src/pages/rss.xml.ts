import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
import { getCollection } from "astro:content";
import { formatPosts } from "~/utils/format-posts";
import getReadingTime from "reading-time";
import { site } from "~/config";

export async function GET(context: { site: URL }) {
    const article = await getCollection("article", ({ data }: { data: { lang?: string } }) => data.lang !== "en");
    const formattedBlogs = formatPosts(article);
    const siteTitle = site.title;
    const siteDescription = site.description;
    return rss({
        xmlns: { atom: "http://www.w3.org/2005/Atom" },
        title: siteTitle,
        description: siteDescription,
        site: context.site,
        items: formattedBlogs.map((post) => {
            const body = (post.body?.toString() || "").replace(/\n/g, "");
            const readingStats = getReadingTime(body);
            const wordCount = readingStats.words || "";
            const readTime = readingStats.text || "";

            const descriptionHtml = sanitizeHtml(marked.parse((post.data.description as string) || ""));
            const pubDate = post.data.pubDate instanceof Date ? post.data.pubDate : new Date(post.data.pubDate);
            return {
                title: post.data.title as string,
                pubDate,
                description: (post.data.description as string) || (post.data.title as string),
                link: `/article/${post.id}/`,
                content: descriptionHtml,
                customData: `<wordCount>${wordCount}</wordCount><readTime>${readTime}</readTime>`,
            };
        }),
        stylesheet: "/assets/rss/styles.xsl",
    });
}
