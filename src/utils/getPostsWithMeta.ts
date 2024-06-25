import { statSync, readFileSync } from 'fs';
import getReadingTime from 'reading-time';
import { formatDate } from './formatDate.ts';
import path from 'path';

export function getPostsWithMeta(post) {
  // 构建文件路径
  const filePath = path.join(process.cwd(), 'src', 'content', 'article', `${post.slug}.md`);
  try {
    // 检查文件是否存在
    const result = statSync(filePath);

    // 获取文件内容
    const fileContent = readFileSync(filePath, 'utf-8');
    const textOnPage = fileContent.replace(/\n/g, '');
    const readingTimeResult = getReadingTime(textOnPage);

    return {
      wordCount: readingTimeResult.words,
      readTime: readingTimeResult.text,
      lastModified: formatDate(result.mtime),
    };
  } catch (error) {
    // 如果文件不存在，记录详细错误信息并返回默认值
    console.error(`Error accessing file at ${filePath}:`, error.message);
    return {
      wordCount: 0,
      readTime: 'N/A',
      lastModified: 'N/A',
    };
  }
}
