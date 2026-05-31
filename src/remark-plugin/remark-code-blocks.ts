/**
 * remark-code-blocks — 单次 tree walk 处理常用特殊代码块 + 代码折叠
 *
 *   代码折叠: 所有常规代码块追加 collapse meta
 *   ```mermaid   → <pre class="mermaid">
 *   ```chart:*   → <div class="chart-container">
 *   ```markmap   → <div class="markmap-container">
 *   ```youtube / ```bilibili → 视频嵌入
 *
 * PlantUML 和 Reveal.js 已拆分为独立插件 (remark-plantuml / remark-reveal)，
 * 如需使用请在 astro.config.mjs 中单独引入。
 */
import { visit } from "unist-util-visit";
import { config } from "../config/index.ts";

const YOUTUBE_EMBED = "https://www.youtube.com/embed/";
const BILIBILI_EMBED = "https://player.bilibili.com/player.html";

function randomId(prefix: any) {
    return prefix + "-" + Math.random().toString(36).slice(2, 8);
}

export function remarkCodeBlocks() {
    return (tree: any) => {
        visit(tree, "code", (node: any) => {
            const lang = node.lang || "";

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
    };
}
