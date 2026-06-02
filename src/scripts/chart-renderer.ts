/**
 * 初始化页面中的 Chart.js 图表
 */
import { b64ToUtf8 } from "~/scripts/b64-utf8";
import { ensureScript } from "~/scripts/ensure-script";

const CHART_CDN = "https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js";
const CHART_INTEGRITY = "sha384-vsrfeLOOY6KuIYKDlmVH5UiBmgIdB1oEf7p01YgWHuqmOHfZr374+odEv96n9tNC";

async function loadChart(): Promise<any> {
    const C = (window as any).Chart;
    if (!C) {
        await ensureScript(CHART_CDN, CHART_INTEGRITY);
    }
    return (window as any).Chart;
}

function initCharts() {
    document.querySelectorAll<HTMLDivElement>(".chart-container").forEach(async (container) => {
        const encoded = container.getAttribute("data-chart");
        if (!encoded || (container as any).__chartInit) return;
        (container as any).__chartInit = true;

        let config: {
            type: string;
            data: Record<string, unknown>;
            options: Record<string, unknown>;
        };
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

// 确保 View Transitions 跨页面导航时只注册一次监听器
let _chartRegistered = false;
if (!_chartRegistered) {
    document.addEventListener("astro:page-load", initCharts);
    _chartRegistered = true;
}
