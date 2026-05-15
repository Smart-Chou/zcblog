import { describe, it, expect } from "vitest";
import { formatPosts } from "../formatPosts";

interface PostData {
    pubDate: string;
    isDraft: boolean;
}

interface Post {
    data: PostData;
}

function makePost(pubDate: string, isDraft: boolean = false): Post {
    return { data: { pubDate, isDraft } };
}

describe("formatPosts", () => {
    it("filters out draft posts by default", () => {
        const posts = [
            makePost("2025-01-01", false),
            makePost("2025-02-01", true),
            makePost("2025-03-01", false),
        ];
        const result = formatPosts(posts);
        expect(result).toHaveLength(2);
        expect(result.every((p: Post) => !p.data.isDraft)).toBe(true);
    });

    it("keeps drafts when filterOutDrafts is false", () => {
        const posts = [
            makePost("2025-01-01", false),
            makePost("2025-02-01", true),
        ];
        const result = formatPosts(posts, { filterOutDrafts: false });
        expect(result).toHaveLength(2);
    });

    it("filters out future posts by default", () => {
        const farFuture = new Date();
        farFuture.setFullYear(farFuture.getFullYear() + 10);
        const posts = [
            makePost("2020-01-01", false),
            makePost(farFuture.toISOString(), false),
        ];
        const result = formatPosts(posts);
        expect(result).toHaveLength(1);
    });

    it("keeps future posts when filterOutFuturePosts is false", () => {
        const farFuture = new Date();
        farFuture.setFullYear(farFuture.getFullYear() + 10);
        const posts = [
            makePost("2020-01-01", false),
            makePost(farFuture.toISOString(), false),
        ];
        const result = formatPosts(posts, { filterOutFuturePosts: false });
        expect(result).toHaveLength(2);
    });

    it("sorts by date descending by default", () => {
        const posts = [
            makePost("2023-01-01", false),
            makePost("2025-01-01", false),
            makePost("2024-01-01", false),
        ];
        const result = formatPosts(posts);
        expect(result[0].data.pubDate).toBe("2025-01-01");
        expect(result[1].data.pubDate).toBe("2024-01-01");
        expect(result[2].data.pubDate).toBe("2023-01-01");
    });

    it("handles empty array", () => {
        expect(formatPosts([])).toEqual([]);
    });

    it("does not mutate original array", () => {
        const posts = [makePost("2025-01-01", false)];
        const original = [...posts];
        formatPosts(posts);
        expect(posts).toEqual(original);
    });
});
