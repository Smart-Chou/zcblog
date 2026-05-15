/**
 * remark-markmap — 将 ```markmap 代码块转为 Markmap 思维导图容器
 *
 * 用法:
 * ```markmap
 * ## Root
 * - Item 1
 *   - Sub item 1.1
 * - Item 2
 * ```
 */
import { visit } from "unist-util-visit";

export function remarkMarkmap() {
    return (tree) => {
        visit(tree, "code", (node) => {
            if (node.lang !== "markmap") return;

            const mmId = "markmap-" + Math.random().toString(36).slice(2, 8);
            const escaped = node.value
                .replace(/\\/g, "\\\\")
                .replace(/`/g, "\\`")
                .replace(/\$/g, "\\$");

            node.type = "html";
            node.value = [
                `<div class="markmap-container" id="${mmId}" style="height:400px"></div>`,
                `<script>`,
                `(function(){var c=document.getElementById("${mmId}");if(!c)return;`,
                `function r(){var m=window.markmap;if(!m){var s=document.createElement("script");`,
                `s.src="https://cdn.jsdelivr.net/npm/markmap-autoloader@0.17";`,
                `s.onload=function(){setTimeout(r,200)};document.head.appendChild(s);return}`,
                `var t=new m.Transformer;var x=t.transform(\`${escaped}\`);`,
                `var a=t.getUsedAssets(x.features);`,
                `if(a.styles)m.loadCSS(a.styles);if(a.scripts)m.loadJS(a.scripts,{getMarkmap:function(){return window.markmap}});`,
                `m.Markmap.create(c,{},x.root)}`,
                `r()})();`,
                `</script>`,
            ].join("");
            node.lang = undefined;
            node.value = undefined;
        });
    };
}
