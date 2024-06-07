---
title: VuePress博客搭建指南
description: 「奇怪的教程」年轻人的第一个博客搭建指南
pubDate: 2020-05-20
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Vuepress
sticky: 98
---

## 开始前要说的话

当你有意识想要为自己搭建一个个人博客时，我相信你已经步入了开发者这扇门，也许你的
技术没有非常强劲，或者你和我一样对于前端技术了解的很少，你在接下来的搭建过程中可
能会出现一些问题，这些问题很有可能没有完全的记录在我的教程中，但是请一定要记得：

:::tip 安了！

遇见了问题请不要抱怨，尝试自己解决他，利用你的翻译软件和搜索软件，找到问题的关
键，处理它，自己动手把坑填上。

:::

## 用到的技术和知识

[vuepress](https://vuepress.vuejs.org/zh/)：基于Markdown的前端网站生成
器，awesome，简单易用，不需要掌握太多前端技术也可以快速搭建

[vuepress-theme-hope](https://vuepress-theme-hope.github.io/zh/)：一个具有强大功
能的 vuepress 主题，封装好了很多功能，即使前端不是很熟悉，也可以快速上手

[markdown语法](https://zh.wikipedia.org/wiki/Markdown)：这个网上教程很多，语法也
很简单，本文也是使用markdown进行撰写的，这个必须要了解

## 文档

### 简介

可以看[这篇文章](/basic/vuepress.md)

### 详细介绍

最好的教程当然
是[官方文档](https://v1.vuepress.vuejs.org/zh/guide/getting-started.html)

## 快速开始

### 安装nodejs

下载nodejs，要求版本大于8.6，傻瓜式安装，一路next

```
# 测试安装是否成功
# 如果win10环境提示无此命令，先检查环境变量中nodejs命令的路径是否正常，然后尝试重启电脑
node -v
npm -v
# 正常输出代表安装成功
```

#### 选择一个合适的路径，创建并进入一个新目录

```
mkdir vuepress-starter && cd vuepress-starter
```

#### 初始化项目，-y会自动帮你生成好相关内容

```
# npm不太懂没关系，我们的重心不在这，大致理解就是我们的项目基于npm运行，这一步是初始化
npm init -y
```

#### 安装vuepress

```
# 如果你的环境安装正确
# 这一步结束你会发现给你的目录生成了一些文件
# 不要慌，现在你可以不知道这些文件和目录的作用
npm install -D vuepress
```

#### 创建docs目录

```
# 需要你记住的是,docs简单理解就是放你各种工作文件的地方，类似于java的src目录

右击在当前目录新建一个docs文件夹 or mkdir docs

# 进入docs，新建一个README.md文件
# 在你的README.md中写上: # Hello World!

# 修改你主目录的package.json文件，设置你的启动命令
# 你可以不配置，但是我推荐你这么做，因为配置了这是能少打几个字，方便点
# 找到scripts，不要动里面的其他东西，往里面加两行

"dev": "vuepress dev docs",
"build": "vuepress build docs"
```

#### 然后启动

```
npm run dev
```

#### 等待启动完成，你的终端会给你一个提示，让你访问localhost:8080

```md
# Hello World !
```

## 目录结构

现在你已经尝试过了Hello World，但这远远还不够，想要更深一步去搭建一个炫酷的博
客，你还需要知道vuepress的目录结构

否则你无法继续向下学习，你可以不需要死记硬背这些目录结构的作用，大致的浏览

**重点记住`docs`，`docs/.vuepress/config.js`即可，其他的等你遇到了再来看看也不
迟**

你可能会差异，我生成的项目中没有这些文件或者目录，没关系，自己创建一个即可(如果
不懂，可以先不创建！)

```
.
├── docs
│   ├── .vuepress (可选的)
│   │   ├── components (可选的)
│   │   ├── theme (可选的)
│   │   │   └── Layout.vue
│   │   ├── public (可选的)
│   │   ├── styles (可选的)
│   │   │   ├── index.styl
│   │   │   └── palette.styl
│   │   ├── templates (可选的, 谨慎配置)
│   │   │   ├── dev.html
│   │   │   └── ssr.html
│   │   ├── config.js (可选的)
│   │   └── enhanceApp.js (可选的)
│   │
│   ├── README.md
│   ├── guide
│   │   └── README.md
│   └── config.md
│
└── package.json
```

### 目录作用的描述

- docs/.vuepress: 用于存放全局的配置、组件、静态资源等。
- docs/.vuepress/components: 该目录中的 Vue 组件将会被自动注册为全局组件。
- docs/.vuepress/theme: 用于存放本地主题。
- docs/.vuepress/styles: 用于存放样式相关的文件。
- docs/.vuepress/styles/index.styl: 将会被自动应用的全局样式文件，会生成在最终的
  CSS 文件结尾，具有比默认样式更高的优先级。
- docs/.vuepress/styles/palette.styl: 用于重写默认颜色常量，或者设置新的 stylus
  颜色常量。
- docs/.vuepress/public: 静态资源目录。
- docs/.vuepress/templates: 存储 HTML 模板文件。
- docs/.vuepress/templates/dev.html: 用于开发环境的 HTML 模板文件。
- docs/.vuepress/templates/ssr.html: 构建时基于 Vue SSR 的 HTML 模板文件。
- docs/.vuepress/config.js: 配置文件的入口文件，也可以是 YML 或 toml。
- docs/.vuepress/enhanceApp.js: 客户端应用的增强。

## 基础配置

现在你已经尝试过了HelloWorld，同时也大致浏览了一遍vuepress的目录结构以及他们的作
用，知道了`docs`目录和`config.js`的作用

我们尝试做一些更加有趣的配置，记住`docs/.vuepress/config.js`这个是我们项目的核心
配置文件，绝大多数的内容配置（如导航栏，侧边栏，首页的图标，标题等等）都是在这里
进行配置的，如果你还没有这个目录，请手动在docs目录下新建.vuepress目录，并新建
config.js文件

```
module.exports = {
  title: '你的第一个vuepress博客', // 定义了你博客左上角的标题
  head: [
    ['link', { rel: 'icon', href: '/logo.jpg' }], // 自定义你博客head中的icon
  ],
  themeConfig: {
    nav:[ // 导航栏配置
      {text: 'Java', link: '/java/' },
      {text: 'Spring', link: '/spring/'},
      {text: '数据库', link: '/db/'}
    ],
  }
};
```

配置并保存，尝试启动（npm run dev）你的项目，就会得到下面这样一个简单的博客框架

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/1460000038884689)

ok，这样我们至此我们已经成功的创建了一个简单的博客，虽然比较简单，但是这也算是迈
出了很大的一步

## 基于markdown的静态页面

vueperss基于markdown，所以我们日后写博客的文件也全部都需要用markdown（MarkDown介
绍可以看[这篇文章](/basic/markdown.md)）

markdown文件可以简单理解成html文件，我们要把他们存在docs目录下，不要问为什
么，vuepress就是这么规定的

```
# 比如我写了两篇java博客，两篇spring博客，那么为它们分好类进行存放，目录结构是这样的
.
├── docs
│   ├── .vuepress (可选的)
│   │   ├── config.js (可选的)
│   ├── java
│   │   └── blog1.md
│   │   └── blog2.md
│   │   └── README.md
│   ├── spring
│   │   └── blog1.md
│   │   └── blog2.md
│   ├── README.md # 首页
└── package.json
```

相对的我们需要访问这些文件的路径就如下java下的 ==blog1 ： /java/blog1/==

我们还注意到java下有一个 ==README.md==, 在vuepress中约定，目录下的 ==README.md==
文件的路径就是该目录

所以java下的README的访问路径就是 ==/java/==

到这里你明白了你的 ==HelloWorld== 是怎么来的了吗

在docs目录下创建 ==README.md==，访问路径就是 ==/== ，也就是首页

### 撰写文章

上面我们已经知道了docs目录是关键，所以直接在docs目录下新建你的分类文件夹，然后创
建markdown文件写文章即可，哦天哪，真是太简单了！！！

## 主题配置

了解了vuepress的基础配置后，我们继续尝试一些更加炫酷的操作，主题配置

vuepress提供了强大的主题配置功能，使得使用者可以diy自己的主题并分享

下面分别对于系统默认主题的配置以及其他用户diy的主题使用进行介绍

### 默认主题

默认的当你保持你的config.js，不去进行theme的相关配置时，使用的就是默认的主题，其
效果预览可以参照vuepress的官方网站

[这里](https://v1.vuepress.vuejs.org/zh/theme/default-theme-config.html)是
vuepress官方网站提供的主题配置的相关文档，可以说记录的十分详细，我这里就简单的对
其进行使用，带你体验一下

:::caution


此时你必须要已经大致明白HelloWorld是如何出现的，才能继续的无障碍向下学习

:::

默认的主题提供了一个首页（Homepage）的布局 (用于
[vuepress主页](https://v1.vuepress.vuejs.org/zh/))。

想要使用它，需要在你的根级 ==README.md== 的
[YAML front matter](https://v1.vuepress.vuejs.org/zh/guide/markdown.html#front-matter)
指定 ==home: true==。

以下是一个如何使用的例子：

什么是**YAML front matter**，简单理解就是用在**markdown文件的开头配置**

```md
---
home: true # 指定为首页文件
heroImage: /hero.png
heroText: Hero 标题
tagline: Hero 副标题
actionText: 快速上手 →
actionLink: /zh/guide/
features:
  - title: 简洁至上
    details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
  - title: Vue驱动
    details:
      享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用
      Vue 来开发自定义主题。
  - title: 高性能
    details:
      VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为
      SPA 运行。
footer: MIT Licensed | Copyright © 2018-present Evan You
---
```

修改好后重新运行你的项目，你会看到：

![图片丢失是因为我们没有图片](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/1460000038884686)

是不是很熟悉，这和vuepress的首页几乎一样

恭喜啊，你的博客变得越来越好看了，事情开始变得有趣了起来

:::tip

然后就是更多的关于导航栏、侧边栏等等的一系列的DIY配置，这里不做详细介绍

请移步主题配置进行更深的学习，你可能会遇到很多的坑，别灰心，尝试解决它们

:::

## Theme-Hope

主题的使用需要先将主题文件进行安装，一行命令即可

这里我选择了我个人比较喜欢的一款主
题[vuepress-theme-hope](https://vuepress-theme-hope.github.io/zh/)进行介绍

一般情况下，第三方主题都有详细的文档，傻瓜式的一步步教你如何进行博客搭建

这里我也是仿照vuepress-theme-hope的文档进行简单介绍

```
# 安装主题
# 切换到项目根目录
npm i -D vuepress-theme-hope
# 安装好后，注意你的node_modules目录，会多出一个vuepress-theme-hope目录，代表安装成功
```

```
// 修改你的config.js,让他变成这样
// .vuepress/config.js
const { config } = require("vuepress-theme-hope");

module.exports = config({
  // your config here
});
```

我之所以喜欢这个主题，是因为它对于新手很友好，它提供了现成的模板直接使用即可，我
们只要在他的基础上修改就可以了

:::: code-group

::: code-group-item yarn

```bash
yarn create vuepress-theme-hope <dir>
```

:::

::: code-group-item npm

```bash
npm init vuepress-theme-hope <dir>
```

::: ::::

怎么样是不是很简单！

更多的关于这款主题的配置，也请移步文档进行学习，因为文档写的很详细，新手阅读也几
乎没有难度，所以还等什么，赶紧来试试

更详细的教程可以看[这篇文章](/basic/tutorial.md)

## 部署

以下内容来自[官方文档](https://vuepress.vuejs.org/zh/guide/deploy.html)，可以查
看详细内容

下述的指南基于以下条件：

- 文档放置在项目的 docs 目录中；
- 使用的是默认的构建输出位置；
- VuePress 以本地依赖的形式被安装到你的项目中，并且配置了如下的 `npm scripts`:

```json
{
  "scripts": {
    "docs:build": "vuepress build docs"
  }
}
```

### 云开发 CloudBase

[云开发 CloudBase](https://cloudbase.net/?site=vuepress)是一个云原生一体化的
Serverless 云平台，支持静态网站、容器等多种托管能力，并提供简便的部署工具
[CloudBase Framework](https://cloudbase.net/framework.html?site=vuepress)来一键
部署应用。

### GitHub Pages

### Netlify

1. 在 Netlify 中, 创建一个新的 GitHub 项目，使用以下设置：
   - Build Command: `yarn docs:build` 或者 `npm run docs:build`
   - Publish directory: `docs/.vuepress/dist`
2. 点击 `deploy` 按钮！

### Google Firebase

### Surge

1. 首先，假设你已经安装了 [surge](https://www.npmjs.com/package/surge)；
2. 运行 `yarn docs:build` 或者 `npm run docs:build`；
3. 想要使用 `surge` 来部署，你可以运行： `surge docs/.vuepress/dist`；

你也可以通过 `surge docs/.vuepress/dist yourdomain.com` 来部署到
[自定义域名](http://surge.sh/help/adding-a-custom-domain)。

### Heroku

### Vercel

请查看
[用Vercel创建和部署一个VuePress应用](https://vercel.com/guides/deploying-vuepress-to-vercel)。

### 21 云盒子

请查
看[21云盒子 - 部署一个VuePress静态网页](https://www.21yunbox.com/docs/#/deploy-vuepress)。
