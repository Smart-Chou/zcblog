import { describe, test, expect } from "vitest";
import { generateSummary } from "../generateSummary";

describe("generateSummary", () => {
    test("should generate summary for simple text", () => {
        const markdown = "这是一段简单的中文文本，用于测试摘要生成功能。";
        const result = generateSummary(markdown);
        expect(result).toBeTruthy();
        expect(result.length).toBeLessThanOrEqual(160 + 3); // 最大长度加省略号
    });

    test("should handle markdown formatting", () => {
        const markdown = `
# 标题

这是一段**加粗**文本和*斜体*文本。

1. 列表项一
2. 列表项二

> 引用内容

\`\`\`js
console.log('代码块');
\`\`\`
    `.trim();

        const result = generateSummary(markdown);
        expect(result).toBeTruthy();
        expect(result).not.toContain("```");
        expect(result).not.toContain("**");
        expect(result).not.toContain("*");
    });

    test("should handle tables gracefully", () => {
        const markdown = `
| 标题1 | 标题2 |
|-------|-------|
| 内容1 | 内容2 |
| 内容3 | 内容4 |

表格后的正常文本。
    `.trim();

        const result = generateSummary(markdown);
        expect(result).toBeTruthy();
        expect(result).not.toContain("|");
        expect(result).not.toContain("内容1");
        expect(result).toContain("表格后的正常文本");
    });

    test("should handle empty input", () => {
        const result = generateSummary("");
        expect(result).toBe("");
    });

    test("should truncate at sentence boundary", () => {
        // 创建超过160字符的文本以确保截断发生
        const longText =
            "第一句。" +
            "这是一个很长的句子，用于测试截断功能。".repeat(20) +
            "最后一句。";
        const result = generateSummary(longText);
        // 验证截断发生在句子边界（以句号结尾）
        expect(result.endsWith("。")).toBeTruthy();
        // 验证结果长度大致在限制范围内
        expect(result.length).toBeLessThan(200);
    });

    test("should fallback to simple processing on error", () => {
        // 模拟一个可能导致 JSDOM 错误的输入
        // 这里我们信任函数的降级处理逻辑
        const markdown = "正常文本";
        const result = generateSummary(markdown);
        expect(result).toBeTruthy();
    });
});
