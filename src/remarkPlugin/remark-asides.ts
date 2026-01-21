import { h as _h, s as _s } from "hastscript";
import { remove } from "unist-util-remove";
import { visit } from "unist-util-visit";

const variants = new Set([
    "note",
    "info",
    "important",
    "tip",
    "warning",
    "danger",
]);

function defaultLabel(v: string): string {
    switch (v) {
        case "info":
            return "信息";
        case "note":
            return "注意";
        case "important":
            return "重要";
        case "tip":
            return "提示";
        case "warning":
            return "警告";
        case "danger":
            return "危险";
        default:
            return "";
    }
}

interface HProps {
    [key: string]: any;
}

interface HNode {
    type: string;
    data: {
        hName: string;
        hProperties: HProps;
    };
    children: any[];
}

/** Hacky function that generates an mdast HTML tree ready for conversion to HTML by rehype. */
function h(el: string, attrs: HProps = {}, children: any[] = []): HNode {
    const { tagName, properties } = _h(el, attrs);
    return {
        type: "paragraph",
        data: { hName: tagName, hProperties: properties },
        children,
    };
}

/** Hacky function that generates an mdast SVG tree ready for conversion to HTML by rehype. */
function s(el: string, attrs: HProps = {}, children: any[] = []): HNode {
    const { tagName, properties } = _s(el, attrs);
    return {
        type: "paragraph",
        data: { hName: tagName, hProperties: properties },
        children,
    };
}

interface Options {
    label?: (variant: string) => string;
}

interface AsideIcons {
    [key: string]: any[];
}

const asideIcons: AsideIcons = {
    note: [
        s("path", {
            d: "M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z",
        }),
    ],
    info: [
        s("path", {
            d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
        }),
    ],
    important: [
        s("path", {
            d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
        }),
    ],
    tip: [
        s("path", {
            d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
        }),
    ],
    warning: [
        s("path", {
            d: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
        }),
    ],
    danger: [
        s("path", {
            d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
        }),
    ],
};

/**
 * remark plugin that converts blocks delimited with `:::` into styled
 * asides (a.k.a. “callouts”, “admonitions”, etc.). Depends on the
 * `remark-directive` module for the core parsing logic.
 *
 * For example, this Markdown
 *
 * ```md
 * :::tip[Did you know?]
 * Astro helps you build faster websites with “Islands Architecture”.
 * :::
 * ```
 *
 * will produce this output
 *
 * ```astro
 * <aside class="remark-aside remark-aside--tip" aria-label="Did you know?">
 *   <p class="remark-aside__title" aria-hidden="true">Did you know?</p>
 *   <section class="remark-aside__content">
 *     <p>Astro helps you build faster websites with “Islands Architecture”.</p>
 *   </section>
 * </Aside>
 * ```
 */
export function remarkAsides(options: Options = {}) {
    options = {
        label: defaultLabel,
        ...options,
    };
    const isAsideVariant = (s: string) => variants.has(s);

    const transformer = (tree: any) => {
        visit(tree, (node: any, index: number | undefined, parent: any) => {
            if (
                !parent ||
                index === undefined ||
                node.type !== "containerDirective"
            ) {
                return;
            }
            const variant = node.name;
            if (!isAsideVariant(variant)) return;

            // remark-directive converts a container’s “label” to a paragraph in
            // its children, but we want to pass it as the title prop to <Aside>, so
            // we iterate over the children, find a directive label, store it for the
            // title prop, and remove the paragraph from children.
            let title = options.label?.(variant) || "";

            remove(node, (child: any) => {
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
                        title = child.children[0].value;
                    }
                    return true;
                }
                return false;
            });

            const aside = h(
                "aside",
                {
                    "aria-label": variant,
                    class: `remark-aside remark-aside--${variant}`,
                },
                [
                    h(
                        "h4",
                        { class: "remark-aside__title", "aria-hidden": "true" },
                        [
                            ...(asideIcons[variant] || []),
                            { type: "text", value: title },
                        ],
                    ),
                    h("div", { class: "remark-aside__content" }, node.children),
                ],
            );

            parent.children[index] = aside;
        });
    };

    return transformer;
}
