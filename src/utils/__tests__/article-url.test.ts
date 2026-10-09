import { describe, expect, it } from "vitest";
import {
    articleLang,
    articleSlug,
    articleUrl,
    filterByLang,
    findTranslation,
} from "../article-url";

const zhArticle = { id: "vps-fleet-migration", data: { lang: "zh" } };
const zhDashEn = { id: "list-of-things-en", data: { lang: "zh" } };
const enArticle = { id: "vps-fleet-migration-en", data: { lang: "en" } };
const enStandalone = { id: "my-english-post", data: { lang: "en" } };
const noLangArticle = { id: "some-post", data: {} as { lang?: string } };

describe("articleSlug", () => {
    it("英文文章去掉 -en 后缀", () => {
        expect(articleSlug(enArticle)).toBe("vps-fleet-migration");
    });

    it("英文文章无后缀时原样（独立英文文）", () => {
        expect(articleSlug(enStandalone)).toBe("my-english-post");
    });

    it("中文文章永不裁剪（即使恰以 -en 结尾）", () => {
        expect(articleSlug(zhArticle)).toBe("vps-fleet-migration");
        expect(articleSlug(zhDashEn)).toBe("list-of-things-en");
        expect(articleSlug(noLangArticle)).toBe("some-post");
    });
});

describe("articleLang", () => {
    it("缺省视为 zh", () => {
        expect(articleLang(noLangArticle)).toBe("zh");
        expect(articleLang(zhArticle)).toBe("zh");
        expect(articleLang(enArticle)).toBe("en");
    });
});

describe("articleUrl", () => {
    it("中文文章无前缀", () => {
        expect(articleUrl(zhArticle)).toBe("/article/vps-fleet-migration/");
        expect(articleUrl(zhDashEn)).toBe("/article/list-of-things-en/");
    });

    it("英文文章带 /en 前缀且去掉 -en 后缀", () => {
        expect(articleUrl(enArticle)).toBe("/en/article/vps-fleet-migration/");
        expect(articleUrl(enStandalone)).toBe("/en/article/my-english-post/");
    });
});

describe("filterByLang", () => {
    it("按语言过滤", () => {
        const all = [zhArticle, enArticle, noLangArticle];
        expect(filterByLang(all, "zh").map((p) => p.id)).toEqual([
            "vps-fleet-migration",
            "some-post",
        ]);
        expect(filterByLang(all, "en").map((p) => p.id)).toEqual(["vps-fleet-migration-en"]);
    });
});

describe("findTranslation", () => {
    it("同 base slug 异语言互为对照", () => {
        const all = [zhArticle, enArticle];
        expect(findTranslation(zhArticle, all)).toBe(enArticle);
        expect(findTranslation(enArticle, all)).toBe(zhArticle);
    });

    it("以 -en 结尾的中文 slug 可与其 -en-en 英文版配对", () => {
        const enCounterpart = { id: "list-of-things-en-en", data: { lang: "en" } };
        expect(findTranslation(zhDashEn, [zhDashEn, enCounterpart])).toBe(enCounterpart);
    });

    it("无对照返回 undefined", () => {
        expect(findTranslation(noLangArticle, [zhArticle, enArticle])).toBeUndefined();
        expect(findTranslation(zhArticle, [zhArticle])).toBeUndefined();
    });
});
