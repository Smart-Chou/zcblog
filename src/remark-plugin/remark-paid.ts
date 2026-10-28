/**
 * remark-paid — 把 :::paid 容器标记为待加密区块。
 *
 * 用法：
 *   :::paid
 *   付费正文……
 *   :::
 *
 * 价格/商品链接来自 frontmatter：
 *   paid:
 *     price: 19.9
 *     productUrl: https://afdian.com/item/xxxx
 *
 * 这里只做标记，真正的加密在 rehype-paid（需要拿到渲染后的 HTML）。
 */
import { remove } from "unist-util-remove";
import { visit } from "unist-util-visit";
import { fileURLToPath } from "node:url";

function wrapper(attrs: Record<string, unknown>, children: any[]) {
    return {
        type: "paragraph",
        data: {
            hName: "div",
            hProperties: { className: ["paid-container"], ...attrs },
        },
        children,
    };
}

/** 从 vfile.path（content collection 的文件 URL/路径）推导 slug */
export function slugFromFile(file: any): string {
    const raw = file?.path || (Array.isArray(file?.history) ? file.history[0] : "");
    if (typeof raw !== "string" || !raw) return "";
    let pathname = raw;
    if (raw.startsWith("file:")) {
        try {
            pathname = fileURLToPath(raw);
        } catch {
            pathname = raw;
        }
    }
    const base = pathname.split(/[\\/]/).pop() || "";
    return base.replace(/\.(md|mdx)$/i, "");
}

export function remarkPaid() {
    return (tree: any, file: any) => {
        const frontmatter = file?.data?.astro?.frontmatter ?? {};
        const paid = frontmatter?.paid;

        visit(tree, (node: any, index: number | undefined, parent: any) => {
            if (!parent || index === undefined) return;
            if (node.type !== "containerDirective" || node.name !== "paid") return;

            if (!paid || typeof paid !== "object") {
                throw new Error(
                    "[remark-paid] 文章包含 :::paid，但 frontmatter 缺少 paid.price / paid.productUrl",
                );
            }
            if (typeof paid.price !== "number" || !Number.isFinite(paid.price) || paid.price <= 0) {
                throw new Error("[remark-paid] frontmatter.paid.price 必须是正数");
            }
            if (typeof paid.productUrl !== "string" || !/^https?:\/\//.test(paid.productUrl)) {
                throw new Error("[remark-paid] frontmatter.paid.productUrl 必须是 http(s) 链接");
            }

            let label = "";
            remove(node, (child: any) => {
                if (child.data && "directiveLabel" in child.data && child.data.directiveLabel) {
                    const first = child.children?.[0];
                    if (first && typeof first.value === "string") label = first.value.trim();
                    return true;
                }
                return false;
            });

            const slug = String(paid.slug || slugFromFile(file) || "").trim();
            if (!slug) {
                throw new Error(
                    "[remark-paid] 无法从文件名推导 slug，请在 frontmatter 设置 paid.slug",
                );
            }

            parent.children[index] = wrapper(
                {
                    "data-paid-slug": slug,
                    "data-paid-price": paid.price,
                    "data-paid-product": paid.productUrl,
                    "data-paid-product-name": paid.productName || "",
                    "data-paid-label": label || "付费内容",
                },
                node.children,
            );
        });
    };
}
