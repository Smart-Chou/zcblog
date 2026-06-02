/**
 * 初始化页面中的 Reveal.js 演示文稿
 */
import { b64ToUtf8 } from "~/scripts/b64-utf8";
import { ensureScript, ensureLink } from "~/scripts/ensure-script";

const REVEAL_CSS = "https://cdn.jsdelivr.net/npm/reveal.js@5.2.1/dist/reveal.min.css";
const REVEAL_CSS_INTEGRITY =
    "sha384-oWyxxY8CC40FK/4yBNc3yWhSVsZU6TiI3nzyiU/3ZtQdIiKsuminc3NfjMQ0kysp";
const REVEAL_THEME = "https://cdn.jsdelivr.net/npm/reveal.js@5.2.1/dist/theme/white.css";
const REVEAL_THEME_INTEGRITY =
    "sha384-flndleNngtsjA21lEvW9JpgOND8agbgm+1EI+KQFbNa0OcOWGydVQbh+G3H2E1dI";
const REVEAL_JS = "https://cdn.jsdelivr.net/npm/reveal.js@5.2.1/dist/reveal.min.js";
const REVEAL_JS_INTEGRITY =
    "sha384-wabY5HaRAmr9Hp+sfT5cYy8q4IEH8pbJUUxI0Xbntt1buEogDFE7ZxNoFvnznxBt";

async function loadReveal(): Promise<any> {
    const R = (window as any).Reveal;
    if (!R) {
        ensureLink(REVEAL_CSS, undefined, REVEAL_CSS_INTEGRITY);
        ensureLink(REVEAL_THEME, "reveal-theme", REVEAL_THEME_INTEGRITY);
        await ensureScript(REVEAL_JS, REVEAL_JS_INTEGRITY);
    }
    return (window as any).Reveal;
}

function initReveal() {
    document.querySelectorAll<HTMLDivElement>(".reveal-wrapper").forEach(async (container) => {
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

// 确保 View Transitions 跨页面导航时只注册一次监听器
let _revealRegistered = false;
if (!_revealRegistered) {
    document.addEventListener("astro:page-load", initReveal);
    _revealRegistered = true;
}
