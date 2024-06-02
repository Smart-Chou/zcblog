import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import vercel from '@astrojs/vercel/static'

// https://astro.build/config
export default defineConfig({
  site: 'https://marxchou.com',
  base: '/',
  markdown: {
    syntaxHighlight: 'prism',
  },
  integrations: [sitemap(), icon()],
  image: {
    // 示例：通过自定义配置启用基于 Sharp 的图像服务
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
  adapter: vercel(),
})
