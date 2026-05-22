/**
 * remark-github-card — 将 :::github[owner/repo] 容器指令转换为
 * rehype-components 可识别的 github 组件。
 *
 * 语法:
 * :::github[owner/repo]
 * :::
 *
 * 兼容旧语法: ::github{repo="owner/repo"}
 */
import { remove } from "unist-util-remove";
import { visit } from "unist-util-visit";

export function remarkGithubCard() {
    return (tree) => {
        visit(tree, (node, index, parent) => {
            if (
                !parent ||
                index === undefined ||
                node.type !== "containerDirective" ||
                node.name !== "github"
            ) {
                return;
            }

            let repo = "";

            // Extract repo from label [owner/repo]
            remove(node, (child) => {
                if (
                    child.data &&
                    "directiveLabel" in child.data &&
                    child.data.directiveLabel
                ) {
                    if (
                        "children" in child &&
                        Array.isArray(child.children) &&
                        child.children[0] &&
                        "value" in child.children[0]
                    ) {
                        repo = child.children[0].value.trim();
                    }
                    return true;
                }
                return false;
            });

            if (!repo || !repo.includes("/")) return;

            // Create a node that rehype-components will recognize as <github>
            // with repo as a property
            const wrapper = {
                type: "paragraph",
                data: {
                    hName: "github",
                    hProperties: { repo },
                },
                children: [],
            };

            parent.children[index] = wrapper;
        });
    };
}
