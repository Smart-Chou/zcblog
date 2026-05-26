import getReadingTime from "reading-time";

/**
 * 计算文章统计信息
 * @param content 文章内容
 * @returns 字数和阅读时间
 */
export function calculateStats(content: string) {
    if (!content) {
        return {
            wordCount: 0,
            readTime: "N/A",
        };
    }

    const readingTimeResult = getReadingTime(content);

    return {
        wordCount: readingTimeResult.words,
        readTime: readingTimeResult.text,
    };
}
