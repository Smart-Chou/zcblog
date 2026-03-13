import { marked } from "marked";
import { JSDOM } from "jsdom";

/**
 * 基于Markdown转换的摘要生成函数
 * @param markdownContent Markdown内容
 * @returns 生成的摘要
 */
export function generateSummary(markdownContent: string): string {
    const excerpt_length = 160;
    const separators = [
        "。",
        "，",
        ".",
        ",",
        "：",
        ":",
        ")",
        "）",
        "!",
        "！",
        "?",
        "？",
    ];

    try {
        // 1. 将Markdown转换为HTML
        const htmlContent = marked(markdownContent);

        // 3. 使用JSDOM解析HTML，直接处理原始HTML
        const dom = new JSDOM(`<div>${htmlContent}</div>`);
        const document = dom.window.document;

        // 清理HTML，只保留安全的标签
        const allowedTags = new Set([
            "p",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "blockquote",
            "ul",
            "ol",
            "li",
        ]);
        // 表格标签，直接移除不保留文本
        const tableTags = new Set([
            "table",
            "thead",
            "tbody",
            "tfoot",
            "tr",
            "td",
            "th",
        ]);

        // 递归清理元素
        function cleanElement(element: Element) {
            const children = Array.from(element.children);
            children.forEach((child) => {
                const tagName = child.tagName.toLowerCase();
                if (tableTags.has(tagName)) {
                    // 表格标签直接移除，不保留文本
                    child.remove();
                } else if (!allowedTags.has(tagName)) {
                    // 替换为文本内容
                    const textNode = document.createTextNode(
                        child.textContent || "",
                    );
                    child.replaceWith(textNode);
                } else {
                    // 移除所有属性
                    Array.from(child.attributes).forEach((attr) => {
                        child.removeAttribute(attr.name);
                    });
                    // 递归清理子元素
                    cleanElement(child);
                }
            });
        }

        // 移除所有表格元素，防止表格内容污染摘要
        const tableElements = document.querySelectorAll(
            "table, thead, tbody, tfoot, tr, td, th",
        );
        tableElements.forEach((el: Element) => el.remove());

        // 清理根元素
        cleanElement(document.body.firstChild as Element);

        // 4. 提取有意义的文本内容
        // 优先获取段落和标题内容
        const meaningfulElements = document.querySelectorAll(
            "p, h1, h2, h3, h4, h5, h6",
        );
        let textContent = "";

        meaningfulElements.forEach((element: Element) => {
            // 只添加非空内容
            const elementText = element.textContent?.trim() || "";
            if (elementText) {
                textContent += elementText + " ";
            }
        });

        // 如果没有找到段落或标题，使用所有文本
        if (!textContent.trim()) {
            textContent = document.body.textContent?.trim() || "";
        }

        // 5. 清理文本，移除多余空格
        const cleanedText = textContent.replace(/\s+/g, " ").trim();

        // 6. 生成摘要
        let output = "";
        let len = 0;
        let i = 0;

        // 跳过开头的空白字符
        while (i < cleanedText.length && /\s/.test(cleanedText[i])) {
            i++;
        }

        // 按照长度截取文本
        while (len < excerpt_length && i < cleanedText.length) {
            const char = cleanedText[i];
            output += char;
            // 安全地处理codePointAt可能返回undefined的情况
            const codePoint = cleanedText.codePointAt(i);
            len += codePoint && codePoint > 255 ? 2 : 1;
            i++;
        }

        // 7. 确保摘要在句子边界结束
        let output_until = output.length;
        for (i = output.length - 1; i >= 0; i--) {
            const char = output[i];
            if (char && separators.includes(char)) {
                output_until = i + 1;
                break;
            }
        }

        // 8. 生成最终摘要
        let finalExcerpt = output.substring(0, output_until).trim();
        if (finalExcerpt.length < output.length) {
            finalExcerpt += "...";
        }

        return finalExcerpt;
    } catch (error) {
        console.error("Error generating excerpt from markdown:", error);

        // 降级处理：使用简单的文本处理
        const cleanedText = markdownContent
            .replace(/```[\s\S]*?```/g, "")
            .replace(/^\|.*\|$/gm, "") // 移除表格行
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
            .replace(/[#*_`~>=]+/g, "")
            .replace(/\s+/g, " ")
            .trim();

        let output = "";
        let len = 0;
        let i = 0;

        while (len < excerpt_length && i < cleanedText.length) {
            const char = cleanedText[i];
            output += char;
            const codePoint = cleanedText.codePointAt(i);
            len += codePoint && codePoint > 255 ? 2 : 1;
            i++;
        }

        let output_until = output.length;
        for (i = output.length - 1; i >= 0; i--) {
            const char = output[i];
            if (char && separators.includes(char)) {
                output_until = i + 1;
                break;
            }
        }

        let finalExcerpt = output.substring(0, output_until).trim();
        if (finalExcerpt.length < output.length) {
            finalExcerpt += "...";
        }

        return finalExcerpt;
    }
}
