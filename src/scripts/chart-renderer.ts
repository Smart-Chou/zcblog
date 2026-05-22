/**
 * 初始化页面中的 Chart.js 图表
 */
import { b64ToUtf8 } from "~/scripts/b64-utf8";

const CHART_CDN = "https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js";

function ensureScript(src: string): Promise<void> {
    return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => resolve();
        document.head.appendChild(s);
    });
}

async function loadChart(): Promise<any> {
    const C = (window as any).Chart;
    if (!C) {
        await ensureScript(CHART_CDN);
    }
    return (window as any).Chart;
}

function initCharts() {
    document
        .querySelectorAll<HTMLDivElement>(".chart-container")
        .forEach(async (container) => {
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

            const C = await loadChart();
            new C(canvas, {
                type: config.type,
                data: config.data,
                options: config.options,
            });
        });
}

document.addEventListener("astro:page-load", initCharts);
