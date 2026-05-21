/**
 * 初始化页面中的 Markmap 思维导图
 */
function initMarkmap() {
    document
        .querySelectorAll<HTMLDivElement>(".markmap-container")
        .forEach((container) => {
            const encoded = container.getAttribute("data-markmap");
            if (!encoded || (container as any).__markmapInit) return;
            (container as any).__markmapInit = true;

            const data = atob(encoded);

            function render() {
                const m = (window as any).markmap;
                if (!m) {
                    const s = document.createElement("script");
                    s.src =
                        "https://cdn.jsdelivr.net/npm/markmap-autoloader@0.17";
                    s.onload = () => setTimeout(render, 200);
                    document.head.appendChild(s);
                    return;
                }
                const t = new m.Transformer();
                const x = t.transform(data);
                const a = t.getUsedAssets(x.features);
                if (a.styles) m.loadCSS(a.styles);
                if (a.scripts)
                    m.loadJS(a.scripts, {
                        getMarkmap: () => (window as any).markmap,
                    });
                m.Markmap.create(container, {}, x.root);
            }

            render();
        });
}

document.addEventListener("astro:page-load", initMarkmap);
