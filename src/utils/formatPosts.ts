import { statSync } from 'fs';
import getReadingTime from 'reading-time';
import { formatDate } from './formatDate.ts';
import path from 'path';

export function getPostsWithMeta(post) {
  const filePath = path.join(process.cwd(), 'src', 'content', 'article', `${post.slug}.md`);
  const result = statSync(filePath);

  const textOnPage = post.body.toString().replace(/\n/g, '')
  const readingTimeResult = getReadingTime(textOnPage);

  return {
    wordCount: readingTimeResult.words,
    readTime: readingTimeResult.text,
    lastModified: formatDate(result.mtime),
  };
}

export function formatPosts(posts, {
    filterOutDrafts = true,
    filterOutFuturePosts = true,
    sortByDate = true,
} = {}) {

    const filteredPosts = posts.reduce((acc, post) => {
        const { pubDate, isDraft } = post.data;

        // filterOutDrafts if true
        if (filterOutDrafts && isDraft) {
            return acc;
        }

        // filterOutFuturePosts if true
        if (filterOutFuturePosts && new Date(pubDate) > new Date()) {
            return acc;
        }

        // add post to acc
        acc.push(post)

        return acc;
    }, [])

    // sortByDate or randomize
    if (sortByDate) {
        filteredPosts.sort((a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime())
    } else {
        filteredPosts.sort(() => Math.random() - 0.5)
    }

    return filteredPosts;

}

