import { z } from "astro/zod";

export const pagefindConfigSchema = z.object({
    // ── 索引范围 ──
    /** 发现 HTML 文件的 glob 模式 */
    glob: z.string().default("**/*.{html}"),
    /** CSS 选择器，指定索引的根元素（v1.5.0+）。未设置时索引整个 <body> */
    rootSelector: z.string().optional(),

    // ── 内容过滤 ──
    /** 自定义选择器，Pagefind 索引时忽略这些元素 */
    excludeSelectors: z.array(z.string()).default([]),
    /** 索引和搜索时保留这些字符（不会被当作标点剥离） */
    includeCharacters: z.string().optional(),

    // ── 语言 ──
    /** 忽略检测到的语言，将整个站点作为单一语言索引，值为 ISO 639-1 代码 */
    forceLanguage: z.string().optional(),

    // ── 输出 ──
    /** 在搜索结果路径末尾保留 index.html */
    keepIndexUrl: z.boolean().default(false),
    /** 是否输出 Pagefind playground 到 /pagefind/playground/ */
    writePlayground: z.boolean().default(false),

    // ── 调试 ──
    /** 输出详细索引日志 */
    verbose: z.boolean().default(false),
    /** 索引日志写入文件路径（每次运行会覆盖） */
    logfile: z.string().optional(),
});

export type PagefindConfig = z.infer<typeof pagefindConfigSchema>;

export const pagefindConfig = pagefindConfigSchema.parse({
    excludeSelectors: ["nav", "footer", ".post-copyright", ".donate", ".toc", "script", "style"],
    includeCharacters: `，。！？；：""''（）【】[]`,
    glob: "article/**/*.{html}",
});
