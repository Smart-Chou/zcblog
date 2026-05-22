/**
 * 初始化页面中的 Reveal.js 演示文稿
 */
import { b64ToUtf8 } from "~/scripts/b64-utf8";
import { ensureScript, ensureLink } from "~/scripts/ensure-script";

const REVEAL_CSS =
    "https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.min.css";
const REVEAL_THEME =
    "https://cdn.jsdelivr.net/npm/reveal.js@5/dist/theme/white.css";
const REVEAL_JS = "https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.min.js";

async function loadReveal(): Promise<any> {
    const R = (window as any).Reveal;
    if (!R) {
        ensureLink(REVEAL_CSS);
        ensureLink(REVEAL_THEME, "reveal-theme");
        await ensureScript(REVEAL_JS);
    }
    return (window as any).Reveal;
}

function initReveal() {
    document
        .querySelectorAll<HTMLDivElement>(".reveal-wrapper")
        .forEach(async (container) => {
            const encoded = container.getAttribute("data-reveal");
            if (!encoded || (container as any).__revealInit) return;
            (container as any).__revealInit = true;

            const data = b64ToUtf8(encoded);
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

            const R = await loadReveal();
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
        });
}

document.addEventListener("astro:page-load", initReveal);
