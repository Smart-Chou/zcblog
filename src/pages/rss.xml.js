import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
  const archives = await getCollection('archives')
  return rss({
    title: 'Buzz’s Blog',
    description: 'A humble Astronaut’s guide to the stars',
    site: context.site,
    items: archives.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      image: {
        url: post.data.image.url,
        alt: post.data.image.alt,
      },
      tags: post.data.tags,
      link: `/archives/${post.slug}/`,
    })),
  })
}
