/**
 * remark-reveal — 将 ```reveal 代码块转换为 Reveal.js 演示容器
 * 从 remark-code-blocks 中拆分出的独立插件，仅在文章包含 reveal 代码块时生效。
 */
import { visit } from "unist-util-visit";

function randomId(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 8);
}

export function remarkReveal() {
    return (tree) => {
        visit(tree, "code", (node) => {
            if (node.lang !== "reveal") return;

            const revealId = randomId("reveal");
            const encoded = Buffer.from(node.value).toString("base64");
            node.type = "html";
            node.value =
                '<div class="reveal-wrapper" id="' +
                revealId +
                '" data-reveal="' +
                encoded +
                '" style="margin:1rem 0;border:1px solid var(--color-border,#e5e7eb);border-radius:8px;overflow:hidden;background:#fff"></div>';
        });
    };
}
