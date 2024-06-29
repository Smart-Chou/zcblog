import { statSync, readFileSync } from "fs";
import getReadingTime from "reading-time";
import { formatDate } from "./formatDate.ts";
import path from "path";

// 定义 findSecondDash 函数
function findSecondDash(text) {
    const dashPattern = /---/g;
    let match;
    let count = 0;
    while ((match = dashPattern.exec(text)) !== null) {
        count++;
        if (count === 2) {
            return match.index;
        }
    }
    return -1;
}

export function getPostsWithMeta(post) {
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
        const EXCERPT_REGEX = /([\n\r]|<\/?("[^"]*"|'[^']*'|[^>])*(>|$))/g;
        const excerpt_length = 160;

        // 获取文件内容
        const fileContent = readFileSync(filePath, "utf-8");
        const textOnPage = fileContent.replace(EXCERPT_REGEX, "");
        const readingTimeResult = getReadingTime(textOnPage);

        // 查找第二个 '---'
        const secondDashIndex = findSecondDash(textOnPage);
        let contentForExcerpt = textOnPage;
        if (secondDashIndex !== -1) {
            contentForExcerpt = textOnPage.substring(secondDashIndex + 3).trim();
        }

        const stripped = contentForExcerpt.split(" ").filter((v) => v != "").join(" ");
        const separators = ["。", "，", ".", ",", "：", ":", ")", "）"];
        let output = "";
        let len = 0,
            i = 0;
        while (len < excerpt_length && i < stripped.length) {
            output += stripped[i];
            len += stripped.codePointAt(i)! > 255 ? 2 : 1;
            i++;
        }

        let output_until = output.length;
        for (i = output.length; i > 0; i--) {
            if (separators.includes(output[i]!)) {
                output_until = i + 1;
                break;
            }
        }

        return {
            wordCount: readingTimeResult.words,
            readTime: readingTimeResult.text,
            modifiedTime: formatDate(result.mtime),
            excerpt: output.substring(0, output_until) + "...",
        };
    } catch (error) {
        // 如果文件不存在，记录详细错误信息并返回默认值
        console.error(`Error accessing file at ${filePath}:`, error.message);
        return {
            wordCount: 0,
            readTime: "N/A",
            modifiedTime: "N/A",
            excerpt: "N/A",
        };
    }
}
