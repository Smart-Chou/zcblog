import { z, defineCollection } from "astro:content";

// 定义文章集合的数据结构
const postsCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(), // 标题字段，必须为字符串
        description: z.string(), // 描述字段，必须为字符串
        pubDate: z.date(), // 发布日期字段，必须为日期类型
        tags: z.array(z.string()).optional(), // 标签字段，可选，为字符串数组
        image: z.object({
            // 图片对象字段
            url: z.string(), // 图片 URL，必须为字符串
            alt: z.string(), // 图片 alt 文本，必须为字符串
        }),
        toc: z.boolean().default(true).nullable(), // 目录开关，默认为 true，可为 null
        author: z.boolean().default(true).nullable(), // 作者信息开关，默认为 true，可为 null
        mathjax: z.boolean().default(false).nullable(), // MathJax 开关，默认为 false，可为 null
        mermaid: z.boolean().default(false).nullable(), // Mermaid 图表开关，默认为 false，可为 null
        donate: z.boolean().default(true).nullable(), // 捐赠开关，默认为 true，可为 null
        comment: z.boolean().default(true).nullable(), // 评论开关，默认为 true，可为 null
        sticky: z.number().default(0).nullable(), // 置顶级别，默认为 0，可为 null
    }),
});

// 导出文章集合定义
export const collections = {
    article: postsCollection,
};
