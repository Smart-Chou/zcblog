import { z } from "astro/zod";

export const pagefindConfigSchema = z.object({
    /** 自定义选择器，Pagefind 索引时忽略这些元素 */
    excludeSelectors: z.array(z.string()).default([]),
    /** 忽略检测到的语言，将整个站点作为单一语言索引，值为 ISO 639-1 代码 */
    forceLanguage: z.string().optional(),
    /** 在搜索结果路径末尾保留 index.html */
    keepIndexUrl: z.boolean().default(false),
    /** 是否输出 Pagefind playground 到 /pagefind/playground/ */
    writePlayground: z.boolean().default(false),
    /** 索引和搜索时保留这些字符 */
    includeCharacters: z.string().optional(),
    /** 发现 HTML 文件的 glob 模式 */
    glob: z.string().default("**/*.{html}"),
});

export type PagefindConfig = z.infer<typeof pagefindConfigSchema>;

export const pagefindConfig = pagefindConfigSchema.parse({
    excludeSelectors: ["nav", "footer", ".post-copyright", ".donate", ".toc", "script", "style"],
    includeCharacters: `，。！？；：""''（）【】[]`,
    glob: "article/**/*.{html}",
});
