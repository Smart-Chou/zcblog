import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import mdx from '@astrojs/mdx'
import remarkDirective from 'remark-directive'
import { remarkModifiedTime } from './src/remarkPlugin/remark-modified-time.mjs'
import { resetRemark } from './src/remarkPlugin/reset-remark.js'
import { remarkAsides } from './src/remarkPlugin/remark-asides.js'
import { remarkDeruntify } from './src/remarkPlugin/remaek-deruntify.js'
import astroExpressiveCode from 'astro-expressive-code'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { visit } from 'unist-util-visit'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import partytown from '@astrojs/partytown'
import astroMetaTags from 'astro-meta-tags'
import pageInsight from 'astro-page-insight'

function customRehypeLazyLoadImage() {
  return function (tree) {
    visit(tree, function (node) {
      if (node.tagName === 'img') {
        node.properties['data-src'] = node.properties.src
        node.properties.src = '/spinner.gif'
        node.properties['data-alt'] = node.properties.alt
        node.properties.alt = 'default'
      }
    })
  }
}

export default defineConfig({
  site: 'https://marxchou.com',
  markdown: {
    remarkPlugins: [
      remarkModifiedTime,
      remarkDeruntify,
      resetRemark,
      remarkDirective,
      remarkAsides({}),
      customRehypeLazyLoadImage,
    ],
  },
  integrations: [
    sitemap(),
    icon(),
    astroExpressiveCode({
      plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
      themes: ['github-dark-dimmed'],
      themeCssSelector: theme => `html[data-theme=${theme.name}]`,
      useDarkModeMediaQuery: false,
    }),
    mdx(),
    partytown(),
    astroMetaTags(),
    pageInsight(),
  ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
  },
  domains: ['avatars.githubusercontent.com'],
  remotePatterns: [
    {
      protocol: 'https',
    },
  ],
  trailingSlash: 'always',
  output: 'static',
})
