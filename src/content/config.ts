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
    comment: z.boolean().default(true).nullable(),
    sticky: z.number().default(0).nullable(),
  }),
})

export const collections = {
  archives: postsCollection,
}
