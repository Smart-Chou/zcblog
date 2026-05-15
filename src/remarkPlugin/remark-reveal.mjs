/**
 * remark-reveal — 将 ```reveal 代码块转为 Reveal.js 演示文稿容器
 *
 * 用法:
 * ```reveal
 * ## Slide 1
 * Content for slide 1
 *
 * ---
 *
 * ## Slide 2
 * Content for slide 2
 * ```
 */
import { visit } from "unist-util-visit";

export function remarkReveal() {
    return (tree) => {
        visit(tree, "code", (node) => {
            if (node.lang !== "reveal") return;

            const revealId = "reveal-" + Math.random().toString(36).slice(2, 8);

            // Split by --- (horizontal rule) to create slides
            const slides = node.value
                .split(/^---$/m)
                .map((s) => s.trim())
                .filter(Boolean);

            const slidesHtml = slides
                .map(
                    (slide) =>
                        `<section data-markdown><script type="text/template">${slide}</script></section>`,
                )
                .join("\n");

            node.type = "html";
            node.value = [
                `<div class="reveal-wrapper" style="margin:1rem 0;border:1px solid var(--color-border,#e5e7eb);border-radius:8px;overflow:hidden;background:#fff">`,
                `<div id="${revealId}" class="reveal"><div class="slides">`,
                slidesHtml,
                `</div></div></div>`,
                `<script>`,
                `(function(){var e=document.getElementById("${revealId}");if(!e)return;`,
                `function i(){var R=window.Reveal;if(!R){`,
                `var l=document.createElement("link");l.rel="stylesheet";`,
                `l.href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.min.css";`,
                `document.head.appendChild(l);`,
                `var t=document.createElement("link");t.rel="stylesheet";`,
                `t.href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/theme/white.css";`,
                `t.id="reveal-theme";document.head.appendChild(t);`,
                `var s=document.createElement("script");`,
                `s.src="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.min.js";`,
                `s.onload=i;document.head.appendChild(s);return}`,
                `var d=new R(e,{width:960,height:540,margin:0.1,transition:"slide",embedded:!0,hash:!1});`,
                `d.initialize()}`,
                `i()})();`,
                `</script>`,
            ].join("");
            node.lang = undefined;
            node.value = undefined;
        });
    };
}
