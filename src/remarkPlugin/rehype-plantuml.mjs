/**
 * rehype-plantuml — 将 div.plantuml-container 转为可交互的 PlantUML 图表
 */
import { h } from "hastscript";
import { visit } from "unist-util-visit";

const injectedTrees = new WeakSet();

export function rehypePlantuml() {
    return (tree) => {
        let found = false;

        visit(tree, "element", (node) => {
            if (node.tagName !== "div" || !node.properties) return;
            const cls = node.properties.className;
            const has = Array.isArray(cls)
                ? cls.includes("plantuml-container")
                : typeof cls === "string" &&
                  cls.split(/\s+/).includes("plantuml-container");
            if (!has) return;

            const url = node.properties["data-plantuml-url"] || "";
            if (!url) return;

            const img = h("img", {
                class: "plantuml-image",
                alt: "PlantUML diagram",
                src: url,
                loading: "lazy",
                decoding: "async",
            });

            node.properties = { class: "plantuml-diagram" };
            node.children = [h("div", { class: "plantuml-wrapper" }, [img])];
            found = true;
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
