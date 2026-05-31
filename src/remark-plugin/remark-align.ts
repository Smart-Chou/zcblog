/**
 * Remark Align 插件
 *
 * 支持 `:::center` 和 `:::right` 容器指令，用于文本对齐。
 *
 * 语法:
 * ```md
 * :::center
 * 居中的内容
 * :::
 *
 * :::right
 * 右对齐的内容
 * :::
 * ```
 */
import { visit } from "unist-util-visit";

const alignVariants = new Set(["center", "right"]);

export function remarkAlign() {
    return (tree: any) => {
        visit(tree, (node, index, parent) => {
            if (
                !parent ||
                index === undefined ||
                node.type !== "containerDirective" ||
                !alignVariants.has(node.name)
            ) {
                return;
            }

            parent.children[index] = {
                type: "paragraph",
                data: {
                    hName: "div",
                    hProperties: {
                        class: `align-${node.name}`,
                    },
                },
                children: node.children,
            };
        });
    };
}
