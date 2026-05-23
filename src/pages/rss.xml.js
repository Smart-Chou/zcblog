import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
import { getCollection } from "astro:content";
import { formatPosts } from "~/utils/formatPosts";
import getReadingTime from "reading-time";
import { site, author } from "~/config";

export async function GET(context) {
    const article = await getCollection("article");
    const formattedBlogs = formatPosts(article);
    const siteTitle = site.title;
    const siteDescription = site.description;
    return rss({
        xmlns: { atom: "http://www.w3.org/2005/Atom" },
        title: siteTitle,
        description: siteDescription,
        site: context.site,
        author: author.type,
        source: {
            title: siteTitle,
            url: site.url,
        },
        items: formattedBlogs.map((post) => {
            const body = post.body?.toString().replace(/\n/g, "") || "";
            const readingStats = getReadingTime(body);
            const wordCount = readingStats.words || "";
            const readTime = readingStats.text || "";

            const descriptionHtml = sanitizeHtml(marked.parse(post.data.description || ""));
            return {
                title: post.data.title,
                pubDate: post.data.pubDate,
                description: post.data.description,
                link: `/article/${post.id}/`,
                content: descriptionHtml,
                customData: `<wordCount>${wordCount}</wordCount><readTime>${readTime}</readTime>`,
            };
        }),
        stylesheet: "/assets/rss/styles.xsl",
    });
}
