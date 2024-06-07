---
title: GitHub下载慢的问题
description: GitHub下载慢的问题
pubDate: 2020-06-25
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Git
---

## GitHub下载慢的问题

很多小伙伴说啊这个GitHub的下载速度很慢，那么本期视屏我给大家准备了几个可以提升速
度的方法非常的简单

本次视屏由大家的三连支持播出

## 码云

码云作为国内的代码托管厂商，速度是非常快的，我们可以使用码云来作为中转站

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/170557-580438.png)

选择 从 GitHub中导入仓库

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/170712-491904.png)

此时使用下载速度变得非常的快，但是码云对仓库大小有一定限制，所以太大的仓库用这个
方法不行

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/170803-598586.png)

## 使用cnpmjs镜像

这个方法更加的简单,只需要修改你的路径`github.com`为`github.com.cnpmjs.org`

```sh
git clone https://github.com/XXX/XXX.git

## 使用cnpmjs
git clone  https://github.com.cnpmjs.org/XXX/XXX.git
```

## 使用jsdelivr加速

jsdelivr可免费提供CDN加速，我们一般用来给自己的博客加速，或者制作一个免费的图床

同样的它也可以加速我们的GitHub，当我们要快速获取项目中的某个文件的时候就可以使用
这个方式

它的使用也非常简单，我们将`github.com`修改为`cdn.jsdelivr.net`同时将`/blob/`修改
为`@`

```sh
https://github.com/vuejs/vue/blob/dev/README.md

## 使用jsdelivr
https://cdn.jsdelivr.net/gh/vuejs/vue@dev/README.md
```

此时速度就非常快了
