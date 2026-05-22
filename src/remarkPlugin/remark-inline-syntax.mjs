/**
 * remark-inline-syntax — 合并 CJK 排版、剧透、上下标与高亮的单次 tree walk
 *
 *   pangu 空格 / deruntify（原 remark-pangu）
 *   ||text|| → <span class="spoiler">  （原 :spoiler[text]）
 *   ^text^ → <sup>, ~text~ → <sub>, ==text== → <mark>  （原 remark-super-sub-mark）
 */
import pangu from "pangu";
import { visit } from "unist-util-visit";

const SPOILER = /\|\|(.+?)\|\|/g;

const CJK_BOUNDARY_BEFORE = /(?:^|(?<=[\s一-龥，。；：！？、""''）\)\]】>]))/;
const CJK_BOUNDARY_AFTER = /(?:$|(?=[\s一-龥，。；：！？、""''（\(\[【<]))/;

const SUP_PATTERN = new RegExp(
    CJK_BOUNDARY_BEFORE.source + "\\^(.+?)\\^" + CJK_BOUNDARY_AFTER.source,
    "g",
);
const SUB_PATTERN = new RegExp(
    CJK_BOUNDARY_BEFORE.source + "~(.+?)~" + CJK_BOUNDARY_AFTER.source,
    "g",
);
const MARK_PATTERN = new RegExp(
    CJK_BOUNDARY_BEFORE.source + "==(.+?)==" + CJK_BOUNDARY_AFTER.source,
    "g",
);

const INLINE_PATTERNS = [
    [SPOILER, "span", "spoiler"],
    [SUP_PATTERN, "sup", null],
    [SUB_PATTERN, "sub", null],
    [MARK_PATTERN, "mark", null],
];

function hasMatch(text) {
    for (const [p] of INLINE_PATTERNS) {
        p.lastIndex = 0;
        if (p.test(text)) return true;
    }
    return false;
}

function parseInlineNodes(text) {
    const nodes = [];
    let remaining = text;

    while (remaining.length > 0) {
        let earliest = null;

        for (const [pattern, tag, cls] of INLINE_PATTERNS) {
            pattern.lastIndex = 0;
            const m = pattern.exec(remaining);
            if (m && (earliest === null || m.index < earliest.idx)) {
                earliest = { tag, cls, idx: m.index, full: m[0], inner: m[1] };
            }
        }

        if (!earliest) {
            nodes.push({ type: "text", value: remaining });
            break;
        }

        if (earliest.idx > 0) {
            nodes.push({
                type: "text",
                value: remaining.slice(0, earliest.idx),
            });
        }

        if (earliest.cls) {
            nodes.push({
                type: "html",
                value: `<span class="${earliest.cls}">${earliest.inner}</span>`,
            });
        } else {
            nodes.push({
                type: "html",
                value: `<${earliest.tag}>${earliest.inner}</${earliest.tag}>`,
            });
        }

        remaining = remaining.slice(earliest.idx + earliest.full.length);
    }

    return nodes;
}

export function remarkInlineSyntax() {
    return (tree) => {
        visit(tree, "text", (node, index, parent) => {
            if (!parent || typeof node.value !== "string") return;
            if (parent.type === "inlineCode" || parent.type === "code") return;

            // Step 1: CJK spacing + deruntify (in-place, no node splitting)
            let text = pangu.spacingText(node.value);
            if (text.split(" ").length >= 4) {
                text = text.replace(/ ([^ ]*)$/, " $1");
            }

            // Step 2: inline syntax — spoiler, ^sup^, ~sub~, ==mark==
            if (!hasMatch(text)) {
                node.value = text;
                return;
            }

            const newNodes = parseInlineNodes(text);
            parent.children.splice(index, 1, ...newNodes);
        });
    };
}
