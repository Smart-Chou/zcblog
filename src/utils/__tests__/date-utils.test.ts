import { describe, it, expect } from "vitest";
import {
    sortByPubDate,
    compareByPubDate,
    formatDateToYYYYMMDD,
    formatDateI18n,
    formatDateI18nWithTime,
} from "../date-utils";

interface PostLike {
    data: { pubDate: Date };
}

describe("sortByPubDate", () => {
    it("sorts posts by pubDate descending (newest first)", () => {
        const posts: PostLike[] = [
            { data: { pubDate: new Date("2024-01-01") } },
            { data: { pubDate: new Date("2025-06-15") } },
            { data: { pubDate: new Date("2023-03-10") } },
        ];

        const sorted = sortByPubDate(posts);
        expect(sorted[0].data.pubDate).toEqual(new Date("2025-06-15"));
        expect(sorted[1].data.pubDate).toEqual(new Date("2024-01-01"));
        expect(sorted[2].data.pubDate).toEqual(new Date("2023-03-10"));
    });

    it("does not mutate the original array", () => {
        const posts: PostLike[] = [
            { data: { pubDate: new Date("2024-01-01") } },
            { data: { pubDate: new Date("2023-01-01") } },
        ];
        const original = [...posts];
        sortByPubDate(posts);
        expect(posts).toEqual(original);
    });

    it("handles empty array", () => {
        expect(sortByPubDate([])).toEqual([]);
    });
});

describe("compareByPubDate", () => {
    it("returns negative when b is newer than a", () => {
        const a = { data: { pubDate: new Date("2023-01-01") } };
        const b = { data: { pubDate: new Date("2024-01-01") } };
        expect(compareByPubDate(a, b)).toBeGreaterThan(0);
    });

    it("returns zero for equal dates", () => {
        const a = { data: { pubDate: new Date("2024-01-01") } };
        const b = { data: { pubDate: new Date("2024-01-01") } };
        expect(compareByPubDate(a, b)).toBe(0);
    });
});

describe("formatDateToYYYYMMDD", () => {
    it("formats date to YYYY-MM-DD", () => {
        const result = formatDateToYYYYMMDD(new Date("2025-06-15"));
        expect(result).toBe("2025-06-15");
    });

    it("pads single-digit month and day", () => {
        const result = formatDateToYYYYMMDD(new Date("2025-01-05"));
        expect(result).toBe("2025-01-05");
    });
});

describe("formatDateI18n", () => {
    it("formats date with zh-CN locale", () => {
        const result = formatDateI18n(new Date("2025-06-15"));
        expect(result).toContain("2025");
        expect(result).toContain("6");
    });

    it("formats date with time when includeTime is true", () => {
        const result = formatDateI18n(new Date("2025-06-15T12:30:00"), true);
        expect(result).toContain("2025");
        expect(result).toContain("12");
        expect(result).toContain("30");
    });

    it("accepts string input", () => {
        const result = formatDateI18n("2025-06-15");
        expect(result).toContain("2025");
    });
});

describe("formatDateI18nWithTime", () => {
    it("includes time in output", () => {
        const result = formatDateI18nWithTime(new Date("2025-06-15T08:45:00"));
        expect(result).toContain("08");
        expect(result).toContain("45");
    });
});
