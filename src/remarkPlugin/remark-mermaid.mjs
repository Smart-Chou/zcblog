/**
 * remark-mermaid — 将 ```mermaid 代码块转为可渲染容器
 */
import { visit } from "unist-util-visit";

export function remarkMermaid() {
    return (tree) => {
        visit(tree, "code", (node) => {
            if (node.lang === "mermaid") {
                node.type = "mermaid";
                node.data = {
                    hName: "div",
                    hProperties: {
                        className: ["mermaid-container"],
                        "data-mermaid-code": node.value,
                    },
                    hChildren: [{ type: "text", value: node.value }],
                };
                node.value = undefined;
            }
        });
    };
}
