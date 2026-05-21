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
            const encoded = Buffer.from(node.value).toString("base64");

            node.type = "reveal";
            node.data = {
                hName: "div",
                hProperties: {
                    className: ["reveal-wrapper"],
                    id: revealId,
                    "data-reveal": encoded,
                    style: "margin:1rem 0;border:1px solid var(--color-border,#e5e7eb);border-radius:8px;overflow:hidden;background:#fff",
                },
                hChildren: [],
            };
        });
    };
}
