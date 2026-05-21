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
            const encoded = Buffer.from(node.value).toString("base64");

            node.type = "markmap";
            node.data = {
                hName: "div",
                hProperties: {
                    className: ["markmap-container"],
                    id: mmId,
                    "data-markmap": encoded,
                    style: "height:400px",
                },
                hChildren: [],
            };
        });
    };
}
