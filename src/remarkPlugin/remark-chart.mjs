/**
 * remark-chart — 将 ```chart:type 代码块转为 Chart.js 容器
 *
 * 用法:
 * ```chart:bar
 * {"labels":["A","B","C"],"datasets":[{"label":"数据","data":[1,2,3]}]}
 * ```
 */
import { visit } from "unist-util-visit";

export function remarkChart() {
    return (tree) => {
        visit(tree, "code", (node) => {
            if (!node.lang || !node.lang.startsWith("chart")) return;

            const parts = node.lang.split(":");
            const chartType = parts[1] || "bar";
            const chartId = "chart-" + Math.random().toString(36).slice(2, 8);

            let chartData = {};
            let chartOptions = {};
            try {
                const parsed = JSON.parse(node.value);
                chartData = parsed.data || parsed;
                chartOptions = parsed.options || {};
            } catch {
                chartData = { error: "Invalid JSON" };
            }

            const config = Buffer.from(
                JSON.stringify({ type: chartType, data: chartData, options: chartOptions }),
            ).toString("base64");

            node.type = "chart";
            node.data = {
                hName: "div",
                hProperties: {
                    className: ["chart-container"],
                    id: chartId,
                    "data-chart": config,
                    style: "height:400px",
                },
                hChildren: [
                    {
                        type: "element",
                        tagName: "canvas",
                        properties: { id: chartId + "-canvas" },
                        children: [],
                    },
                ],
            };
        });
    };
}
