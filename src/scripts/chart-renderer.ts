/**
 * 初始化页面中的 Chart.js 图表
 */
import { b64ToUtf8 } from "~/scripts/b64-utf8";

function initCharts() {
    document
        .querySelectorAll<HTMLDivElement>(".chart-container")
        .forEach((container) => {
            const encoded = container.getAttribute("data-chart");
            if (!encoded || (container as any).__chartInit) return;
            (container as any).__chartInit = true;

            let config: { type: string; data: any; options: any };
            try {
                config = JSON.parse(b64ToUtf8(encoded));
            } catch {
                return;
            }

            const canvas = container.querySelector<HTMLCanvasElement>("canvas");
            if (!canvas) return;

            function render() {
                const C = (window as any).Chart;
                if (!C) {
                    const s = document.createElement("script");
                    s.src =
                        "https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js";
                    s.onload = render;
                    document.head.appendChild(s);
                    return;
                }
                new C(canvas, {
                    type: config.type,
                    data: config.data,
                    options: config.options,
                });
            }

            render();
        });
}

document.addEventListener("astro:page-load", initCharts);
