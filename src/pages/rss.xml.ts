import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
import { getCollection } from "astro:content";
import { formatPosts } from "~/utils/format-posts";
import getReadingTime from "reading-time";
import { site } from "~/config";

export async function GET(context: { site: URL }) {
    const article = await getCollection(
        "article",
        ({ data }: { data: { lang?: string } }) => data.lang !== "en",
    );
    const formattedBlogs = formatPosts(article);
    const siteTitle = site.title;
    const siteDescription = site.description;
    // 不通过 rss() 的 stylesheet 选项 —— 手动注入显式 type="text/css" 的处理指令：
    // XSLT 已被各浏览器弃用（Chrome 158 起停用）；缺省 type 的 PI 各浏览器行为不一致，显式最稳。
    const response = await rss({
        xmlns: { atom: "http://www.w3.org/2005/Atom" },
        title: siteTitle,
        description: siteDescription,
        site: context.site,
        items: formattedBlogs.map((post) => {
            const body = (post.body?.toString() || "").replace(/\n/g, "");
            const readingStats = getReadingTime(body);
            const wordCount = readingStats.words || "";
            const readTime = readingStats.text || "";

            const descriptionHtml = sanitizeHtml(
                marked.parse((post.data.description as string) || ""),
            );
            const pubDate =
                post.data.pubDate instanceof Date ? post.data.pubDate : new Date(post.data.pubDate);
            return {
                title: post.data.title as string,
                pubDate,
                description: (post.data.description as string) || (post.data.title as string),
                categories: Array.isArray(post.data.tags) ? post.data.tags : [],
                link: `/article/${post.id}/`,
                content: descriptionHtml,
                customData: `<humanDate>${pubDate.toISOString().slice(0, 10)}</humanDate><wordCount>${wordCount}</wordCount><readTime>${readTime}</readTime>`,
            };
        }),
    });
    const xml = await response.text();
    return new Response(
        xml.replace(
            /<rss\b/,
            `<?xml-stylesheet href="/assets/rss/styles.css" type="text/css"?><rss`,
        ),
        { status: 200, headers: response.headers },
    );
}
