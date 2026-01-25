# 个人博客网站

这是一个使用Astro框架构建的个人博客网站，包含文章、标签、归档、捐赠等功能。

## 📋 功能特性

- **响应式设计** - 适配各种设备尺寸
- **文章管理** - 支持Markdown和MDX格式文章
- **标签系统** - 文章标签分类
- **归档页面** - 按时间线展示文章
- **捐赠功能** - 支持网站捐赠
- **评论系统** - 集成Waline评论
- **代码高亮** - 支持代码块高亮和折叠
- **搜索功能** - 集成Meilisearch搜索
- **SEO优化** - 自动生成sitemap和meta标签
- **主题切换** - 支持深色/浅色模式

## 🛠️ 技术栈

- **前端框架**: Astro 5.16.11
- **CSS框架**: Tailwind CSS
- **Markdown处理**: MDX
- **图标库**: Astro Icon
- **代码高亮**: Expressive Code
- **评论系统**: Waline
- **搜索服务**: Meilisearch
- **部署平台**: Vercel

## 📁 目录结构

```text
/
├── public/                # 静态资源目录
│   ├── assets/            # 图片、字体等资源
│   └── favicon.ico        # 网站图标
├── src/                   # 源代码目录
│   ├── components/        # Astro组件
│   ├── content/           # 内容文件
│   │   └── article/       # 文章Markdown文件
│   ├── integrations/      # Astro集成
│   ├── layouts/           # 页面布局
│   ├── pages/             # 页面文件
│   ├── remarkPlugin/      # Markdown插件
│   ├── styles/            # 样式文件
│   └── utils/             # 工具函数
├── astro.config.mjs       # Astro配置文件
├── package.json           # 项目依赖
└── README.md              # 项目说明
```

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm run dev
```

访问 `http://localhost:4321` 查看网站。

### 构建生产版本

```bash
pnpm run build
```

构建产物将输出到 `./dist/` 目录。

### 预览生产版本

```bash
pnpm run preview
```

### 代码格式化

```bash
pnpm run format
```

## 🔧 配置

网站配置主要在以下文件中：

- `astro.config.mjs` - Astro框架配置
- `src/content/config.ts` - 内容配置
- `src/components/BaseHead/` - 网站头部信息配置

## 📝 内容管理

文章存储在 `src/content/article/` 目录中，使用Markdown或MDX格式编写。

### 文章格式

```markdown
---
title: 文章标题
description: 文章描述
date: 2024-01-01
tags: [标签1, 标签2]
---

文章内容...
```

## 🚢 部署

项目配置了Vercel部署，通过以下命令部署：

```bash
pnpm run deploy
```

## 📄 许可证

MIT License

## 👤 作者

- 网站: [https://marxchou.com](https://marxchou.com)
