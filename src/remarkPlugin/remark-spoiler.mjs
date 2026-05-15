/**
 * remark-spoiler — 将 :spoiler[文本] 语法转换为剧透标签
 *
 * 语法: 这是一段话 :spoiler[被隐藏的内容] 继续说。
 * 输出: <span class="spoiler">被隐藏的内容</span>
 */
import { visit } from "unist-util-visit";

export function remarkSpoiler() {
    return (tree) => {
        visit(tree, "text", (node, index, parent) => {
            if (!parent || typeof node.value !== "string") return;

            const pattern = /:spoiler\[([^\]]+)\]/g;
            pattern.lastIndex = 0;
            if (!pattern.test(node.value)) return;

            pattern.lastIndex = 0;
            const newNodes = [];
            let lastIdx = 0;

            let match;
            while ((match = pattern.exec(node.value)) !== null) {
                if (match.index > lastIdx) {
                    newNodes.push({
                        type: "text",
                        value: node.value.slice(lastIdx, match.index),
                    });
                }
                newNodes.push({
                    type: "html",
                    value: `<span class="spoiler">${match[1]}</span>`,
                });
                lastIdx = match.index + match[0].length;
            }
            if (lastIdx < node.value.length) {
                newNodes.push({
                    type: "text",
                    value: node.value.slice(lastIdx),
                });
            }

            parent.children.splice(index, 1, ...newNodes);
        });
    };
}
