/**
 * remark-super-sub-mark — Superscript, Subscript, Mark/Highlight
 *
 * 语法:
 *   ^上标^  → <sup>上标</sup>
 *   ~下标~  → <sub>下标</sub>
 *   ==高亮== → <mark>高亮</mark>
 */
import { visit } from "unist-util-visit";

export function remarkSuperSubMark() {
    return (tree) => {
        visit(tree, "text", (node, index, parent) => {
            if (!parent || typeof node.value !== "string") return;
            if (parent.type === "inlineCode" || parent.type === "code") return;

            const patterns = [
                [
                    /(?:^|(?<=[\s\u4e00-\u9fa5，。；：！？、""''）\)\]】>]))\^(.+?)\^(?:$|(?=[\s\u4e00-\u9fa5，。；：！？、""''（\(\[【<]))/g,
                    "sup",
                ],
                [
                    /(?:^|(?<=[\s\u4e00-\u9fa5，。；：！？、""''）\)\]】>]))~(.+?)~(?:$|(?=[\s\u4e00-\u9fa5，。；：！？、""''（\(\[【<]))/g,
                    "sub",
                ],
                [
                    /(?:^|(?<=[\s\u4e00-\u9fa5，。；：！？、""''）\)\]】>]))==(.+?)==(?:$|(?=[\s\u4e00-\u9fa5，。；：！？、""''（\(\[【<]))/g,
                    "mark",
                ],
            ];

            let text = node.value;
            let hasMatch = false;
            for (const [p] of patterns) {
                p.lastIndex = 0;
                if (p.test(text)) {
                    hasMatch = true;
                    break;
                }
            }
            if (!hasMatch) return;

            const newNodes = [];
            let remaining = text;

            while (remaining.length > 0) {
                let earliest = null;

                for (const [pattern, tag] of patterns) {
                    pattern.lastIndex = 0;
                    const m = pattern.exec(remaining);
                    if (m && (earliest === null || m.index < earliest.idx)) {
                        earliest = {
                            tag,
                            idx: m.index,
                            full: m[0],
                            inner: m[1],
                        };
                    }
                }

                if (!earliest) {
                    newNodes.push({ type: "text", value: remaining });
                    break;
                }

                if (earliest.idx > 0) {
                    newNodes.push({
                        type: "text",
                        value: remaining.slice(0, earliest.idx),
                    });
                }
                newNodes.push({
                    type: "html",
                    value: `<${earliest.tag}>${earliest.inner}</${earliest.tag}>`,
                });
                remaining = remaining.slice(
                    earliest.idx + earliest.full.length,
                );
            }

            parent.children.splice(index, 1, ...newNodes);
        });
    };
}
