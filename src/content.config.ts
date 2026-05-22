import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { imageService } from "~/config"

const article = defineCollection({
    loader: glob({
        pattern: "**/*.{md,mdx}",
        base: "./src/content/article",
    }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string().nullable().optional(),
            summary: z.string().nullable().optional(),
            pubDate: z.date(),
            update: z.date().nullable().optional(),
            tags: z.array(z.string()).optional(),
            image: z.object({
                url: z.preprocess(
                    (val) => (val === "" ? undefined : val),
                    z.union([image(), z.string()]).default(`${imageService.baseUrl}${imageService.randomPath}`)
                ),
                alt: z.preprocess(
                    (val) => (val === "" ? undefined : val),
                    z.string().default("Occupying Picture Alt")
                ),
            }).optional(),
            sticky: z.number().default(0).nullable(),
            draft: z.boolean().default(false).optional(),
            toc: z.boolean().default(true).nullable(),
            waline: z.boolean().default(true).nullable(),
            donate: z.boolean().default(true).nullable(),
            author: z.boolean().default(true).nullable(),
            mathjax: z.boolean().default(false).nullable(),
            mermaid: z.boolean().default(false).nullable(),
            plantuml: z.boolean().default(false).nullable(),
            katex: z.boolean().default(false).nullable(),
            chart: z.boolean().default(false).nullable(),
            markmap: z.boolean().default(false).nullable(),
        }),
});

const pages = defineCollection({
    loader: glob({
        pattern: "**/*.{md,mdx}",
        base: "./src/content/pages",
    }),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
    }),
});

export const collections = { article, pages };
