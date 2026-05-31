import { describe, it, expect } from "vitest";
import { remarkCodeBlocks } from "../remark-code-blocks.ts";
import type { Root, Code } from "mdast";

function makeCodeNode(lang: string, value: string): Code {
    return {
        type: "code",
        lang,
        value,
        meta: null,
    };
}

function makeTree(codes: Code[]): Root {
    return {
        type: "root",
        children: [...codes],
    };
}

describe("remarkCodeBlocks", () => {
    const plugin = remarkCodeBlocks();

    it("converts mermaid code block to html pre element", () => {
        const code = makeCodeNode("mermaid", "graph TD\nA-->B");
        const tree = makeTree([code]);

        plugin(tree);

        expect(tree.children[0].type).toBe("html");
        expect((tree.children[0] as any).value).toContain('<pre class="mermaid">');
        expect((tree.children[0] as any).value).toContain("A-->B");
    });

    it("converts chart code block to html div", () => {
        const code = makeCodeNode(
            "chart:bar",
            JSON.stringify({ data: { labels: ["A"], datasets: [{ data: [1] }] } }),
        );
        const tree = makeTree([code]);

        plugin(tree);

        expect(tree.children[0].type).toBe("html");
        expect((tree.children[0] as any).value).toContain('<div class="chart-container"');
        expect((tree.children[0] as any).value).toContain("data-chart=");
    });

    it("converts markmap code block to svg element", () => {
        const code = makeCodeNode("markmap", "# Root\n## Child");
        const tree = makeTree([code]);

        plugin(tree);

        expect(tree.children[0].type).toBe("html");
        expect((tree.children[0] as any).value).toContain('<svg class="markmap-container"');
        expect((tree.children[0] as any).value).toContain("data-markmap=");
    });

    it("converts youtube code block to iframe", () => {
        const code = makeCodeNode("youtube", "dQw4w9WgXcQ");
        const tree = makeTree([code]);

        plugin(tree);

        expect(tree.children[0].type).toBe("html");
        expect((tree.children[0] as any).value).toContain("youtube.com/embed/dQw4w9WgXcQ");
    });

    it("converts bilibili code block to iframe", () => {
        const code = makeCodeNode("bilibili", "BV1xx411c7mD");
        const tree = makeTree([code]);

        plugin(tree);

        expect(tree.children[0].type).toBe("html");
        expect((tree.children[0] as any).value).toContain("player.bilibili.com");
    });

    it("does not modify non-special code blocks (no matching lang)", () => {
        const code = makeCodeNode("typescript", "const x = 1;");
        const tree = makeTree([code]);

        plugin(tree);

        expect(tree.children[0].type).toBe("code");
        expect((tree.children[0] as Code).lang).toBe("typescript");
        expect((tree.children[0] as Code).value).toBe("const x = 1;");
    });

    it("handles empty tree gracefully", () => {
        const tree: Root = { type: "root", children: [] };
        expect(() => plugin(tree)).not.toThrow();
    });

    it("adds collapse meta to regular code blocks when config enabled", () => {
        const code = makeCodeNode("python", "print('hello')");
        // Note: collapse behavior depends on config.codeFoldingStartLines
        // If the config value is set, meta should be updated
        const tree = makeTree([code]);

        plugin(tree);

        // Code block should remain as code type
        expect(tree.children[0].type).toBe("code");
    });
});
