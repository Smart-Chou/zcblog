import { statSync, readFileSync } from 'fs';
import getReadingTime from 'reading-time';
import { formatDate } from './formatDate.ts';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getPostsWithMeta(post) {
    const files = fs.readdirSync('src/content');
    const posts = files.map((file) => {
        const filePath = path.join(process.cwd(), 'content', file);
    });
  // 使用相对路径从当前文件路径开始
  const filePath = path.resolve(__dirname, '../', '../','src', 'content', 'article', `${post.slug}.md`);

  try {
    // 检查文件是否存在
    const result = statSync(filePath);
    console.log(`File found at: ${filePath}`);

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
    // 如果文件不存在，记录错误并抛出异常
    console.error(`Error accessing file at ${filePath}:`, error.message);
    throw new Error(`File not found or inaccessible: ${filePath}`);
  }
}
