import { describe, it, expect } from "vitest";
import { getLocale, getLocalePath } from "../i18n";

describe("getLocale", () => {
    it("returns 'zh' for 'zh'", () => {
        expect(getLocale("zh")).toBe("zh");
    });

    it("returns 'en' for 'en'", () => {
        expect(getLocale("en")).toBe("en");
    });

    it("returns defaultLocale for unknown locale", () => {
        expect(getLocale("fr")).toBe("zh");
    });

    it("returns defaultLocale for empty string", () => {
        expect(getLocale("")).toBe("zh");
    });
});

describe("getLocalePath", () => {
    it("returns path without prefix for default locale (zh)", () => {
        expect(getLocalePath("zh", "/blog/")).toBe("/blog/");
    });

    it("returns '/' for empty path in default locale", () => {
        expect(getLocalePath("zh")).toBe("/");
    });

    it("adds locale prefix for non-default locale (en)", () => {
        expect(getLocalePath("en", "/blog/")).toBe("/en/blog/");
    });

    it("adds locale prefix for non-default locale with empty path", () => {
        expect(getLocalePath("en")).toBe("/en/");
    });
});
