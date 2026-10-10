import { getCollection } from "astro:content";
import { formatPosts } from "~/utils/format-posts";
import { site } from "~/config";

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export async function GET(context: { site: URL }) {
    const article = await getCollection(
        "article",
        ({ data }: { data: { lang?: string } }) => data.lang !== "en",
    );
    const formattedBlogs = formatPosts(article);
    const siteUrl = (context.site?.toString() || "").replace(/\/+$/, "");

    const updated =
        formattedBlogs.length > 0
            ? new Date(
                  Math.max(
                      ...formattedBlogs.map((post) =>
                          new Date(post.data.pubDate as string | Date).getTime(),
                      ),
                  ),
              ).toISOString()
            : new Date().toISOString();

    const entries = formattedBlogs
        .map((post) => {
            const pubDate =
                post.data.pubDate instanceof Date ? post.data.pubDate : new Date(post.data.pubDate);
            const url = `${siteUrl}/article/${post.id}/`;
            const description = (post.data.description as string) || (post.data.title as string);
            return [
                "  <entry>",
                `    <title>${escapeXml(post.data.title as string)}</title>`,
                `    <link href="${escapeXml(url)}" />`,
                `    <id>${escapeXml(url)}</id>`,
                `    <published>${pubDate.toISOString()}</published>`,
                `    <updated>${pubDate.toISOString()}</updated>`,
                `    <preview:humanDate>${pubDate.toISOString().slice(0, 10)}</preview:humanDate>`,
                `    <summary type="text">${escapeXml(description)}</summary>`,
                "  </entry>",
            ].join("\n");
        })
        .join("\n");

    const xml = [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:preview="urn:feed-preview">',
        `  <title>${escapeXml(site.title)}</title>`,
        `  <subtitle>${escapeXml(site.description)}</subtitle>`,
        `  <link href="${siteUrl}/" />`,
        `  <link href="${siteUrl}/atom.xml" rel="self" type="application/atom+xml" />`,
        `  <id>${siteUrl}/</id>`,
        `  <updated>${updated}</updated>`,
        "  <generator>Astro</generator>",
        entries,
        "</feed>",
        "",
    ].join("\n");

    // 手动注入显式 type="text/css" 的预览样式表处理指令（XSLT 已被浏览器弃用；缺省 type 时部分浏览器不加载）
    const xmlWithStylesheet = xml.replace(
        "<feed",
        `<?xml-stylesheet href="/assets/rss/styles.css" type="text/css"?><feed`,
    );

    return new Response(xmlWithStylesheet, {
        headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
    });
}
