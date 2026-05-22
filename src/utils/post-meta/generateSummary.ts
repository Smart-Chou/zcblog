/**
 * 纯文本摘要生成函数（不依赖 JSDOM/marked）
 * @param markdownContent Markdown内容
 * @returns 生成的摘要
 */
export function generateSummary(markdownContent: string): string {
    const excerptLength = 160;
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

    function truncateToExcerpt(
        text: string,
        maxLength: number,
        separators: string[],
    ): string {
        let output = "";
        let len = 0;
        let i = 0;

        while (i < text.length && /\s/.test(text[i])) {
            i++;
        }

        while (len < maxLength && i < text.length) {
            const char = text[i];
            output += char;
            const codePoint = text.codePointAt(i);
            len += codePoint && codePoint > 255 ? 2 : 1;
            i++;
        }

        let outputUntil = output.length;
        for (let j = output.length - 1; j >= 0; j--) {
            const char = output[j];
            if (char && separators.includes(char)) {
                outputUntil = j + 1;
                break;
            }
        }

        let finalExcerpt = output.substring(0, outputUntil).trim();
        if (finalExcerpt.length < output.length) {
            finalExcerpt += "...";
        }

        return finalExcerpt;
    }

    // 纯文本/正则清理，避免 JSDOM + marked 的构造开销
    const cleanedText = markdownContent
        .replace(/```[\s\S]*?```/g, "")
        .replace(/^\s*\|.*\|?\s*$/gm, "")
        .replace(/^\s*.*:[-]+.*$/gm, "")
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
        .replace(/[#*_`~>=]+/g, "")
        .replace(/\s+/g, " ")
        .trim();

    return truncateToExcerpt(cleanedText, excerptLength, separators);
}
