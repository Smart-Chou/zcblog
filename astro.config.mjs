import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: 'https://marxchou.com',
  markdown: {
    syntaxHighlight: 'prism'
  },
  integrations: [sitemap(), icon(), mdx()],
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