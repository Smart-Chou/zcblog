import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { site } from '~/self.config'

const siteTitle = site.title
const siteDescription = site.description

export async function GET(context) {
  const archives = await getCollection('archives')
  return rss({
    title: siteTitle,
    description: siteDescription,
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
    stylesheet: '/assets/rss/styles.xsl',
  })
}
