---
title: webpack教程
description: webpack教程
pubDate: 2020-06-23
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - JavaScript
  - Webpack
---

- 源码仓库[github](https://github.com/lookroot/vuestu)欢迎star
- 视频地址[哔哩哔哩](https://www.bilibili.com/video/bv1oK411p7SJ)

> 我会将所有的读者概括为初学者，即使你可能有基础，学习本节之前我希望你具有一定的
> JavaScript和node基础

- 文中的 ... ...代表省略掉部分代码，和上面的代码相同
- 文中的文件夹如果没有说创建，并且项目默认没有的是需要你手动增加的
- 不会特别细致，但是足够入门

## 什么是webpack

> Web浏览器使用HTML，CSS和JavaScript。随着项目的发展，跟踪和配置所有这些文件变得
> 非常复杂,解决这个问题就需要一个新的工具

类似webpack的工具还有Grunt和Gulp，webpack是模块管理工具，把你的项目按照你的想法
进行划分模块打包，举个最简单的例子，这个页面需要加载一个 a.js和b.js，但是你只想
加载一个js文件，就可以使用webpack将两个文件进行合并，当然webpack的功能不止于此，
代码转化、项目优化、代码分割、代码预编译、自动构建、自动刷新...

再比如你想你的代码兼容其他老的浏览器，你的css代码兼容不同的浏览器内核，或者你想
自动精简掉你写了但是没有用到的代码，这些都可以使用webpack实现

如果你是vue或者react等框架的使用者，肯定使用过 vue-cli 或 react-create-app 这类
脚手架工具，那么实现这个效果，就要学习webpack

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/164044-70776.png)
