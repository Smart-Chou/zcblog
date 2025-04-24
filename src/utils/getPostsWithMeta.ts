import { statSync, readFileSync } from "fs";
import getReadingTime from "reading-time";
import path from "path";

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

export function getPostsWithMeta(post: Post): PostMeta {
    // 构建文件路径
    const filePath = path.join(
        process.cwd(),
        "src",
        "content",
        "article",
        post.id,
    );
    try {
        // 检查文件是否存在
        const result = statSync(filePath);
        // 优化正则表达式，提高可读性和性能
        const EXCERPT_REGEX = /([~]|[>]|:::[^\s]+|(?:\[[^\]]+\]\([^\)]+\))|:::|[\*\*])|(```[\s\S]*?```)|(\=\=)/g;
        const excerpt_length = 160;

        // 获取文件内容
        const fileContent = readFileSync(filePath, "utf-8");
        const textOnPage = fileContent.replace(EXCERPT_REGEX, "");
        const readingTimeResult = getReadingTime(textOnPage);

        // 查找第二个 '---'
        const secondDashIndex = findSecondDash(textOnPage);
        let contentForExcerpt = textOnPage;
        if (secondDashIndex !== -1) {
            contentForExcerpt = textOnPage
                .substring(secondDashIndex + 3)
                .trim();
        }

        const stripped = contentForExcerpt
            .split(" ")
            .filter((v) => v != "")
            .join(" ");
        const separators = ["。", "，", ".", ",", "：", ":", ")", "）"];
        let output = "";
        let len = 0,
            i = 0;
        while (len < excerpt_length && i < stripped.length) {
            output += stripped[i];
            // 安全地处理codePointAt可能返回undefined的情况
            const codePoint = stripped.codePointAt(i);
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

        return {
            wordCount: readingTimeResult.words,
            readTime: readingTimeResult.text,
            modifiedTime: result.mtime,
            excerpt: output.substring(0, output_until) + "...",
        };
    } catch (error: unknown) {
        // 如果文件不存在，记录详细错误信息并返回默认值
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error accessing file at ${filePath}:`, errorMessage);
        return {
            wordCount: 0,
            readTime: "N/A",
            modifiedTime: "N/A",
            excerpt: "N/A",
        };
    }
}
