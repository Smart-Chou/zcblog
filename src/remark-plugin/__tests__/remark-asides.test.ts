import { describe, it, expect } from "vitest";
import { remarkAsides } from "../remark-asides.ts";

describe("remarkAsides", () => {
    // remarkAsides 返回 () => transformer，需要双重调用
    const plugin = remarkAsides({})();

    /**
     * 构建可被 unist-util-visit 正确遍历的树。
     * visit 依赖 children 数组来递归遍历节点。
     */
    function treeWithChild(name: string, textContent = "内容", label?: string) {
        const child: any = {
            type: "containerDirective",
            name,
            attributes: {},
            children: [
                {
                    type: "paragraph",
                    children: [{ type: "text", value: textContent }],
                },
            ],
        };
        if (label) {
            child.children.unshift({
                type: "paragraph",
                data: { directiveLabel: true },
                children: [{ type: "text", value: label }],
            });
        }
        return {
            type: "root",
            children: [child],
        };
    }

    it("replaces tip container with aside structure", () => {
        const tree: any = treeWithChild("tip");
        plugin(tree);
        const child = tree.children[0];
        expect(child.type).not.toBe("containerDirective");
        expect(child.data?.hName).toBe("aside");
    });

    it("replaces note container with aside structure", () => {
        const tree: any = treeWithChild("note");
        plugin(tree);
        expect(tree.children[0].data?.hName).toBe("aside");
        expect(tree.children[0].data?.hProperties?.class).toContain("remark-aside--note");
    });

    it("replaces warning container", () => {
        const tree: any = treeWithChild("warning");
        plugin(tree);
        expect(tree.children[0].data?.hProperties?.class).toContain("remark-aside--warning");
    });

    it("replaces danger container", () => {
        const tree: any = treeWithChild("danger");
        plugin(tree);
        expect(tree.children[0].data?.hProperties?.class).toContain("remark-aside--danger");
    });

    it("keeps non-aside containers unchanged", () => {
        const tree: any = treeWithChild("custom-block");
        const before = JSON.stringify(tree);
        plugin(tree);
        expect(JSON.stringify(tree)).toBe(before);
    });

    it("handles custom label in tip[text]", () => {
        const tree: any = treeWithChild("tip", "提示内容", "自定义标题");
        expect(() => plugin(tree)).not.toThrow();
        expect(tree.children[0]).toBeDefined();
    });

    it("handles empty tree", () => {
        expect(() => plugin({ type: "root", children: [] })).not.toThrow();
    });
});
