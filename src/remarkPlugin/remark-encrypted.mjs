/**
 * remark-encrypted — 将 :::encrypted[提示] 容器指令标记为加密容器，
 * 供 rehype 阶段的 EncryptedComponent 处理。
 *
 * 新语法 (统一到 :::[] 体系):
 * :::encrypted[我的生日]
 * 要加密的 Markdown 内容...
 * :::
 *
 * 兼容旧语法:
 * :::encrypted{password="secret" hint="我的生日"}
 * 要加密的 Markdown 内容...
 * :::
 *
 * 密码优先级: 显式 {password="x"} 属性 > 站点默认密码
 */
import { h as _h } from "hastscript";
import { remove } from "unist-util-remove";
import { visit } from "unist-util-visit";

const DEFAULT_PASSWORD =
    typeof process !== "undefined" &&
    process.env?.ENCRYPTION_PASSWORD ||
    "marxchou-default";

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

            let password = null;
            let hint = "";

            // Extract label and/or attributes from directive
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
                        const raw = child.children[0].value || "";

                        // Try old-style attributes: {password="xxx" hint="yyy"}
                        const pwMatch = raw.match(/password="([^"]*)"/);
                        const hintMatch = raw.match(/hint="([^"]*)"/);

                        if (pwMatch || hintMatch) {
                            // Old syntax: parse key="val" pairs
                            if (pwMatch) password = pwMatch[1];
                            if (hintMatch) hint = hintMatch[1];
                        } else {
                            // New syntax: entire label text is the hint
                            hint = raw.trim();
                        }
                    }
                    return true;
                }
                return false;
            });

            // Fall back to default password if none provided
            if (!password) password = DEFAULT_PASSWORD;

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
