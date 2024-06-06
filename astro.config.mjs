import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import remarkDirective from 'remark-directive';
import { remarkModifiedTime } from './src/remarkPlugin/remark-modified-time.mjs';
import { resetRemark } from './src/remarkPlugin/reset-remark.js';
import { remarkAsides } from './src/remarkPlugin/remark-asides.js';
import astroExpressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { visit } from 'unist-util-visit';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';

// function customRehypeLazyLoadImage() {
//   return function (tree) {
//     visit(tree, function (node) {
//       if (node.tagName === 'img') {
//         node.properties['data-src'] = node.properties.src
//         node.properties.src = '/spinner.gif'
//         node.properties['data-alt'] = node.properties.alt
//         node.properties.alt = 'default'
//       }
//     })
//   }
// }

// https://astro.build/config
export default defineConfig({
  site: 'https://marxchou.com',
  markdown: {
    remarkPlugins: [remarkModifiedTime, resetRemark, remarkDirective, remarkAsides({})],
    // rehypePlugins: [customRehypeLazyLoadImage],
    syntaxHighlight: 'prism'
  },
  integrations: [sitemap(), icon(), astroExpressiveCode({
    plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
    themes: ['github-dark-dimmed'],
    themeCssSelector: theme => `body[data-theme=${theme.name}]`,
    useDarkModeMediaQuery: false
  }), mdx()],
  image: {
    // 示例：通过自定义配置启用基于 Sharp 的图像服务
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false
      }
    }
  },
  domains: ['avatars.githubusercontent.com'],
  remotePatterns: [{
    protocol: 'https'
  }],
  trailingSlash: 'always',
  output: 'static'
});