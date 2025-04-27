export function formatPosts(
    posts: { data: { pubDate: string; isDraft: boolean } }[],
    {
        filterOutDrafts = true,
        filterOutFuturePosts = true,
        sortByDate = true,
    } = {},
) {
    const filteredPosts = posts.reduce((acc: typeof posts, post: { data: { pubDate: string; isDraft: boolean } }) => {
        const { pubDate, isDraft } = post.data;

        // filterOutDrafts if true
        if (filterOutDrafts && isDraft) {
            return acc;
        }

        // filterOutFuturePosts if true
        if (filterOutFuturePosts) {
            const currentDate = new Date();
            const postDate = new Date(pubDate);
            if (postDate > currentDate) {
                return acc;
            }
        }

        // add post to acc
        acc.push(post);

        return acc;
    }, []);

    // sortByDate or randomize
    if (sortByDate) {
        filteredPosts.sort(
            (a, b) => {
                const dateA = new Date(a.data.pubDate);
                const dateB = new Date(b.data.pubDate);
                return dateB.getTime() - dateA.getTime();
            }
        );
    } else {
        filteredPosts.sort(() => Math.random() - 0.5);
    }

    return filteredPosts;
}
