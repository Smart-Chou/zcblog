/**
 * OG 图片生成 (Satori + Sharp)
 */
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import { site } from "~/self.config";
import fs from "node:fs";
import path from "node:path";

// 加载本地字体 (Noto Sans SC 支持中文字形)
const fontRegularPath = path.join(
    process.cwd(),
    "src",
    "assets",
    "fonts",
    "NotoSansSC-Regular.ttf",
);
const fontBoldPath = path.join(
    process.cwd(),
    "src",
    "assets",
    "fonts",
    "NotoSansSC-Bold.ttf",
);
const fontRegularData = fs.readFileSync(fontRegularPath);
const fontBoldData = fs.readFileSync(fontBoldPath);

export async function getStaticPaths() {
    const articles = await getCollection("article");
    return articles.map((entry) => ({
        params: { og: entry.id },
        props: { entry },
    }));
}

export const GET: APIRoute = async ({ props }) => {
    const { entry } = props;
    const title = entry.data.title || "Article";
    const description = entry.data.description || site.description;

    // 截断过长标题（中文约 1-2 行）
    const displayTitle = title.length > 30 ? title.slice(0, 30) + "…" : title;
    const displayDesc =
        description.length > 100
            ? description.slice(0, 100) + "…"
            : description;

    const svg = await satori(
        {
            type: "div",
            props: {
                style: {
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    padding: "72px 88px 56px",
                    backgroundImage:
                        "linear-gradient(135deg, #0d1117 0%, #161b22 40%, #0f1419 100%)",
                    borderLeftWidth: "6px",
                    borderLeftStyle: "solid",
                    borderLeftColor: "#d4a040",
                    position: "relative",
                },
                children: [
                    // 右上角装饰光晕
                    {
                        type: "div",
                        props: {
                            style: {
                                position: "absolute",
                                top: "-60px",
                                right: "-60px",
                                width: "280px",
                                height: "280px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(212, 160, 64, 0.07)",
                            },
                        },
                    },
                    // 底部装饰光点
                    {
                        type: "div",
                        props: {
                            style: {
                                position: "absolute",
                                bottom: "48px",
                                right: "88px",
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(212, 160, 64, 0.6)",
                            },
                        },
                    },
                    // 标题
                    {
                        type: "div",
                        props: {
                            children: displayTitle,
                            style: {
                                fontSize: "80px",
                                fontWeight: 700,
                                color: "#f0f0f0",
                                letterSpacing: "-0.3px",
                                lineHeight: "1.35",
                            },
                        },
                    },
                    // 金色装饰线
                    {
                        type: "div",
                        props: {
                            style: {
                                width: "100px",
                                height: "4px",
                                backgroundColor: "#d4a040",
                                marginTop: "28px",
                                borderRadius: "2px",
                            },
                        },
                    },
                    // 描述
                    {
                        type: "div",
                        props: {
                            children: displayDesc,
                            style: {
                                fontSize: "24px",
                                fontWeight: 400,
                                color: "#8b949e",
                                marginTop: "24px",
                                lineHeight: "1.55",
                            },
                        },
                    },
                    // 弹性占位
                    { type: "div", props: { style: { flexGrow: 1 } } },
                    // 底部分隔线 + URL
                    {
                        type: "div",
                        props: {
                            style: {
                                borderTopWidth: "1px",
                                borderTopStyle: "solid",
                                borderTopColor: "rgba(255,255,255,0.08)",
                                paddingTop: "24px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            },
                            children: [
                                {
                                    type: "div",
                                    props: {
                                        children: site.url.replace(
                                            "https://",
                                            "",
                                        ),
                                        style: {
                                            fontSize: "18px",
                                            fontWeight: 400,
                                            color: "#5c6370",
                                            letterSpacing: "0.2px",
                                        },
                                    },
                                },
                                {
                                    type: "div",
                                    props: {
                                        children: site.title,
                                        style: {
                                            fontSize: "18px",
                                            fontWeight: 400,
                                            color: "#5c6370",
                                        },
                                    },
                                },
                            ],
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
                    name: "Noto Sans SC",
                    data: fontRegularData,
                    weight: 400,
                },
                {
                    name: "Noto Sans SC",
                    data: fontBoldData,
                    weight: 700,
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
