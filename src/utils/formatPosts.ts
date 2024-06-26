export function formatPosts(
    posts,
    {
        filterOutDrafts = true,
        filterOutFuturePosts = true,
        sortByDate = true,
    } = {},
) {
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
        acc.push(post);

        return acc;
    }, []);

    // sortByDate or randomize
    if (sortByDate) {
        filteredPosts.sort(
            (a, b) =>
                new Date(b.data.pubDate).getTime() -
                new Date(a.data.pubDate).getTime(),
        );
    } else {
        filteredPosts.sort(() => Math.random() - 0.5);
    }

    return filteredPosts;
}
