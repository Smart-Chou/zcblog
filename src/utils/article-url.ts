import type { CollectionEntry } from "astro:content";

/**
 * 文章语言 / URL 工具（双语支持）
 *
 * 约定：
 * - 英文文章：frontmatter 必填 `lang: en`；需要与中文版配对时，文件名用
 *   `<slug>-en.md`（与中文 `<slug>.md` 同目录）。
 *   ⚠️ 注意不能用 `.en.md`：Astro 内容层会把 id 中的英文句点剥离（`foo.en` → `foo…en`），
 *   导致 URL 变成 `xxxen`。连字符全链路安全。
 * - 中文文章为 `<slug>.md`（`lang` 缺省视为 zh），文件名不做任何裁剪；
 * - 翻译对 = 同 base slug、语言相反的两篇；
 * - URL：中文 `/article/<slug>/`，英文 `/en/article/<slug>/`。
 */

export type ArticleLang = "zh" | "en";

interface ArticleLike {
    id: string;
    data: { lang?: string };
}

/** 文章语言（缺省视为 zh） */
export function articleLang(entry: ArticleLike): ArticleLang {
    return entry.data.lang === "en" ? "en" : "zh";
}

/**
 * URL 用的 base slug：
 * - 英文文章：去掉文件名尾部的 `-en`（`foo-en` → `foo`；无此后缀则原样，支持独立英文文）；
 * - 中文文章：**原样**（绝不裁剪，避免误伤以 `-en` 结尾的正常中文 slug）。
 */
export function articleSlug(entry: ArticleLike): string {
    if (articleLang(entry) === "en") {
        return entry.id.replace(/-en$/, "");
    }
    return entry.id;
}

/** 文章完整 URL（按语言加前缀） */
export function articleUrl(entry: ArticleLike): string {
    const prefix = articleLang(entry) === "en" ? "/en/article" : "/article";
    return `${prefix}/${articleSlug(entry)}/`;
}

/** 按语言过滤文章 */
export function filterByLang<T extends ArticleLike>(entries: T[], lang: ArticleLang): T[] {
    return entries.filter((entry) => articleLang(entry) === lang);
}

/** 查找翻译对照（同 base slug、语言相反）；无对照返回 undefined */
export function findTranslation<T extends ArticleLike>(
    entry: ArticleLike,
    all: T[],
): T | undefined {
    const slug = articleSlug(entry);
    const lang = articleLang(entry);
    return all.find(
        (candidate) => articleSlug(candidate) === slug && articleLang(candidate) !== lang,
    );
}

/** 便捷：判断一篇集合文章是否算英文文章（供各处快速引用） */
export function isEnArticle(entry: CollectionEntry<"article">): boolean {
    return articleLang(entry) === "en";
}
