/**
 * Markmap 思维导图渲染器
 *
 * 按需从 CDN 加载依赖：d3 → markmap-lib（含 Transformer） → markmap-view（含 Markmap）
 * markmap-view 的 UMD 构建依赖 window.d3，remark 端已将容器生成为 <svg> 元素。
 */
import { b64ToUtf8 } from "~/scripts/b64-utf8";

const MARKMAP_LIB = "https://cdn.jsdelivr.net/npm/markmap-lib@0.18";
const MARKMAP_VIEW = "https://cdn.jsdelivr.net/npm/markmap-view@0.18";
const D3 = "https://cdn.jsdelivr.net/npm/d3@7";

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

async function loadDeps(): Promise<any> {
    const win = window as any;

    if (!win.d3) await ensureScript(D3);
    if (!win.markmap?.Transformer) await ensureScript(MARKMAP_LIB);
    if (!win.markmap?.Markmap) await ensureScript(MARKMAP_VIEW);

    return win.markmap;
}

async function renderOne(svg: Element) {
    const encoded = svg.getAttribute("data-markmap");
    if (!encoded) return;

    const data = b64ToUtf8(encoded);

    try {
        const m = await loadDeps();
        const t = new m.Transformer();
        const { root, features } = t.transform(data);
        const { styles, scripts } = t.getUsedAssets(features);
        if (styles) m.loadCSS(styles);
        if (scripts) m.loadJS(scripts, { getMarkmap: () => (window as any).markmap });
        m.Markmap.create(svg, {}, root);
    } catch (e) {
        console.error("Markmap render failed:", e);
    }
}

function initMarkmap() {
    document
        .querySelectorAll<SVGElement>(".markmap-container[data-markmap]")
        .forEach((svg) => {
            if ((svg as any).__markmapInit) return;
            (svg as any).__markmapInit = true;
            renderOne(svg);
        });
}

document.addEventListener("astro:page-load", initMarkmap);
