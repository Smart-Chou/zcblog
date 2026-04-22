/**
 * OG 图片生成 (Satori + Sharp)
 */
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import { site } from "~/config/site.config";
import fs from "node:fs";
import path from "node:path";

// 加载本地字体
const fontPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "fonts",
    "KaTeX_Main-Regular.5c94aef4.ttf",
);
const fontData = fs.readFileSync(fontPath);

export async function getStaticPaths() {
    const articles = await getCollection("article");
    return articles.map((entry) => ({
        params: { slug: entry.id },
        props: { entry },
    }));
}

export const GET: APIRoute = async ({ props }) => {
    const { entry } = props;
    const title = entry.data.title || "Article";
    const description = entry.data.description || site.description;

    const svg = await satori(
        {
            type: "div",
            props: {
                style: {
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "60px",
                    backgroundColor: "#ffffff",
                },
                children: [
                    {
                        type: "div",
                        props: {
                            children: title,
                            style: {
                                fontSize: "48px",
                                fontWeight: "bold",
                                color: "#000000",
                            },
                        },
                    },
                    {
                        type: "div",
                        props: {
                            children: description.slice(0, 100),
                            style: {
                                fontSize: "24px",
                                color: "#666666",
                                marginTop: "16px",
                            },
                        },
                    },
                    {
                        type: "div",
                        props: {
                            children: site.url,
                            style: {
                                fontSize: "18px",
                                color: "#999999",
                                marginTop: "40px",
                            },
                        },
                    },
                ],
            },
        },
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: "KaTeX Main",
                    data: fontData,
                },
            ],
        },
    );

    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    return new Response(new Uint8Array(pngBuffer), {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
};
