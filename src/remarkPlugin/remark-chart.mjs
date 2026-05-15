/**
 * remark-chart — 将 ```chart:type 代码块转为 ChartComponent 容器
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
            let chartData = {};
            let chartOptions = {};

            try {
                const parsed = JSON.parse(node.value);
                if (parsed.data) {
                    chartData = parsed.data;
                    chartOptions = parsed.options || {};
                } else {
                    chartData = parsed;
                }
            } catch {
                chartData = { error: "Invalid JSON" };
            }

            const jsonData = JSON.stringify(chartData);
            const jsonOpts = JSON.stringify(chartOptions);
            const chartId = "chart-" + Math.random().toString(36).slice(2, 8);

            node.type = "html";
            node.value = [
                `<div class="chart-container" style="height:400px">`,
                `<canvas id="${chartId}"></canvas>`,
                `</div>`,
                `<script>`,
                `(function(){var c=document.getElementById("${chartId}");if(!c)return;`,
                `function r(){var C=window.Chart;if(!C){var s=document.createElement("script");`,
                `s.src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js";`,
                `s.onload=r;document.head.appendChild(s);return}`,
                `new C(c,{type:"${chartType}",data:${jsonData},options:${jsonOpts}})}`,
                `r()})();`,
                `</script>`,
            ].join("");
            node.lang = undefined;
            node.value = undefined;
        });
    };
}
