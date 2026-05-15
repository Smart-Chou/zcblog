import { describe, it, expect } from "vitest";
import { encryptContent } from "../encrypt";

describe("encryptContent", () => {
    it("returns a base64 string", () => {
        const result = encryptContent("<p>hello</p>", "mypassword", "my-slug");
        expect(typeof result).toBe("string");
        expect(() => Buffer.from(result, "base64")).not.toThrow();
    });

    it("produces different output for different passwords", () => {
        const a = encryptContent("<p>hello</p>", "password1", "my-slug");
        const b = encryptContent("<p>hello</p>", "password2", "my-slug");
        expect(a).not.toBe(b);
    });

    it("produces different output for different slugs", () => {
        const a = encryptContent("<p>hello</p>", "password", "slug-a");
        const b = encryptContent("<p>hello</p>", "password", "slug-b");
        expect(a).not.toBe(b);
    });

    it("produces consistent output for same inputs", () => {
        const a = encryptContent("<p>hello</p>", "password", "my-slug");
        const b = encryptContent("<p>hello</p>", "password", "my-slug");
        expect(a).toBe(b);
    });

    it("handles empty content", () => {
        const result = encryptContent("", "password", "slug");
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);
    });
});
