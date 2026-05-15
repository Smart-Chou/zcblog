# 个人博客网站

这是一个使用Astro框架构建的个人博客网站，包含文章、标签、归档、捐赠等功能，支持响应式设计和深色/浅色模式。

## 功能特性

- **响应式设计** - 适配各种设备尺寸
- **文章管理** - 支持Markdown和MDX格式文章
- **标签系统** - 文章标签分类
- **归档页面** - 按时间线展示文章
- **捐赠功能** - 支持网站捐赠
- **评论系统** - 集成Waline评论
- **代码高亮** - Expressive Code，支持行号和折叠
- **搜索功能** - 集成Pagefind搜索
- **SEO优化** - 自动生成sitemap、OG/Twitter/JSON-LD meta标签
- **主题切换** - 支持深色/浅色模式
- **RSS订阅** - 提供文章RSS订阅
- **相册功能** - 支持图片相册展示
- **多语言** - 支持中/英文双语
- **番剧追踪** - 追番记录展示
- **Markdown扩展** - Mermaid、PlantUML、KaTeX、Chart、Markmap等

## 技术栈

- **前端框架**: Astro 6.x
- **CSS框架**: Tailwind CSS 4.x
- **Markdown处理**: MDX + Remark/Rehype插件
- **图标库**: Astro Icon
- **代码高亮**: Expressive Code
- **评论系统**: Waline
- **搜索服务**: Pagefind
- **部署平台**: Vercel
- **CI/CD**: GitHub Actions
- **测试**: Vitest

## 目录结构

```text
/
├── .github/workflows/     # CI/CD 工作流
├── public/                # 静态资源（favicon、字体、图片等）
├── src/
│   ├── assets/            # 源码资源（SVG、图片）
│   ├── components/        # Astro组件
│   │   ├── Article/       # 文章相关组件
│   │   ├── BaseHead/      # SEO头部组件
│   │   ├── Feature/       # 功能组件
│   │   ├── Index/         # 首页组件
│   │   ├── Layout/        # 布局组件
│   │   └── Widget/        # 通用组件
│   ├── config/            # 配置文件
│   │   ├── site.config.ts    # 网站基本信息
│   │   ├── feature.config.ts # 功能开关
│   │   └── ui.config.ts      # UI配置
│   ├── content/           # 内容文件
│   │   ├── article/       # 文章Markdown
│   │   └── pages/         # 独立页面
│   ├── data/              # JSON数据
│   ├── integrations/      # Astro集成（Pagefind、Redirect）
│   ├── layouts/           # 页面布局
│   ├── pages/             # 路由页面
│   ├── remarkPlugin/      # Markdown插件
│   ├── schemas/           # 数据校验
│   ├── scripts/           # 客户端脚本
│   ├── styles/            # CSS样式
│   ├── types/             # TypeScript类型
│   └── utils/             # 工具函数
├── astro.config.mjs       # Astro配置
├── package.json           # 项目依赖
└── tsconfig.json          # TypeScript配置
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 构建生产版本
pnpm run build

# 预览构建产物
pnpm run preview
```

## 可用脚本

| 脚本              | 说明                       |
| ----------------- | -------------------------- |
| `pnpm dev`        | 启动开发服务器             |
| `pnpm build`      | 生成图标 + 类型检查 + 构建 |
| `pnpm preview`    | 预览构建产物               |
| `pnpm icons`      | 生成图标文件               |
| `pnpm new-post`   | 创建新文章                 |
| `pnpm format`     | 代码格式化                 |
| `pnpm lint`       | 代码检查（格式校验）       |
| `pnpm test:unit`  | 运行单元测试               |
| `pnpm type-check` | TypeScript类型检查         |

## 配置

网站配置主要在以下文件中：

- `astro.config.mjs` - Astro框架配置
- `src/content.config.ts` - 内容集合配置
- `src/config/site.config.ts` - 网站基本信息
- `src/config/feature.config.ts` - 功能开关配置
- `src/config/ui.config.ts` - UI相关配置

## 内容管理

文章存储在 `src/content/article/` 目录中，使用Markdown或MDX格式编写。

```markdown
---
title: 文章标题
description: 文章描述
pubDate: 2024-01-01
tags: [标签1, 标签2]
image:
    url: cover.jpg
    alt: 封面描述
---

文章内容...
```

## 部署

项目配置了GitHub Actions CI/CD流程：

- **CI** — 推送/PR到main时运行类型检查、单元测试和构建验证
- **Deploy** — 推送到main时自动构建并部署到GitHub Pages

## 许可证

MIT License
