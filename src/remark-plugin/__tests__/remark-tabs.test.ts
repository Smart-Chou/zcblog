import { describe, it, expect } from "vitest";
import { remarkTabs } from "../remark-tabs.ts";

describe("remarkTabs", () => {
    const plugin = remarkTabs();

    function makeTabsContainer(children: any[]) {
        return {
            type: "root",
            children: [
                {
                    type: "containerDirective",
                    name: "tabs",
                    attributes: {},
                    children,
                },
            ],
        };
    }

    function makeParagraph(text: string) {
        return { type: "paragraph", children: [{ type: "text", value: text }] };
    }

    it("converts tabs container to tab group div", () => {
        const tree: any = makeTabsContainer([
            makeParagraph("@tab:标签一"),
            makeParagraph("标签一的内容"),
            makeParagraph("@tab:标签二"),
            makeParagraph("标签二的内容"),
        ]);

        expect(() => plugin(tree)).not.toThrow();

        const child = tree.children[0];
        expect(child.data.hName).toBe("div");
        expect(child.data.hProperties.class).toContain("tabs-container");
    });

    it("keeps non-tabs containers unchanged", () => {
        const tree: any = {
            type: "root",
            children: [
                {
                    type: "containerDirective",
                    name: "other",
                    attributes: {},
                    children: [makeParagraph("内容")],
                },
            ],
        };

        const before = JSON.stringify(tree);
        plugin(tree);
        expect(JSON.stringify(tree)).toBe(before);
    });

    it("handles empty tree", () => {
        const tree: any = { type: "root", children: [] };
        expect(() => plugin(tree)).not.toThrow();
    });

    it("handles empty tabs container gracefully", () => {
        const tree: any = makeTabsContainer([]);
        expect(() => plugin(tree)).not.toThrow();
    });
});
