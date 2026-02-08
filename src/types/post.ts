import type { CollectionEntry } from "astro:content";

// 定义文章元数据类型
export type PostMetadata = {
    title: string;
    date: string;
    tags: string[];
    draft?: boolean;
    description?: string;
    cover?: string;
};

// 文章类型
export type Post = CollectionEntry<"article"> & {
    data: PostMetadata;
};

// 工具函数类型约束
export function formatDate(dateStr: string): string {
    if (!dateStr) return ""; // 容错处理
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return ""; // 无效日期容错
        return date.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch (e) {
        console.error("日期格式化失败：", e);
        return "";
    }
}
