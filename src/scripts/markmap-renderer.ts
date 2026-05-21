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
                        "https://cdn.jsdelivr.net/npm/markmap-view@0.18";
                    s.onload = () => setTimeout(render, 100);
                    document.head.appendChild(s);
                    return;
                }
                const t = new m.Transformer();
                const { root, features } = t.transform(data);
                const { styles, scripts } = t.getUsedAssets(features);
                if (styles) m.loadCSS(styles);
                if (scripts)
                    m.loadJS(scripts, {
                        getMarkmap: () => (window as any).markmap,
                    });
                m.Markmap.create(container, {}, root);
            }

            render();
        });
}

document.addEventListener("astro:page-load", initMarkmap);
