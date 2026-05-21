/**
 * rehype-plantuml — 为 PlantUML 图表注入错误处理脚本
 */
import { h } from "hastscript";
import { visit } from "unist-util-visit";

const injectedTrees = new WeakSet();

export function rehypePlantuml() {
    return (tree) => {
        let found = false;

        visit(tree, "element", (node) => {
            if (node.tagName !== "img" || !node.properties) return;
            const cls =
                node.properties.className || node.properties.class;
            const has = Array.isArray(cls)
                ? cls.includes("plantuml-image")
                : typeof cls === "string" &&
                  cls.split(/\s+/).includes("plantuml-image");
            if (has) found = true;
        });

        if (found && !injectedTrees.has(tree)) {
            injectedTrees.add(tree);
            tree.children = [
                ...(tree.children || []),
                h(
                    "script",
                    { type: "text/javascript" },
                    `
        (function(){document.querySelectorAll('.plantuml-image').forEach(function(img){img.onerror=function(){this.style.display='none';var p=this.parentElement;if(p)p.innerHTML='<span class=\\\"text-sm text-gray-400\\\">PlantUML 图表加载失败</span>'}})})();
      `,
                ),
            ];
        }
    };
}
