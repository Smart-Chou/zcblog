export function formatPosts(
    posts: { data: { pubDate: string; isDraft: boolean } }[],
    {
        filterOutDrafts = true,
        filterOutFuturePosts = true,
        sortByDate = true,
    } = {},
) {
    const now = filterOutFuturePosts ? Date.now() : 0;

    const filteredPosts = posts.reduce(
        (
            acc: typeof posts,
            post: { data: { pubDate: string; isDraft: boolean } },
        ) => {
            const { pubDate, isDraft } = post.data;

            // filterOutDrafts if true
            if (filterOutDrafts && isDraft) {
                return acc;
            }

            // filterOutFuturePosts if true
            if (filterOutFuturePosts && new Date(pubDate).getTime() > now) {
                return acc;
            }

            // add post to acc
            acc.push(post);

            return acc;
        },
        [],
    );

    // sortByDate or randomize
    if (sortByDate) {
        filteredPosts.sort((a, b) => {
            const dateA = new Date(a.data.pubDate).getTime();
            const dateB = new Date(b.data.pubDate).getTime();
            return dateB - dateA;
        });
    } else {
        filteredPosts.sort(() => Math.random() - 0.5);
    }

    return filteredPosts;
}
