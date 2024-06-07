---
title: 油猴脚本自动刷课
description: 油猴脚本自动刷课
pubDate: 2020-10-09
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Tampermonkey
---

## 前言

很多学生需要完成网课的学习，但是这些课程往往很长，而且还会有一些题目，这就需要我
们隔几分钟就要看一下页面，阻碍了我们进行快乐的阅读文献，所以这里通过一些脚本插件
来解放我们的双手。

通过插件可以实现：

- 自动下一章节
- 自动答题并提交
- 视频多倍速播放
- ······

## 你要知道

::: waring 风险使用插件会有不良记录的风险，请自行考虑

实际播放时间和理论播放时间差距太大会增加风险，尽量不要拖动进度条，或者多倍速播放
:::

此方法是通过 用户脚本，脚本就是一段代码，可以为网页添加新功能，有些则可以去除广
告，提升浏览体验。而管理脚本的插件可以理解为脚本管理器，这里使用的脚本管理器是
`Tampermonkey`。

脚本则是在 `Greasy Fork` 找到。`Greasy Fork` 上的脚本由众多开发者开发并面向全世
界发布，可以免费安装使用。

:::note 有很多人将开源的程序拿来售卖盈利，请尽量多 Google 搜索，避免吃亏 :::

`Tampermonkey` 支持的浏览器如下：

- Chrome
- Microsoft Edge
- Safari
- Firefox
- Opera Next
- Dolphin Browser
- UC Browser

:::tip `Chrome` 是非常优秀的浏览器，但是碍于国内的上网环境，所以大多数人并不经
常使用，但它的兼容性最好，一般情况不会出现问题，所以尽量使用 `Chrome`。:::

由于谷歌的插件商店 `Webstore` 无法直接下载，所以这里首先介绍 `Firefox` 的方法，
然后再介绍 `Chrome` 浏览器的方法

## Firefox 方法

### 首先

在官网下载浏览器[FireFox](https://www.mozilla.org/zh-CN/firefox/new/)

> 请注意：Firefox 区分国内版和国际版，这里使用国际版

### 下载脚本管理器

脚本管理器使用 `Tampermonkey` ，地址如
下[Tampermonkey](https://www.tampermonkey.net/)

打开官网这里可以看到管理器支持的浏览器，你用什么浏览器打开，就会在相应的标签下。

![脚本页面](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/c76cb09df065af0af780aebf72c0bbaa.png)

下载安装脚本

![下载安装脚本](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/ee8743986430b14d19b716495beef07c.png)

![下载安装脚本](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/dd217be44edaf6e06536dcb09b545968.png)

按照提示完成安装即可

### 下载脚本

打开下载脚本的网站，地址如下[Greasyfork](https://greasyfork.org/zh-CN)

1. 首先搜索插件

在网站搜索 超星，插件的效果都大同小异，这里选择第一个，下载量较高的。

![安装](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/e376d996b3ba4000dc13cf0ed6a82eb0.png)

点击 安装此脚本，点进去再点击安装即可安装成功

![安装](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/042ae3fef89537983b63dce4bac60c96.png)

接下来管理脚本，点击右上角的管理器图标即可进入面板

![安装](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/094550c3581be74a3f7553a8f5951074.png)

![安装](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/65ccb2faefbde5f4e1431e1db56e3efa.png)

![安装](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/60b9e03ea2dd78586093df141bf87068.png)

在这里可以通过修改参数实现特定的目标，能修改的参数后面都有清楚的注释。

我的课程本身就有 2 倍速的选项，因此这里我选择默认 2 倍速，在使用过程中并未出现问
题。

::: tip修改参数后如果不生效请刷新页面或者重新登陆 :::

## Chrome 方法

首先下载脚本管理器，网站地址同上,[点这里](https://www.tampermonkey.net/)

点进去下载会跳转到 `Webstore`，然后安装，安装后的使用方法和 `Firefox` 一样。

如果打不开的话这里可以使用第三方的插件商
店[极简插件](https://chrome.zzzmh.cn/index)

进去看到右边的推荐栏就会有我们的插件，点进去，然后选择 推荐下载

![安装](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/f35baf22a5522bd1b553f89cf4685cad.png)

![安装](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/f4efe837a8416318c70f4a471ac105bc.png)
下载后是一个压缩包文件，把文件解压出来。

这里偷个懒，解压出来的文件有插件如何安装
的[网站教程](https://chrome.zzzmh.cn/help?token=setup)，打开就能看到。

安装好插件后的步骤和 `Firefox` 一样，下载脚本，然后启用即可。

## 结语

这些脚本都是很多优秀的开发者为大家无偿提供的，我只是个搬运工，感谢为大家提供便利
的各位大佬。
