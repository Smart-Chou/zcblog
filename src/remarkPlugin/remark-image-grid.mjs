/**
 * remark-image-grid — 图片画廊网格
 *
 * 语法:
 *   [grid]
 *   ![描述1](url1)
 *   ![描述2](url2)
 *   [/grid]
 *
 * 根据图片数量自动生成响应式网格 (1-4列)
 */
import { visit } from "unist-util-visit";

export function remarkImageGrid() {
    return (tree) => {
        if (tree.type !== "root") return;

        const newChildren = [];
        let inGrid = false;
        let gridChildren = [];

        for (const node of tree.children) {
            if (
                node.type === "paragraph" &&
                node.children &&
                node.children.length > 0
            ) {
                const first = node.children[0];
                const last = node.children[node.children.length - 1];

                let isStart = false,
                    isEnd = false;

                if (
                    first.type === "text" &&
                    first.value.trim().startsWith("[grid]")
                ) {
                    isStart = true;
                    first.value = first.value.replace(/^\s*\[grid\]\s*/, "");
                }
                if (
                    last.type === "text" &&
                    last.value.trim().endsWith("[/grid]")
                ) {
                    isEnd = true;
                    last.value = last.value.replace(/\s*\[\/grid\]\s*$/, "");
                }

                // Single-paragraph grid
                if (isStart && isEnd && !inGrid) {
                    let imgCount = 0;
                    visit({ type: "root", children: [node] }, "image", () => {
                        imgCount++;
                    });
                    const cols = Math.min(imgCount || 2, 4);
                    const colClass =
                        "md:grid-cols-" +
                        (cols === 1
                            ? "1"
                            : cols === 2
                              ? "2"
                              : cols === 3
                                ? "3"
                                : "4");

                    newChildren.push({
                        type: "paragraph",
                        data: {
                            hName: "div",
                            hProperties: {
                                className: [
                                    "image-grid",
                                    "grid",
                                    "grid-cols-1",
                                    colClass,
                                    "gap-4",
                                    "my-4",
                                ],
                            },
                        },
                        children: node.children.filter(
                            (n) => n.type !== "text" || n.value.trim() !== "",
                        ),
                    });
                    continue;
                }

                // Multi-paragraph start
                if (isStart && !inGrid && !isEnd) {
                    inGrid = true;
                    if (
                        !(
                            node.children.length === 1 &&
                            first.value.trim() === ""
                        )
                    ) {
                        gridChildren.push(node);
                    }
                    continue;
                }

                // Multi-paragraph end
                if (isEnd && inGrid) {
                    inGrid = false;
                    if (
                        !(
                            node.children.length === 1 &&
                            last.value.trim() === ""
                        )
                    ) {
                        gridChildren.push(node);
                    }

                    let imgCount = 0;
                    gridChildren.forEach((c) =>
                        visit(c, "image", () => {
                            imgCount++;
                        }),
                    );
                    const cols = Math.min(imgCount || 2, 4);
                    const colClass =
                        "md:grid-cols-" +
                        (cols === 1
                            ? "1"
                            : cols === 2
                              ? "2"
                              : cols === 3
                                ? "3"
                                : "4");

                    newChildren.push({
                        type: "paragraph",
                        data: {
                            hName: "div",
                            hProperties: {
                                className: [
                                    "image-grid",
                                    "grid",
                                    "grid-cols-1",
                                    colClass,
                                    "gap-4",
                                    "my-4",
                                ],
                            },
                        },
                        children: gridChildren,
                    });
                    gridChildren = [];
                    continue;
                }
            }

            if (inGrid) {
                gridChildren.push(node);
            } else {
                newChildren.push(node);
            }
        }

        if (inGrid) newChildren.push(...gridChildren);
        tree.children = newChildren;
    };
}
