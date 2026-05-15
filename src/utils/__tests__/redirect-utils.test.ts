import { describe, it, expect } from "vitest";
import { toUrlSafeBase64, isExternalUrl } from "../redirect-utils";

describe("toUrlSafeBase64", () => {
    it("encodes a string to URL-safe base64", () => {
        const result = toUrlSafeBase64("https://example.com");
        expect(result).not.toContain("+");
        expect(result).not.toContain("/");
        expect(result).not.toContain("=");
        expect(result.length).toBeGreaterThan(0);
    });

    it("produces consistent output for same input", () => {
        const a = toUrlSafeBase64("hello");
        const b = toUrlSafeBase64("hello");
        expect(a).toBe(b);
    });

    it("produces different output for different input", () => {
        const a = toUrlSafeBase64("hello");
        const b = toUrlSafeBase64("world");
        expect(a).not.toBe(b);
    });

    it("handles empty string", () => {
        const result = toUrlSafeBase64("");
        expect(result).toBe("");
    });
});

describe("isExternalUrl", () => {
    const host = "marxchou.com";

    it("returns false for relative paths", () => {
        expect(isExternalUrl("/blog/", host)).toBe(false);
        expect(isExternalUrl("./file", host)).toBe(false);
    });

    it("returns false for same-host URLs", () => {
        expect(isExternalUrl("https://marxchou.com/blog", host)).toBe(false);
    });

    it("returns true for different-host URLs", () => {
        expect(isExternalUrl("https://github.com", host)).toBe(true);
        expect(isExternalUrl("https://example.com/page", host)).toBe(true);
    });

    it("returns false for anchor links", () => {
        expect(isExternalUrl("#section", host)).toBe(false);
    });

    it("returns false for null", () => {
        expect(isExternalUrl(null, host)).toBe(false);
    });
});
