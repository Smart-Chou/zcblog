/**
 * remark-plantuml — 将 ```plantuml 代码块转换为内联 PlantUML SVG 图片
 * 从 remark-code-blocks 中拆分出的独立插件，仅在文章包含 plantuml 代码块时生效。
 *
 * 构建时通过 HTTP 请求 PlantUML 服务器获取 SVG，5 秒超时后降级为占位 SVG。
 */
import { visit } from "unist-util-visit";
import { deflateSync } from "node:zlib";

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

function encode64(data: any) {
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

function encodePlantUML(code: any) {
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
        '<div class="plantuml-diagram">' +
        '<div class="plantuml-wrapper">' +
        (isFallback
            ? svgContent
            : svgContent.replace(/^<\?xml[^>]*\?>/, "").trim()
        ) +
        "</div></div>"
    );
}

export function remarkPlantUML() {
    return async (tree: any) => {
        const plantumlNodes: { node: any; encoded: string }[] = [];

        // 第一遍：收集所有 plantuml 代码块（只遍历 code 节点）
        visit(tree, "code", (node) => {
            if (node.lang !== "plantuml" || !node.value || !node.value.trim()) return;
            const encoded = encodePlantUML(node.value);
            plantumlNodes.push({ node, encoded });
        });

        if (plantumlNodes.length === 0) return;

        // 并行获取所有 PlantUML SVG
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
                `[remarkPlantUML] ${failedCount}/${plantumlNodes.length} 图表获取失败，已使用占位 SVG`,
            );
        }
    };
}
