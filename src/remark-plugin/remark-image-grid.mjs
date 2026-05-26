/**
 * remark-image-grid — 图片画廊网格
 *
 * 新语法 (统一到 ::: 容器体系):
 * :::grid
 * ![描述1](url1)
 * ![描述2](url2)
 * :::
 *
 * 根据图片数量自动生成响应式网格 (1-4列)
 */
import { visit } from "unist-util-visit";

function createGridWrapper(children, imgCount) {
    const cols = Math.min(imgCount || 2, 4);
    return {
        type: "paragraph",
        data: {
            hName: "div",
            hProperties: {
                className: [
                    "image-grid",
                    "grid",
                    "grid-cols-1",
                    `md:grid-cols-${cols}`,
                    "gap-4",
                    "my-4",
                ],
            },
        },
        children,
    };
}

export function remarkImageGrid() {
    return (tree) => {
        visit(tree, (node, index, parent) => {
            if (
                !parent ||
                index === undefined ||
                node.type !== "containerDirective" ||
                node.name !== "grid"
            ) {
                return;
            }

            let imgCount = 0;
            visit(node, "image", () => {
                imgCount++;
            });

            const wrapper = createGridWrapper(node.children, imgCount);
            parent.children[index] = wrapper;
        });
    };
}
