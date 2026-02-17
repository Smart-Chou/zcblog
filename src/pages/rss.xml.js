import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
import { getCollection } from "astro:content";
import { formatPosts } from "~/utils/formatPosts";
import getReadingTime from "reading-time";
import { site, author } from "~/self.config";

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
            url: "https://marxchou.com",
        },
        items: formattedBlogs.map((post) => {
            const body = post.body?.toString().replace(/\n/g, "") || "";
            const wordCount = getReadingTime(body).words || "";
            const readTime = getReadingTime(body).text || "";

            return {
                title: post.data.title,
                pubDate: post.data.pubDate,
                description: post.data.description,
                link: `/article/${post.id}/`,
                content: `${[
                    sanitizeHtml(
                        marked.parse("WordCount: " + wordCount + " words"),
                    ) + sanitizeHtml(marked.parse("ReadTime: " + readTime)),
                ]}`,
            };
        }),
        stylesheet: "/assets/rss/styles.xsl",
    });
}
