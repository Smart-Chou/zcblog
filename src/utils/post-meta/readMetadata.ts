import { statSync, readFileSync } from "fs";
import path from "path";

/**
 * 读取文件元数据
 * @param postId 文章ID
 * @returns 文件内容和元数据
 */
export function readMetadata(postId: string) {
    if (!postId) {
        console.error("Invalid post ID");
        return {
            content: null,
            mtime: null,
        };
    }

    // 构建文件路径，考虑可能的文件扩展名
    let filePath = path.join(
        process.cwd(),
        "src",
        "content",
        "article",
        postId,
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
        } catch (err) {
            // 文件不存在，继续尝试下一个扩展名
            continue;
        }
    }

    return {
        content: fileContent,
        mtime: fileStats?.mtime || null,
    };
}

/**
 * 查找Markdown文件中的第二个分隔符位置
 * @param text Markdown内容
 * @returns 第二个分隔符的索引
 */
export function findSecondDash(text: string): number {
    const dashPattern = /^---\s*$/gm;
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
