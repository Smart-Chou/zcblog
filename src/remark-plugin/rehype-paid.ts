/**
 * rehype-paid — 把 remark-paid 标记的区块渲染为：
 *   <section class="paid-block">
 *     <div class="paid-gate">购买 / 输入激活码</div>
 *     <div class="paid-body" hidden></div>
 *     <script type="application/json" data-paid-payload>密文</script>
 *   </section>
 *
 * 密钥只在 Worker 里派生；这里只把密文写进 HTML。
 */
import { toHtml } from "hast-util-to-html";
import { visit } from "unist-util-visit";
import { countPaidChars, derivePaidKey, encryptPaidContent } from "../utils/paid-crypto.js";

function childrenToHtml(nodes: any) {
    return toHtml({ type: "root", children: nodes || [] });
}

function el(tagName: string, properties: Record<string, unknown>, children: any[] = []) {
    return { type: "element", tagName, properties, children };
}

function txt(value: string) {
    return { type: "text", value };
}

function formatPrice(price: number): string {
    return Number.isInteger(price) ? String(price) : price.toFixed(2).replace(/0$/, "");
}

export function rehypePaid() {
    return (tree: any) => {
        visit(tree, "element", (node: any, index: number | undefined, parent: any) => {
            if (!parent || index === undefined) return;

            const cls = node.properties?.className ?? node.properties?.class;
            const classList = Array.isArray(cls)
                ? cls
                : typeof cls === "string"
                  ? cls.split(/\s+/)
                  : [];
            // 以 data 属性为准（不同 hast 转换路径下 class 可能是 class 或 className）
            if (!node.properties?.["data-paid-slug"] && !classList.includes("paid-container"))
                return;

            const slug = String(node.properties["data-paid-slug"] || "");
            const price = Number(node.properties["data-paid-price"] || 0);
            const product = String(node.properties["data-paid-product"] || "");
            const productName = String(node.properties["data-paid-product-name"] || "");
            const label = String(node.properties["data-paid-label"] || "付费内容");

            if (!slug) throw new Error("[rehype-paid] 缺少 slug");
            const master = process.env.PAID_MASTER_KEY || "";
            if (!master) {
                throw new Error(
                    "[rehype-paid] 文章含 :::paid，但未设置 PAID_MASTER_KEY 环境变量（本地放在 .env）",
                );
            }

            const innerHtml = childrenToHtml(node.children || []);
            const key = derivePaidKey(master, slug);
            const cipher = encryptPaidContent(innerHtml, key, slug);
            const chars = countPaidChars(innerHtml);

            const gate = el("div", { class: "paid-gate", "data-paid-gate": "" }, [
                el("div", { class: "paid-gate-top" }, [
                    el("span", { class: "paid-lock", "aria-hidden": "true" }, [txt("🔒")]),
                    el("div", {}, [
                        el("h3", { class: "paid-title toc-ignore" }, [txt(label)]),
                        el("p", { class: "paid-desc" }, [
                            txt(
                                chars > 0
                                    ? `本文剩余 ${chars} 字为付费内容，购买后可阅读全文`
                                    : "本文剩余内容为付费内容，购买后可阅读全文",
                            ),
                        ]),
                    ]),
                ]),
                el("div", { class: "paid-actions" }, [
                    el(
                        "a",
                        {
                            class: "paid-buy",
                            href: product,
                            target: "_blank",
                            rel: "noopener noreferrer",
                        },
                        [txt(`¥${formatPrice(price)} 购买解锁`)],
                    ),
                    el(
                        "button",
                        {
                            class: "paid-toggle",
                            type: "button",
                            "data-paid-toggle": "",
                        },
                        [txt("已有激活码")],
                    ),
                ]),
                el(
                    "form",
                    {
                        class: "paid-form",
                        "data-paid-form": "",
                        hidden: true,
                    },
                    [
                        el("input", {
                            class: "paid-input",
                            type: "text",
                            inputmode: "text",
                            autocomplete: "off",
                            spellcheck: "false",
                            placeholder: "输入激活码，如 Z7K4-9QMX-3TWP-8R2N",
                            "data-paid-input": "",
                        }),
                        el(
                            "button",
                            { class: "paid-submit", type: "submit", "data-paid-submit": "" },
                            [txt("解锁")],
                        ),
                    ],
                ),
                el("p", { class: "paid-msg", "data-paid-msg": "", role: "status" }, []),
                el("p", { class: "paid-note" }, [
                    txt("付款后请到爱发电私信查收激活码；一码最多 3 台设备。"),
                ]),
            ]);

            const body = el("div", { class: "paid-body", "data-paid-body": "", hidden: true }, []);
            const payload = el("script", { type: "application/json", "data-paid-payload": "" }, [
                txt(JSON.stringify({ v: 3, ct: cipher })),
            ]);

            parent.children[index] = el(
                "section",
                {
                    class: "paid-block",
                    "data-paid-root": "",
                    "data-paid-slug": slug,
                    "data-paid-product-name": productName,
                },
                [gate, body, payload],
            );
        });
    };
}
