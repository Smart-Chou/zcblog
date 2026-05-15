/**
 * remark-encrypted — 将 :::encrypted{password="xxx" hint="yyy"} 容器指令
 * 标记为加密容器，供 rehype 阶段的 EncryptedComponent 处理。
 *
 * 语法:
 * :::encrypted{password="secret" hint="我的生日"}
 * 要加密的 Markdown 内容...
 * :::
 */
import { h as _h } from "hastscript";
import { remove } from "unist-util-remove";
import { visit } from "unist-util-visit";

function h(el, attrs = {}, children = []) {
    const { tagName, properties } = _h(el, attrs);
    if (properties.className && Array.isArray(properties.className)) {
        properties.class = properties.className.join(" ");
        delete properties.className;
    }
    return {
        type: "paragraph",
        data: { hName: tagName, hProperties: properties },
        children,
    };
}

export function remarkEncrypted() {
    return (tree) => {
        visit(tree, (node, index, parent) => {
            if (
                !parent ||
                index === undefined ||
                node.type !== "containerDirective" ||
                node.name !== "encrypted"
            ) {
                return;
            }

            let password = "";
            let hint = "";

            // Extract attributes from directive label
            remove(node, (child) => {
                if (
                    child.data &&
                    "directiveLabel" in child.data &&
                    child.data.directiveLabel
                ) {
                    if (
                        "children" in child &&
                        Array.isArray(child.children) &&
                        "value" in child.children[0]
                    ) {
                        // Parse attributes like password="xxx" hint="yyy"
                        const raw = child.children[0].value || "";
                        const pwMatch = raw.match(/password="([^"]*)"/);
                        const hintMatch = raw.match(/hint="([^"]*)"/);
                        if (pwMatch) password = pwMatch[1];
                        if (hintMatch) hint = hintMatch[1];
                    }
                    return true;
                }
                return false;
            });

            if (!password) return;

            const wrapper = h(
                "div",
                {
                    class: `encrypted-container-wrapper`,
                    "data-password": password,
                    "data-hint": hint,
                },
                node.children,
            );

            parent.children[index] = wrapper;
        });
    };
}
