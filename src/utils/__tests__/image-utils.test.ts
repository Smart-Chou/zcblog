import { describe, it, expect } from "vitest";
import { buildTransformUrl, getPicImageUrl, PLACEHOLDER_IMAGE } from "../image-utils";

describe("buildTransformUrl", () => {
    const base = "https://example.com";

    it("wraps http(s) URLs with the given width", () => {
        const out = buildTransformUrl("https://img.example.com/a.png", 480, base);
        expect(out).toBe(
            "https://example.com/cdn-cgi/image/width=480,fit=scale-down,format=auto/https://img.example.com/a.png",
        );
    });

    it("includes quality option when provided", () => {
        expect(buildTransformUrl("https://img.example.com/a.png", 800, base, 78)).toContain(
            "width=800,fit=scale-down,format=auto,quality=78",
        );
    });

    it("returns non-http paths untouched", () => {
        expect(buildTransformUrl("/cover.png", 480, base)).toBe("/cover.png");
        expect(buildTransformUrl("", 480, base)).toBe("");
    });

    it("does not double-wrap transformed URLs", () => {
        const once = buildTransformUrl("https://img.example.com/a.png", 480, base);
        expect(buildTransformUrl(once, 640, base)).toBe(once);
    });

    it("tolerates a trailing slash in the base URL", () => {
        expect(buildTransformUrl("https://img.example.com/a.png", 480, `${base}/`)).toContain(
            "https://example.com/cdn-cgi/image/",
        );
    });
});

describe("getPicImageUrl", () => {
    it("keeps the placeholder for an empty path", () => {
        expect(getPicImageUrl("")).toBe(PLACEHOLDER_IMAGE);
    });

    it("joins relative paths onto the image service base", () => {
        expect(getPicImageUrl("/x/y.png")).toContain("/api/pic/x/y.png");
    });
});
