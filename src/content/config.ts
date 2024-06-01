import { z, defineCollection } from 'astro:content'
import { rssSchema } from '@astrojs/rss'

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    upDate: z.date(),
    description: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    tags: z.array(z.string()),
  }),
})

// const postsCollection = defineCollection({
//     type: 'content',
//     schema: rssSchema,
//   })

// 导出一个单独的 `collections` 对象来注册你的集合
export const collections = {
  archives: postsCollection,
}


