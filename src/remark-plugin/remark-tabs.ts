/**
 * Remark Tabs 插件
 *
 * 将 `:::tabs` 容器转换为可交互的标签页组件。
 *
 * 语法:
 * ```md
 * :::tabs
 * @tab:标签一
 * 标签一的内容
 *
 * @tab:标签二
 * 标签二的内容
 * :::
 * ```
 */
import { h as _h } from "hastscript";
import { visit } from "unist-util-visit";

function h(el: any, attrs: any = {}, children: any[] = []) {
    const { tagName, properties }: any = _h(el, attrs);
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

function splitByTabs(children: any) {
    const tabs = [];
    let currentTitle = "";
    let currentChildren = [];
    let hasAnyTab = false;

    for (const child of children) {
        const tabMarker = extractTabMarker(child);
        if (tabMarker !== null) {
            hasAnyTab = true;
            if (currentTitle || currentChildren.length > 0) {
                tabs.push({
                    title: currentTitle || `Tab ${tabs.length + 1}`,
                    children: currentChildren,
                });
            }
            currentTitle = tabMarker;
            currentChildren = [];
        } else {
            currentChildren.push(child);
        }
    }

    if (!hasAnyTab) return null;

    tabs.push({
        title: currentTitle || `Tab ${tabs.length + 1}`,
        children: currentChildren,
    });

    return tabs;
}

function extractTabMarker(node: any) {
    if (node.type === "paragraph" && node.children) {
        for (const child of node.children) {
            if (child.type === "text") {
                const text = child.value || "";
                const match = text.match(/^@tab:(.+)/);
                if (match) return match[1].trim();
            }
        }
    }
    return null;
}

function isConsumedTabMarker(node: any) {
    if (node.type !== "paragraph" || !node.children || node.children.length !== 1) {
        return false;
    }
    const child = node.children[0];
    if (child.type === "text" && child.value.trim().match(/^@tab:.+/)) {
        return true;
    }
    return false;
}

let tabCounter = 0;

export function remarkTabs() {
    return (tree: any) => {
        visit(tree, "containerDirective", (node, index, parent) => {
            if (!parent || index === undefined || node.name !== "tabs") return;

            const tabs = splitByTabs(node.children);
            if (!tabs || tabs.length === 0) return;

            tabCounter++;
            const tabId = `tabs-${tabCounter}`;

            const navButtons = tabs.map((tab, i) => {
                const isActive = i === 0;
                return h(
                    "button",
                    {
                        class: `tabs-nav-btn${isActive ? " active" : ""}`,
                        "data-tabs-target": tabId,
                        "data-tabs-index": String(i),
                        type: "button",
                        role: "tab",
                        "aria-selected": isActive ? "true" : "false",
                        "aria-controls": `${tabId}-panel-${i}`,
                    },
                    [{ type: "text", value: tab.title }],
                );
            });

            const panels = tabs.map((tab, i) => {
                const isActive = i === 0;
                const filtered = tab.children.filter((child) => !isConsumedTabMarker(child));
                return h(
                    "div",
                    {
                        class: `tabs-panel${isActive ? " active" : ""}`,
                        id: `${tabId}-panel-${i}`,
                        role: "tabpanel",
                        hidden: isActive ? undefined : "true",
                    },
                    filtered,
                );
            });

            parent.children[index] = h("div", { class: "tabs-container", "data-tabs-id": tabId }, [
                h("div", { class: "tabs-nav", role: "tablist" }, navButtons),
                h("div", { class: "tabs-panels" }, panels),
            ]);
        });
    };
}
