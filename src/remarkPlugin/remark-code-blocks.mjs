/**
 * remark-code-blocks — 单次 tree walk 处理所有特殊代码块 + 代码折叠
 *
 *   代码折叠: 所有常规代码块追加 collapse meta（原 resetRemark）
 *   ```mermaid   → <pre class="mermaid">          （原 resetRemark）
 *   ```plantuml  → <div class="plantuml-diagram">  （原 remark-plantuml）
 *   ```chart:*   → <div class="chart-container">   （原 remark-chart）
 *   ```markmap   → <div class="markmap-container"> （原 remark-markmap）
 *   ```reveal    → <div class="reveal-wrapper">    （原 remark-reveal）
 *
 * 统一输出 type: "html"，不再使用自定义 node type。
 */
import { visit } from "unist-util-visit";
import { deflateSync } from "node:zlib";
import { config } from "../config/index.ts";

const PLANTUML_SERVER = "https://www.plantuml.com/plantuml";
const YOUTUBE_EMBED = "https://www.youtube.com/embed/";
const BILIBILI_EMBED = "https://player.bilibili.com/player.html";

function encode64(data) {
    const chars =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
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

function encodePlantUML(code) {
    const deflated = deflateSync(Buffer.from(code, "utf-8"), { level: 9 });
    return encode64(deflated);
}

function randomId(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 8);
}

export function remarkCodeBlocks() {
    return (tree) => {
        visit(tree, "code", (node) => {
            const lang = node.lang || "";

            // Mermaid
            if (lang === "mermaid") {
                node.type = "html";
                node.value =
                    '<pre class="mermaid">\n' + node.value + "\n</pre>";
                return;
            }

            // PlantUML
            if (lang === "plantuml" && node.value && node.value.trim()) {
                const encoded = encodePlantUML(node.value);
                const src = PLANTUML_SERVER + "/svg/~1" + encoded;
                node.type = "html";
                node.value =
                    '<div class="plantuml-diagram"><div class="plantuml-wrapper">' +
                    '<img class="plantuml-image" src="' +
                    src +
                    '" alt="PlantUML diagram" loading="lazy" decoding="async" ' +
                    "onerror=\"this.style.display='none';var p=this.parentElement;if(p)p.innerHTML='<span class=&quot;text-sm text-gray-400&quot;>PlantUML 图表加载失败</span>'" +
                    '" /></div></div>';
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
