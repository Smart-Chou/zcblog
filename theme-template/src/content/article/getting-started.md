---
title: 开始使用 Dogeared
description: 从克隆到部署：Dogeared 主题的安装、配置与写作指南。
summary: 一篇上手向导——如何安装 Dogeared、在哪里修改配置、以及如何写下你的第一篇文章。你可以直接编辑或删除这篇文章。
pubDate: 2026-01-01
tags:
    - Dogeared
    - 教程
sticky: 0
waline: false
---

## 快速开始

```bash
# 1. 安装依赖（需要 Node 22+ 与 pnpm 11+）
pnpm install

# 2. 启动开发服务器
pnpm dev

# 3. 构建静态站点（产物在 dist/）
pnpm build
```

## 自定义你的站点

所有需要修改的地方都收在 `src/config/`：

| 想改什么                              | 去哪里                                  |
| ------------------------------------- | --------------------------------------- |
| 站点标题、域名、作者、ICP 备案        | `src/config/site.ts`                    |
| 功能开关（评论、统计、公告、捐赠…）   | `src/config/feature.ts`                 |
| 导航、社交链接、页脚、侧边栏          | `src/config/ui.ts`                      |
| 服务页内容与联系方式                  | `src/config/services.ts`                |
| 界面文案（中文 / English）            | `src/data/i18n/zh.json`、`src/data/i18n/en.json` |

:::tip
站点副标题同时存在于 `src/config/site.ts` 与 i18n 文件的 `site` 块中，两处都改才完全生效。
:::

## 写你的第一篇文章

在 `src/content/article/` 下新建 `.md` 文件，最小 frontmatter 示例：

```markdown
---
title: 我的第一篇文章
description: 这篇文章讲什么。
summary: 一句话摘要，会显示在文章卡片与 RSS 中。
pubDate: 2026-01-01
tags:
    - 随笔
---

正文从这里开始。
```

删除 `blog-feature-demo.md` 与本文后，即可开始正式写作。文章支持 Mermaid、KaTeX、代码高亮、Callout 容器等渲染能力，效果详见 `blog-feature-demo.md`。

## 部署

- **GitHub Pages**：推送到 `main` 分支即自动构建部署（见 `.github/workflows/deploy.yml`）。首次使用需在仓库 Settings → Pages 将 Source 设为 **GitHub Actions**，并把 `src/config/site.ts` 里的 `url` 改成你的域名。
- **其他平台**：Vercel / Netlify / Cloudflare Pages 均可。构建命令 `pnpm build`，输出目录 `dist`。

## 可选增强

评论（Waline）、访问统计（Umami）、图床、自动抓取（Blinko 随笔 / 豆瓣 / Bangumi）等均为可选功能，默认关闭。启用方法见仓库 README 的「可选服务」一节。
