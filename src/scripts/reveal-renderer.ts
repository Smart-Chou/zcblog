/**
 * 初始化页面中的 Reveal.js 演示文稿
 */
function initReveal() {
    document
        .querySelectorAll<HTMLDivElement>(".reveal-wrapper")
        .forEach((container) => {
            const encoded = container.getAttribute("data-reveal");
            if (!encoded || (container as any).__revealInit) return;
            (container as any).__revealInit = true;

            const data = atob(encoded);
            const slides = data
                .split(/^---$/m)
                .map((s: string) => s.trim())
                .filter(Boolean);

            const slidesHtml = slides
                .map(
                    (slide: string) =>
                        `<section data-markdown><script type="text/template">${slide}</script></section>`,
                )
                .join("");

            container.innerHTML = [
                `<div class="reveal"><div class="slides">`,
                slidesHtml,
                `</div></div>`,
            ].join("");

            function init() {
                const R = (window as any).Reveal;
                if (!R) {
                    const l = document.createElement("link");
                    l.rel = "stylesheet";
                    l.href =
                        "https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.min.css";
                    document.head.appendChild(l);

                    const t = document.createElement("link");
                    t.rel = "stylesheet";
                    t.href =
                        "https://cdn.jsdelivr.net/npm/reveal.js@5/dist/theme/white.css";
                    t.id = "reveal-theme";
                    document.head.appendChild(t);

                    const s = document.createElement("script");
                    s.src =
                        "https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.min.js";
                    s.onload = init;
                    document.head.appendChild(s);
                    return;
                }

                const el = container.querySelector<HTMLElement>(".reveal");
                if (!el) return;
                new R(el, {
                    width: 960,
                    height: 540,
                    margin: 0.1,
                    transition: "slide",
                    embedded: true,
                    hash: false,
                }).initialize();
            }

            init();
        });
}

document.addEventListener("astro:page-load", initReveal);
