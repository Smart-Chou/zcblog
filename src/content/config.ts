import { z, defineCollection } from 'astro:content'

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).optional(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    toc: z.boolean().default(true).nullable(),
    author: z.boolean().default(true).nullable(),
    mathjax: z.boolean().default(false).nullable(),
    mermaid: z.boolean().default(false).nullable(),
    donate: z.boolean().default(true).nullable(),
    comment: z.boolean().default(true).nullable(),
    sticky: z.number().default(0).nullable(),
  }),
})

export const collections = {
  article: postsCollection,
}
