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
    sticky: z.number().default(0).nullable(),
    mathjax: z.boolean().default(false).nullable(),
    mermaid: z.boolean().default(false).nullable(),
    draft: z.boolean().default(false).nullable(),
    toc: z.boolean().default(true).nullable(),
    donate: z.boolean().default(true).nullable(),
    comment: z.boolean().default(true).nullable(),
  }),
})

const feedCollection = defineCollection({
  schema: z.object({
    pubDate: z.date(),
    image: z.string().optional(),
    feeling: z.string().optional(),
  }),
})

export const collections = {
  archives: postsCollection,
  feed: feedCollection,
}
