import { defineConfig } from 'astro/config';
import { remarkModifiedTime } from './remark-modified-time.mjs';
import sitemap from '@astrojs/sitemap';
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://marxchou.com",
  markdown: {
    syntaxHighlight: 'prism',
    remarkPlugins: [remarkModifiedTime],
  },
  integrations: [
    sitemap(),
    icon()
  ]
});