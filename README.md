# 个人博客网站

这是一个使用Astro框架构建的个人博客网站，包含文章、标签、归档、捐赠等功能，支持响应式设计和深色/浅色模式。

## 📋 功能特性

- **响应式设计** - 适配各种设备尺寸
- **文章管理** - 支持Markdown和MDX格式文章
- **标签系统** - 文章标签分类
- **归档页面** - 按时间线展示文章
- **捐赠功能** - 支持网站捐赠
- **评论系统** - 集成Waline评论
- **代码高亮** - 支持代码块高亮和折叠
- **搜索功能** - 集成Pagefind搜索
- **SEO优化** - 自动生成sitemap和meta标签
- **主题切换** - 支持深色/浅色模式
- **RSS订阅** - 提供文章RSS订阅功能
- **相册功能** - 支持图片相册展示

## 🛠️ 技术栈

- **前端框架**: Astro
- **CSS框架**: Tailwind CSS
- **Markdown处理**: MDX
- **图标库**: Astro Icon
- **代码高亮**: Expressive Code
- **评论系统**: Waline
- **搜索服务**: Pagefind
- **部署平台**: Vercel
- **CI/CD**: GitHub Actions

## 📁 目录结构

```text
/
├── .github/               # GitHub配置目录
│   └── workflows/          # GitHub Actions工作流
├── public/                # 静态资源目录
│   ├── assets/            # 图片、字体等资源
│   │   ├── coverimage/    # 文章封面图片
│   │   ├── fonts/         # 字体文件
│   │   ├── image/         # 文章图片
│   │   ├── note/          # 笔记图片
│   │   └── rss/           # RSS相关文件
│   ├── 404.svg            # 404页面图片
│   ├── author.jpg         # 作者头像
│   ├── cover.png          # 网站封面
│   ├── favicon.ico        # 网站图标
│   └── favicon.svg        # 网站图标SVG
├── src/                   # 源代码目录
│   ├── assets/            # 源代码资源
│   ├── components/        # Astro组件
│   │   └── BaseHead/      # 网站头部信息组件
│   ├── content/           # 内容文件
│   │   ├── article/       # 文章Markdown文件
│   │   └── config.ts       # 内容配置
│   ├── data/              # 数据文件
│   ├── integrations/      # Astro集成
│   ├── layouts/           # 页面布局
│   ├── pages/             # 页面文件
│   ├── remarkPlugin/      # Markdown插件
│   ├── schemas/           # 数据模式定义
│   ├── styles/            # 样式文件
│   ├── types/             # TypeScript类型定义
│   └── utils/             # 工具函数
├── astro.config.mjs        # Astro配置文件
├── package.json           # 项目依赖
├── pagefind.yml            # Pagefind配置文件
├── pnpm-lock.yaml         # pnpm依赖锁定文件
├── tsconfig.json           # TypeScript配置文件
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

构建产物将输出到 `./dist/` 目录，并自动生成搜索索引。

### 预览生产版本

```bash
pnpm run preview
```

### 代码格式化

```bash
pnpm run format
```

### 端到端测试

```bash
pnpm run test:e2e
```

## 🔧 配置

网站配置主要在以下文件中：

- `astro.config.mjs` - Astro框架配置
- `src/content/config.ts` - 内容配置
- `src/self.config.ts` - 网站配置
- `pagefind.yml` - Pagefind搜索配置

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

项目配置了Vercel部署和GitHub Actions CI/CD流程：

### Vercel部署

通过以下命令部署到Vercel：

```bash
pnpm run deploy
```

### GitHub Actions

项目配置了GitHub Actions工作流，当代码推送到主分支时自动构建和部署。

## 📄 许可证

MIT License
