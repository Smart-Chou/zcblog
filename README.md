# Marx's Blog

[marxchou.com](https://marxchou.com) — 基于 Astro 构建的个人博客网站，支持文章、标签、归档、相册、番剧追踪、随笔、友链、豆瓣书影音、捐赠等功能。

## 功能特性

- **响应式设计** — 适配各种设备尺寸，自定义 CSS 变量系统
- **深色/浅色模式** — CSS 自定义属性 + `prefers-color-scheme` 媒体查询 + 手动切换
- **文章管理** — 支持 Markdown 和 MDX 格式，含阅读时间、字数统计、相邻文章导航
- **标签系统** — 文章标签分类与聚合页面
- **归档页面** — 按时间线展示所有文章
- **Markdown 扩展** — Mermaid 图表、PlantUML、KaTeX 数学公式、Chart.js、Markmap 思维导图、Reveal.js 幻灯片、GitHub 卡片、自定义提示（Asides）、标签页（Tabs）、图片网格、内容加密
- **代码高亮** — Expressive Code，支持行号、代码折叠、复制按钮、语言标识
- **搜索功能** — Pagefind 构建时索引，客户端全文搜索
- **SEO 优化** — 自动生成 Sitemap（多语言）、OG/Twitter/JSON-LD Meta 标签、robots.txt
- **RSS 订阅** — 中文和英文独立订阅源，含阅读时间和字数
- **OG 图片** — 使用 Satori + Sharp 在构建时自动生成社交分享卡片
- **多语言** — 支持中文（默认）和英文，Astro i18n 路由
- **评论系统** — Waline 自托管评论，支持表情反应与搜索
- **网站分析** — Umami 自托管统计分析
- **PWA** — Service Worker 离线缓存，自动更新，可安装为桌面应用
- **相册功能** — Fancybox 灯箱相册展示
- **番剧追踪** — 追番记录展示（Bangumi 数据源）
- **豆瓣书影音** — 豆瓣在读/看过/想看展示
- **随笔** — Blinko 随笔展示
- **友链** — 友情链接与友链文章聚合（Foreverblog RSS）
- **捐赠功能** — 支付宝 / 微信支付 / PayPal
- **外链重定向** — 外部链接经确认页面中转，防止用户无感知离开
- **公告栏** — 可配置顶部公告（支持 localStorage 持久关闭）
- **水印** — 可选页面水印
- **阅读进度条** — 粘性顶部进度条，CSS 滚动驱动动画
- **返回顶部** — 文章页返回顶部按钮
- **中日韩文字排版优化** — Pangu 自动在中英文之间添加空格
- **View Transitions** — Astro 视图过渡动画

## 技术栈

| 类别 | 技术 |
| ---- | ---- |
| **框架** | Astro 6.x（静态站点生成） |
| **CSS** | Tailwind CSS 4.x + 自定义 CSS 变量系统 |
| **语言** | TypeScript（严格模式） |
| **内容** | MDX + Remark/Rehype 插件流水线 |
| **图标** | Astro Icon（Iconify JSON: Logos / MingCute / Tabler） |
| **代码高亮** | Expressive Code（行号 + 可折叠区域插件） |
| **评论** | Waline（自托管） |
| **搜索** | Pagefind（构建时索引） |
| **分析** | Umami（自托管） |
| **PWA** | vite-plugin-pwa（Service Worker + 运行时缓存） |
| **OG 图片** | Satori + Sharp |
| **数学公式** | KaTeX（rehype-katex + remark-math） |
| **打字排版** | Pangu（中英文自动空格） |
| **灯箱** | Fancybox UI |
| **性能** | Partytown（第三方脚本卸载到 Web Worker） |
| **视图过渡** | astro-vtbot |
| **部署** | GitHub Pages + Vercel |
| **CI/CD** | GitHub Actions |
| **单元测试** | Vitest |
| **E2E 测试** | Playwright |
| **格式化** | Prettier + prettier-plugin-astro |
| **版本管理** | standard-version |
| **包管理** | pnpm（强制使用） |

## 目录结构

```text
/
├── .github/workflows/         # CI 与部署工作流
├── .claude/                   # Claude AI 辅助配置
├── .vercel/                   # Vercel 部署元数据
├── public/                    # 静态资源（favicon、logo、文章图片、字体等）
├── scripts/                   # 构建/数据获取脚本
│   ├── fetch-talks.mjs        # 从 Blinko API 拉取随笔
│   ├── fetch-douban.mjs       # 从豆瓣拉取书影音
│   ├── fetch-friends.mjs      # 从 Foreverblog RSS 拉取友链文章
│   ├── fetch-bangumi.mjs      # 从 Bangumi/MAL 拉取番剧数据
│   ├── generate-icons.js      # 生成 PWA 图标
│   ├── verify-data.mjs        # 构建前验证抓取数据
│   ├── link-check.mjs         # 死链检查
│   ├── new-post.sh            # 创建新文章脚本
│   └── lib/                   # 共享工具函数
├── src/
│   ├── assets/                # 源码资源（字体、二维码、封面图）
│   ├── components/            # Astro 组件
│   │   ├── Article/           # 文章组件（PostCard、Toc、Breadcrumb、PostMeta 等）
│   │   ├── Bangumi/           # 番剧追踪 UI
│   │   ├── BaseHead/          # SEO Head 组件
│   │   ├── Douban/            # 豆瓣书影音
│   │   ├── Gallery/           # 相册组件（Fancybox 灯箱）
│   │   ├── Icons/             # 自定义图标
│   │   ├── Index/             # 首页组件（Hero、RecentArticles 等）
│   │   ├── Layout/            # 布局组件（Header、Footer、Nav 等）
│   │   ├── Pages/             # 独立页面组件（HomeContent、ArchiveContent 等）
│   │   └── UI/                # 通用 UI（Author、Donate、WalineComment、Notice、Watermark 等）
│   ├── config/                # 集中配置
│   │   ├── index.ts           # 统一导出
│   │   ├── site.ts            # 站点元数据、作者、图床、页面配置
│   │   ├── feature.ts         # 功能开关（评论、搜索、分析、捐赠、水印、公告栏）
│   │   └── ui.ts              # 导航、社交链接、页脚配置
│   ├── content/               # Astro 内容集合
│   │   ├── article/           # 文章 Markdown/MDX（67 篇）
│   │   └── pages/             # 独立页面（cookies、copyright、privacy-policy）
│   ├── content.config.ts      # 内容集合 Zod Schema 定义
│   ├── data/                  # JSON 数据源
│   │   ├── albums.json        # 相册数据
│   │   ├── bangumi.json       # 番剧追踪数据
│   │   ├── douban.json        # 豆瓣书影音数据
│   │   ├── friends.json       # 友链列表
│   │   ├── friends-articles.json # 友链文章聚合
│   │   ├── talks.json         # 随笔（Blinko）
│   │   ├── donators.json      # 捐赠者列表
│   │   ├── typewriter.json    # 打字机效果文本
│   │   └── i18n/              # 国际化翻译（zh.json、en.json）
│   ├── integrations/          # 自定义 Astro 集成
│   │   ├── redirect.ts        # 外链重定向集成
│   │   ├── pagefind.ts        # Pagefind 搜索索引集成
│   │   ├── og-image.ts        # OG 图片生成集成
│   │   └── og-image-route.ts  # OG 图片路由处理
│   ├── layouts/               # 页面布局
│   │   ├── BaseLayout.astro   # 基础 HTML 结构（Header、Footer、Notice）
│   │   ├── MarkdownLayout.astro # 文章布局（Toc、相关内容、评论、捐赠）
│   │   └── PostLayout.astro   # 轻量文章包装
│   ├── pages/                 # Astro 路由页面
│   │   ├── index.astro        # 首页
│   │   ├── 404.astro          # 404 页面
│   │   ├── 500.astro          # 500 页面
│   │   ├── robots.txt.ts      # 动态 robots.txt
│   │   ├── rss.xml.ts         # RSS 订阅源
│   │   ├── redirect.astro     # 外链重定向中转页
│   │   ├── [...custom].astro  # 独立页面通配路由
│   │   ├── article/           # 文章详情页
│   │   ├── blog/              # 分页博客列表
│   │   ├── tags/              # 标签页面
│   │   ├── archives/          # 归档页面
│   │   ├── albums/            # 相册页面
│   │   ├── bangumi/           # 番剧追踪页面
│   │   ├── talks/             # 随笔页面
│   │   ├── friends/           # 友链页面
│   │   ├── donate/            # 捐赠页面
│   │   ├── douban/            # 豆瓣页面
│   │   └── en/                # 英文镜像页面
│   ├── remark-plugin/         # 自定义 Remark/Rehype 插件
│   │   ├── remark-align.ts    # 内容对齐
│   │   ├── remark-asides.ts   # 自定义提示框
│   │   ├── remark-code-blocks.ts # 代码块增强
│   │   ├── remark-encrypted.ts / rehype-encrypted.ts # 内容加密
│   │   ├── remark-github-card.ts # GitHub 仓库卡片
│   │   ├── remark-image-grid.ts  # 图片网格布局
│   │   ├── remark-include.ts  # 文件引入
│   │   ├── remark-inline-syntax.ts # 行内语法扩展
│   │   ├── remark-tabs.ts     # 标签页组件
│   │   └── rehype-plugin/     # Rehype 插件（GitHub Card 等）
│   ├── schemas/               # Zod 数据校验 Schema
│   ├── scripts/               # 客户端 TypeScript/JavaScript
│   │   ├── chart-renderer.ts  # Chart.js 渲染
│   │   ├── markmap-renderer.ts # Markmap 思维导图渲染
│   │   ├── reveal-renderer.ts # Reveal.js 幻灯片渲染
│   │   ├── fancybox-*.ts      # Fancybox 灯箱处理
│   │   ├── search-template.js # Pagefind 搜索模板
│   │   ├── tabs.ts            # 标签页交互
│   │   ├── heatmap.ts         # 热力图
│   │   └── redirect-handler.ts # 重定向处理
│   ├── styles/                # CSS 样式（~22 个文件）
│   │   ├── variables.css      # 设计变量（字体、颜色、间距、阴影）
│   │   ├── global.css         # 全局样式入口
│   │   ├── base.css           # 基础样式
│   │   ├── reset.css          # CSS Reset
│   │   ├── typography.css     # 排版样式
│   │   ├── components.css     # 组件样式
│   │   ├── home.css           # 首页样式
│   │   ├── toc.css            # 目录样式
│   │   ├── markdown-extend.css # 文章内容样式
│   │   └── ...                # 其他覆盖/扩展样式
│   ├── types/                 # TypeScript 类型定义
│   └── utils/                 # 工具函数（~18 个文件）
│       ├── article-stats.ts   # 文章统计
│       ├── adjacent-posts.ts  # 相邻文章
│       ├── date-utils.ts      # 日期处理
│       ├── git-date.ts        # Git 日期
│       ├── image-utils.ts     # 图片处理
│       ├── i18n.ts            # 国际化
│       ├── encrypt.ts         # 加密解密
│       ├── fancybox.ts        # Fancybox 初始化
│       └── post-meta/         # 阅读时间等元数据
├── e2e/                       # Playwright E2E 测试
│   ├── smoke.spec.ts          # 冒烟测试
│   ├── navigation.spec.ts     # 导航测试
│   ├── theme.spec.ts          # 主题切换测试
│   ├── i18n.spec.ts           # 国际化测试
│   ├── article.spec.ts        # 文章页测试
│   ├── search.spec.ts         # 搜索功能测试
│   └── interactions.spec.ts   # 交互测试
├── astro.config.mjs           # Astro 框架配置
├── content.config.ts          # 内容集合 Schema
├── package.json               # 项目依赖与脚本
├── tsconfig.json              # TypeScript 配置
├── vitest.config.ts           # Vitest 单元测试配置
├── playwright.config.ts       # Playwright E2E 测试配置
├── vercel.json                # Vercel 部署配置
├── .prettierrc.mjs            # Prettier 格式化配置
├── .editorconfig              # 编辑器配置
└── .env.example               # 环境变量示例
```

## 快速开始

```bash
# 安装依赖（仅支持 pnpm）
pnpm install

# 开发模式（启动开发服务器）
pnpm run dev

# 拉取外部数据 + 构建生产版本
pnpm run build

# 预览构建产物
pnpm run preview
```

## 可用脚本

### 开发

| 脚本 | 说明 |
| ---- | ---- |
| `pnpm dev` | 启动 Astro 开发服务器 |
| `pnpm dev:clean` | 清除 Vite 缓存后启动开发服务器 |
| `pnpm start` | 同 `pnpm dev` |
| `pnpm build` | 拉取外部数据 + 构建生产版本 |
| `pnpm preview` | 预览构建产物 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm new-post` | 交互式创建新文章 |

### 数据获取

| 脚本 | 说明 |
| ---- | ---- |
| `pnpm fetch:all` | 并行拉取所有外部数据（talks + douban + friends + bangumi + icons） |
| `pnpm talks` | 从 Blinko API 拉取随笔数据 |
| `pnpm douban` | 从豆瓣拉取书影音数据 |
| `pnpm friends` | 从 Foreverblog RSS 拉取友链文章 |
| `pnpm bangumi` | 从 Bangumi/MAL 拉取番剧追踪数据 |
| `pnpm icons` | 生成 PWA 图标 |
| `pnpm fetch:verify` | 验证所有抓取数据的完整性 |
| `pnpm links` | 检查文章中的死链 |

### 代码质量

| 脚本 | 说明 |
| ---- | ---- |
| `pnpm format` | Prettier 格式化所有文件 |
| `pnpm format:check` | 检查格式是否合规 |
| `pnpm lint` | 代码检查（等同于 format:check） |

### 测试

| 脚本 | 说明 |
| ---- | ---- |
| `pnpm test:unit` | 运行 Vitest 单元测试 |
| `pnpm test:unit:watch` | 以监听模式运行单元测试 |
| `pnpm test:e2e` | 运行 Playwright E2E 测试 |
| `pnpm test:e2e:ui` | 以 UI 模式运行 E2E 测试 |

### 发布

| 脚本 | 说明 |
| ---- | ---- |
| `pnpm release` | 使用 standard-version 生成 changelog 并 bump 版本 |
| `pnpm release:dry` | 预览版本 bump（不实际执行） |

## 环境变量

复制 `.env.example` 为 `.env` 并填入对应值：

| 变量 | 必需 | 说明 |
| ---- | ---- | ---- |
| `BLINKO_API_TOKEN` | 是 | Blinko API Token，用于拉取随笔数据 |
| `DOUBAN_USER_ID` | 是 | 豆瓣用户 ID，用于拉取书影音数据 |
| `FOREVERBLOG_RSS_URL` | 否 | Foreverblog RSS 源地址（默认使用 rsshub.rssforever.com） |
| `ENCRYPTION_PASSWORD` | 否 | 文章加密密码（用于加密文章内容） |
| `BUILD_CONCURRENCY` | 否 | Astro 构建并发数（默认为 CPU 核心数） |
| `INDEXNOW_API_KEY` | 否 | IndexNow API Key，用于通知搜索引擎更新 |

## 配置

网站的核心配置集中在 `src/config/` 目录：

| 文件 | 说明 |
| ---- | ---- |
| [src/config/site.ts](src/config/site.ts) | 网站标题、描述、URL、域名、作者信息、图床服务、页面配置 |
| [src/config/feature.ts](src/config/feature.ts) | 功能开关：评论（Waline）、搜索（Pagefind）、分析（Umami）、捐赠、公告栏、水印 |
| [src/config/ui.ts](src/config/ui.ts) | 导航链接、社交链接、页脚信息、友链页面文案 |

其他重要配置文件：

| 文件 | 说明 |
| ---- | ---- |
| [astro.config.mjs](astro.config.mjs) | Astro 框架配置（i18n、Markdown 插件、集成、PWA、构建优化） |
| [src/content.config.ts](src/content.config.ts) | 内容集合 Zod Schema 定义 |
| [vercel.json](vercel.json) | Vercel 部署配置 |

## 内容管理

### 文章

文章存储在 `src/content/article/` 目录中，使用 Markdown（`.md`）或 MDX（`.mdx`）格式编写。

文章 Frontmatter：

```yaml
---
title: 文章标题              # 必填
description: 文章描述          # 可选，用于 SEO
summary: 文章摘要              # 可选，用于列表展示
pubDate: 2024-01-01           # 必填，发布日期
upDate: 2024-06-01            # 可选，更新日期
tags: [标签1, 标签2]           # 标签列表
lang: zh                      # 语言：zh（默认）或 en
image:                        # 可选，封面图（默认随机图床图片）
  url: cover.jpg
  alt: 封面描述
sticky: 0                     # 置顶优先级（数字越大越靠前，0 为不置顶）
draft: false                  # 是否为草稿（草稿不会出现在生产构建中）
toc: true                     # 是否显示目录
waline: true                  # 是否启用评论
donate: true                  # 是否显示捐赠区域
author: true                  # 是否显示作者信息
mathjax: false                # 启用 MathJax 数学公式
mermaid: false                # 启用 Mermaid 图表
plantuml: false               # 启用 PlantUML 图表
katex: false                  # 启用 KaTeX 数学公式
chart: false                  # 启用 Chart.js 图表
markmap: false                # 启用 Markmap 思维导图
reveal: false                 # 启用 Reveal.js 幻灯片
fancybox: true                # 启用 Fancybox 图片灯箱
tabs: true                    # 启用标签页组件
---
```

### 独立页面

独立页面存储在 `src/content/pages/` 中，通过通配路由 `[...custom].astro` 渲染。当前包含：Cookies 政策、版权声明、隐私政策。

Frontmatter：

```yaml
---
title: 页面标题
description: 页面描述（可选）
---
```

## 数据源

项目依赖多个外部数据源，通过构建脚本在构建前拉取：

| 数据 | 来源 | 输出文件 | 拉取脚本 |
| ---- | ---- | ---- | ---- |
| 随笔 | Blinko API | `src/data/talks.json` | `scripts/fetch-talks.mjs` |
| 书影音 | 豆瓣 | `src/data/douban.json` | `scripts/fetch-douban.mjs` |
| 友链文章 | Foreverblog RSS | `src/data/friends-articles.json` | `scripts/fetch-friends.mjs` |
| 番剧追踪 | Bangumi/MAL | `src/data/bangumi.json` | `scripts/fetch-bangumi.mjs` |

静态 JSON 数据（手动维护）：

| 数据 | 文件 |
| ---- | ---- |
| 相册 | `src/data/albums.json` |
| 友链列表 | `src/data/friends.json` |
| 捐赠者 | `src/data/donators.json` |
| 打字机文本 | `src/data/typewriter.json` |
| 多语言翻译 | `src/data/i18n/zh.json`、`src/data/i18n/en.json` |

## 部署

### GitHub Pages（主要部署方式）

推送至 `main` 或 `theme` 分支时自动触发，也可通过 `repository_dispatch`（文章更新时）或手动触发：

1. 从私有仓库 `Smart-Chou/zcblog-articles` 拉取文章与图片
2. 安装系统依赖（libvips）
3. 安装 pnpm + Node.js 22
4. 安装依赖并构建
5. 部署到 GitHub Pages

### Vercel

项目也支持 Vercel 部署，配置见 `vercel.json`。通过 `.vercel/` 目录中的项目元数据关联。

### 构建流程

```
pnpm build
  ├── pnpm fetch:all（并行）
  │   ├── talks（Blinko 随笔）
  │   ├── douban（豆瓣书影音）
  │   ├── friends（友链文章 RSS）
  │   ├── bangumi（番剧追踪）
  │   └── icons（PWA 图标）
  ├── pnpm fetch:verify（数据校验）
  └── astro build（静态站点生成 + Pagefind 索引）
```

## CI/CD

| 工作流 | 触发条件 | 内容 |
| ---- | ---- | ---- |
| **CI** | 推送/PR 到 `main` 或 `theme` | Lint → TypeScript 类型检查 → 单元测试 |
| **Deploy** | 推送到 `main`/`theme` / 文章更新 / 手动触发 | 拉取文章 → 安装依赖 → 构建 → 部署到 GitHub Pages |

## 内容加密

部分文章支持密码加密。在需要加密的文章中添加对应 frontmatter 标记，并设置环境变量 `ENCRYPTION_PASSWORD`，构建时 `remark-encrypted` 插件会使用 AES 加密文章内容，客户端通过 `rehype-encrypted` 解密。

## 多语言 (i18n)

- **中文**：默认语言，URL 无前缀（如 `/blog/1/`）
- **英文**：URL 前缀 `/en/`（如 `/en/blog/1/`）
- 翻译文本存储在 `src/data/i18n/` 中
- RSS 订阅源分别提供中文和英文两个版本

## 许可证

MIT License
