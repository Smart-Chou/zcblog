import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const article = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/article",
    }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            pubDate: z.date(),
            tags: z.array(z.string()).optional(),
            image: z.object({
                url: z.union([image(), z.string()]),
                alt: z.string(),
            }),
            toc: z.boolean().default(true).nullable(),
            author: z.boolean().default(true).nullable(),
            mathjax: z.boolean().default(false).nullable(),
            mermaid: z.boolean().default(false).nullable(),
            donate: z.boolean().default(true).nullable(),
            waline: z.boolean().default(true).nullable(),
            sticky: z.number().default(0).nullable(),
            draft: z.boolean().default(false).optional(),
        }),
});

export const collections = { article };
