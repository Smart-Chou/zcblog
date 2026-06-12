/**
 * remark-code-blocks — 单次 tree walk 处理所有特殊代码块 + 代码折叠
 *
 *   代码折叠:     所有常规代码块追加 collapse meta
 *   ```mermaid   → <pre class="mermaid">
 *   ```chart:*   → <div class="chart-container">
 *   ```markmap   → <div class="markmap-container">
 *   ```plantuml  → 内联 SVG（构建时从 PlantUML 服务器获取，5s 超时降级）
 *   ```reveal    → <div class="reveal-wrapper">
 *   ```youtube / ```bilibili → 视频嵌入
 */
import { visit } from "unist-util-visit";
import { deflateSync } from "node:zlib";
import { config } from "../config/index.ts";

const YOUTUBE_EMBED = "https://www.youtube.com/embed/";
const BILIBILI_EMBED = "https://player.bilibili.com/player.html";
const PLANTUML_SERVER = "https://www.plantuml.com/plantuml";

const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="100" viewBox="0 0 400 100">
  <rect width="400" height="100" fill="#f8f9fa" rx="8" ry="8" stroke="#dee2e6" stroke-width="1"/>
  <text x="200" y="45" text-anchor="middle" fill="#868e96" font-size="13" font-family="sans-serif">
    PlantUML diagram unavailable
  </text>
  <text x="200" y="68" text-anchor="middle" fill="#adb5bd" font-size="11" font-family="sans-serif">
    (server timeout)
  </text>
</svg>`;

function randomId(prefix: string) {
    return prefix + "-" + Math.random().toString(36).slice(2, 8);
}

// ── PlantUML utilities ──

function encode64(data: Buffer) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    let result = "";
    for (let i = 0; i < data.length; i += 3) {
        const b1 = data[i],
            b2 = data[i + 1] || 0,
            b3 = data[i + 2] || 0;
        result += chars[b1 >> 2];
        result += chars[((b1 & 3) << 4) | (b2 >> 4)];
        result += chars[((b2 & 15) << 2) | (b3 >> 6)];
        result += chars[b3 & 63];
    }
    return result;
}

function encodePlantUML(code: string) {
    const deflated = deflateSync(Buffer.from(code, "utf-8"), { level: 9 });
    return encode64(deflated);
}

async function fetchPlantUmlSvg(encoded: string): Promise<string | null> {
    const url = PLANTUML_SERVER + "/svg/~1" + encoded;
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) return null;
        return await res.text();
    } catch {
        return null;
    }
}

function wrapSvg(svgContent: string, isFallback: boolean): string {
    return (
        '<div class="plantuml-diagram"><div class="plantuml-wrapper">' +
        (isFallback ? svgContent : svgContent.replace(/^<\?xml[^>]*\?>/, "").trim()) +
        "</div></div>"
    );
}

export function remarkCodeBlocks() {
    return async (tree: any, vfile: any) => {
        const frontmatter = vfile?.data?.astro?.frontmatter ?? {};
        const plantumlEnabled = frontmatter.plantuml === true;

        const plantumlNodes: { node: any; encoded: string }[] = [];

        visit(tree, "code", (node: any) => {
            const lang = node.lang || "";

            // ── 同步处理 ──

            // Mermaid
            if (lang === "mermaid") {
                node.type = "html";
                node.value = '<pre class="mermaid">\n' + node.value + "\n</pre>";
                return;
            }

            // Markmap
            if (lang === "markmap") {
                const mmId = randomId("markmap");
                const encoded = Buffer.from(node.value).toString("base64");
                node.type = "html";
                node.value =
                    '<svg class="markmap-container" id="' +
                    mmId +
                    '" data-markmap="' +
                    encoded +
                    '" style="width:100%;height:400px"></svg>';
                return;
            }

            // Chart.js (lang starts with "chart")
            if (lang.startsWith("chart")) {
                const parts = lang.split(":");
                const chartType = parts[1] || "bar";
                const chartId = randomId("chart");

                let chartData = {};
                let chartOptions = {};
                try {
                    const parsed = JSON.parse(node.value);
                    chartData = parsed.data || parsed;
                    chartOptions = parsed.options || {};
                } catch {
                    chartData = { error: "Invalid JSON" };
                }

                const chartConfig = Buffer.from(
                    JSON.stringify({
                        type: chartType,
                        data: chartData,
                        options: chartOptions,
                    }),
                ).toString("base64");

                node.type = "html";
                node.value =
                    '<div class="chart-container" id="' +
                    chartId +
                    '" data-chart="' +
                    chartConfig +
                    '" style="height:400px"><canvas id="' +
                    chartId +
                    '-canvas"></canvas></div>';
                return;
            }

            // Reveal.js
            if (lang === "reveal") {
                const revealId = randomId("reveal");
                const encoded = Buffer.from(node.value).toString("base64");
                node.type = "html";
                node.value =
                    '<div class="reveal-wrapper" id="' +
                    revealId +
                    '" data-reveal="' +
                    encoded +
                    '" style="margin:1rem 0;border:1px solid var(--color-border,#e5e7eb);border-radius:8px;overflow:hidden;background:#fff"></div>';
                return;
            }

            // PlantUML — 仅当 frontmatter.plantuml 为 true 时处理
            if (lang === "plantuml") {
                if (plantumlEnabled && node.value && node.value.trim()) {
                    plantumlNodes.push({ node, encoded: encodePlantUML(node.value) });
                }
                return;
            }

            // YouTube embed
            if (lang === "youtube" || lang === "yt") {
                const videoId = node.value.trim();
                if (!videoId) return;
                node.type = "html";
                node.value =
                    '<div class="video-wrapper">' +
                    '<iframe src="' +
                    YOUTUBE_EMBED +
                    videoId +
                    '" title="YouTube video" frameborder="0"' +
                    ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"' +
                    ' allowfullscreen loading="lazy"></iframe>' +
                    "</div>";
                return;
            }

            // Bilibili embed
            if (lang === "bilibili" || lang === "bili") {
                const videoId = node.value.trim();
                if (!videoId) return;
                node.type = "html";
                node.value =
                    '<div class="video-wrapper">' +
                    '<iframe src="' +
                    BILIBILI_EMBED +
                    "?bvid=" +
                    videoId +
                    '" title="Bilibili video" frameborder="0"' +
                    ' allowfullscreen loading="lazy"></iframe>' +
                    "</div>";
                return;
            }

            // Regular code block: apply code folding
            if (config.codeFoldingStartLines) {
                const collapse = `collapse={${config.codeFoldingStartLines}-1000000}`;
                node.meta = node.meta ? `${node.meta} ${collapse}` : collapse;
            }
        });

        // ── 异步处理：并行获取 PlantUML SVG ──
        if (plantumlNodes.length > 0) {
            const results = await Promise.all(
                plantumlNodes.map(async ({ node, encoded }) => {
                    const svg = await fetchPlantUmlSvg(encoded);
                    const isFallback = svg === null;
                    const content = isFallback ? FALLBACK_SVG : svg!;
                    node.type = "html";
                    node.value = wrapSvg(content, isFallback);
                    return { success: !isFallback };
                }),
            );

            const failedCount = results.filter((r) => !r.success).length;
            if (failedCount > 0) {
                console.warn(
                    `[remarkCodeBlocks] ${failedCount}/${plantumlNodes.length} PlantUML 图表获取失败，已使用占位 SVG`,
                );
            }
        }
    };
}
