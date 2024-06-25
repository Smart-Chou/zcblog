import { statSync } from 'fs'
import getReadingTime from 'reading-time'
import { toString } from 'mdast-util-to-string'
import { formatDate } from '../utils/formatDate.ts'

export function remarkModifiedTime() {
  return function (tree, file) {
    const filepath = file.history[0]
    const result = statSync(filepath)
    file.data.astro.frontmatter.modifiedTime = formatDate(result.mtime)

    // 获取文章字数和阅读时长
    const textOnPage = toString(tree)
    // readingTime.text 会以友好的字符串形式给出阅读时间，例如 "3 min read"
    file.data.astro.frontmatter.readTime = getReadingTime(textOnPage)
  }
}
