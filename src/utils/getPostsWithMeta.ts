import { statSync, readFileSync } from "fs";
import getReadingTime from "reading-time";
import path from "path";
import { marked } from "marked";
import { JSDOM } from "jsdom";

// 定义文章类型接口，匹配Astro内容集合的结构
interface Post {
    id: string;
    slug: string;
    collection: string;
    data: Record<string, any>;
    body: string;
    [key: string]: any;
}

// 定义返回结果接口
interface PostMeta {
    wordCount: number;
    readTime: string;
    modifiedTime: Date | string;
    excerpt: string;
}

// 定义 findSecondDash 函数
function findSecondDash(text: string): number {
    const dashPattern = /---/g;
    let match: RegExpExecArray | null;
    let count = 0;
    while ((match = dashPattern.exec(text)) !== null) {
        count++;
        if (count === 2) {
            return match.index;
        }
    }
    return -1;
}

// 基于Markdown转换的摘要生成函数
function generateExcerptFromMarkdown(markdownContent: string): string {
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

        // 递归清理元素
        function cleanElement(element: Element) {
            const children = Array.from(element.children);
            children.forEach((child) => {
                if (!allowedTags.has(child.tagName.toLowerCase())) {
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

// 缓存对象，用于存储已处理的文章元数据
const postMetaCache = new Map<string, PostMeta>();

export function getPostsWithMeta(post: Post): PostMeta {
    // 检查缓存
    if (postMetaCache.has(post.id)) {
        return postMetaCache.get(post.id)!;
    }

    // 构建文件路径，确保文件路径有效
    if (!post.id) {
        console.error("Invalid post ID");
        return {
            wordCount: 0,
            readTime: "N/A",
            modifiedTime: "N/A",
            excerpt: "N/A",
        };
    }

    // 构建文件路径，考虑可能的文件扩展名
    let filePath = path.join(
        process.cwd(),
        "src",
        "content",
        "article",
        post.id,
    );

    // 尝试不同的文件扩展名
    const extensions = [".md", ".mdx", ""];
    let fileContent: string | null = null;
    let fileStats: any = null;

    for (const ext of extensions) {
        const tryPath = filePath + ext;
        try {
            fileStats = statSync(tryPath);
            fileContent = readFileSync(tryPath, "utf-8");
            filePath = tryPath; // 更新为找到的正确路径
            break;
        } catch {
            // 文件不存在，继续尝试下一个扩展名
            continue;
        }
    }

    if (!fileContent || !fileStats) {
        console.error(`Error accessing file at ${filePath}`);
        return {
            wordCount: 0,
            readTime: "N/A",
            modifiedTime: "N/A",
            excerpt: "N/A",
        };
    }

    // 计算阅读时间
    const readingTimeResult = getReadingTime(fileContent);

    // 查找第二个 '---'
    const secondDashIndex = findSecondDash(fileContent);
    let contentForExcerpt = fileContent;
    if (secondDashIndex !== -1) {
        contentForExcerpt = fileContent.substring(secondDashIndex + 3).trim();
    }

    // 生成摘要
    const excerpt = generateExcerptFromMarkdown(contentForExcerpt);

    // 构建结果对象
    const result: PostMeta = {
        wordCount: readingTimeResult.words,
        readTime: readingTimeResult.text,
        modifiedTime: fileStats.mtime,
        excerpt: excerpt,
    };

    // 存储到缓存
    postMetaCache.set(post.id, result);

    return result;
}
