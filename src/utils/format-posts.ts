import { sortByPubDate } from "./date-utils";

interface FormatPostInput {
    id?: string;
    body?: string;
    data: {
        pubDate: Date | string;
        isDraft?: boolean;
        draft?: boolean;
        [key: string]: unknown;
    };
}

export function formatPosts<T extends FormatPostInput>(
    posts: T[],
    { filterOutDrafts = true, filterOutFuturePosts = true, sortByDate = true } = {},
): T[] {
    const now = filterOutFuturePosts ? Date.now() : 0;

    const filteredPosts = posts.reduce((acc: T[], post: T) => {
        const { pubDate, isDraft, draft } = post.data;

        // filterOutDrafts if true (supports both isDraft and draft field names)
        if (filterOutDrafts && (isDraft || draft)) {
            return acc;
        }

        // filterOutFuturePosts if true
        if (filterOutFuturePosts && new Date(pubDate).getTime() > now) {
            return acc;
        }

        // add post to acc
        acc.push(post);

        return acc;
    }, []);

    // sortByDate or randomize
    if (sortByDate) {
        return sortByPubDate(filteredPosts);
    } else {
        filteredPosts.sort(() => Math.random() - 0.5);
    }

    return filteredPosts;
}
