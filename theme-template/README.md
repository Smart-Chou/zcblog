# Dogeared

一个温暖、编辑风（editorial）的 Astro 博客主题：暖纸底色、克制的排版、开箱即用的搜索、PWA、中英双语与可选的评论/统计/图床等增强。

> 名字来自本主题的设计北极星 **"The Worn Notebook"**——"一只被反复使用、墨渍斑斑、卷了角的笔记本（ink-stained, **dog-eared**, warm from use）"。

## 特性

- 🖋 **编辑风视觉**：暖纸配色、衬线标题、克制的装饰，亮暗双主题
- 🔍 **静态搜索**：Pagefind 构建期索引，零后端
- 🌗 **亮 / 暗主题**：跟随系统 + 手动切换，偏好本地持久化
- 🌍 **双语**：zh-CN / en 完整 i18n，语言切换器与 hreflang
- 📝 **Markdown 增强**：Mermaid、KaTeX 公式、Callout 容器、expressive-code 代码块（行号/折叠/复制）
- 🖼 **图片**：本地资源或图床（可选），占位图兜底
- 💬 **可选能力**：Waline 评论、Umami 统计、捐赠页、公告栏、水印（默认关闭）
- 📱 **PWA**：可安装、离线可读（Workbox 缓存）
- 🧩 **数据页面**（全部可选）：随笔（Blinko）、豆瓣、Bangumi、相册、友链、服务页

## 快速开始

要求：**Node 22+**、**pnpm 11+**。

```bash
pnpm install
pnpm dev        # 开发服务器 http://localhost:4321
pnpm build      # 构建到 dist/
pnpm preview    # 本地预览构建产物
```

推荐从 GitHub 的 **Use this template** 创建你自己的仓库，或直接 `degit yourname/dogeared my-blog`。

## 配置

所有配置集中在 `src/config/`：

| 文件                    | 内容                                            |
| ----------------------- | ----------------------------------------------- |
| `src/config/site.ts`    | 标题、副标题、域名、作者、备案号、图床          |
| `src/config/feature.ts` | 功能开关：评论 / 统计 / 公告 / 捐赠 / 搜索 / GA |
| `src/config/ui.ts`      | 导航、社交链接、页脚、侧边栏                    |
| `src/config/services.ts`| 「服务」页内容与联系方式                        |

界面文案在 `src/data/i18n/zh.json` 与 `en.json`（含 `site` 块中的站点标题/副标题/描述）。

写作：在 `src/content/article/` 下新建 markdown 文件即可；`pnpm new-post` 提供交互式脚手架。文章字段与渲染能力见演示文章 `blog-feature-demo.md`。

## 可选服务

以下功能**默认关闭**，按需启用（均为零侵入设计：不开也不影响构建）：

| 功能           | 启用方式                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| Waline 评论    | `feature.ts` 里 `waline.enable=true` + 填 `serverUrl`                    |
| Umami 统计     | `feature.ts` 里 `umami.enable=true` + 填服务地址与站点 ID                |
| 图床           | `site.ts` 里 `imageService.baseUrl` 填图床地址（留空则用本地占位图）     |
| 捐赠页         | `feature.ts` 里 `donate.enable=true`（二维码图片放在 `src/assets/qr/`）  |
| 自动抓取数据   | 配置环境变量（见 `.env.example`）：`BLINKO_API_URL`、`DOUBAN_USER_ID`、`BANGUMI_USER_ID` 等；未配置时脚本自动跳过 |

## 部署

默认提供 GitHub Pages 工作流（`.github/workflows/deploy.yml`）：推送到 `main` 即自动构建部署。首次使用需在仓库 Settings → Pages 把 Source 设为 **GitHub Actions**。

Vercel / Netlify / Cloudflare Pages 同样支持：构建命令 `pnpm build`，输出目录 `dist`。

部署后记得把 `src/config/site.ts` 的 `url` 与 `domains` 改成你的真实域名。

## 项目结构

```text
src/
├── components/   # 组件（布局、文章、UI）
├── config/       # ← 你的所有配置都在这里
├── content/      # 文章（article/）与单页（pages/）
├── data/         # 数据文件 + i18n 文案
├── layouts/      # 页面布局
├── pages/        # 路由
├── styles/       # 设计令牌与全局样式
└── utils/        # 工具函数
scripts/          # 构建期脚本（数据抓取、校验、图标）
```

## 常见问题

- **评论不显示**：Waline 默认关闭，需 `waline.enable=true` 并提供 `serverUrl`（自建服务参考 Waline 官方文档）。
- **封面图不显示**：文章 frontmatter 的 `image.url` 留空时使用本地占位图；配置 `imageService.baseUrl` 后走图床。
- **搜索没结果**：搜索索引由 `pnpm build` 中的 Pagefind 步骤生成，`pnpm dev` 下需先跑一次构建或使用 `pnpm pagefind`。
- **构建被加密文章卡住**：文章使用 `:::encrypted[]` 容器时需要设置环境变量 `ENCRYPTION_PASSWORD`（见 `.env.example`）。

## 致谢与许可

由 **MarxChou** 制作与维护，从个人博客项目提取并通用化。灵感来自 Astro 官方 Minimal 模板。

MIT License。你可以自由使用、修改与分发（保留许可证声明即可）。
