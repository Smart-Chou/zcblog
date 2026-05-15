// 文章元数据 API - 供日历组件等前端消费
import { getCollection } from "astro:content";

export async function GET() {
    const posts = await getCollection("article", ({ data }) => !data.draft);
    const meta = posts.map((p) => ({
        id: p.id,
        title: p.data.title,
        published: p.data.pubDate.toISOString(),
    }));

    // Sort newest first
    meta.sort(
        (a, b) =>
            new Date(b.published).getTime() - new Date(a.published).getTime(),
    );

    return new Response(JSON.stringify(meta), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
