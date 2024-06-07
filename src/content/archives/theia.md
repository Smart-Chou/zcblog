---
title: Eclipse Theia初体验
description: Eclipse Theia初体验
pubDate: 2021-01-11
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Theia
---

hello大家新的一年好啊！这是我2021年的第一个视频，最近也是比较忙，今天要和大家分
享一个非常有趣的开源项目，也就是最近很多人 “扬言” 要替代vscode的IDE工具，全名是
Eclipse Theia（不要纠结我的发音）

相信大家大学的时候或多或少都体验过Eclipse，玩过的朋友可以打个1；其实严格来说
Vscode并不算是一个IDE，而是一个高级的记事本，但是他的拓展实在是多，生态丰富，逐
步就成为了一个完善的开发工具

至于为什么我说是学习神器，我们先体验一下再说

今天要大家一起体验一下这个Theia，首先来
到[项目地址](https://github.com/eclipse-theia/theia)可以从标题看到这是一个主打
云端和本地 以及自定义的工具，今天先体验一下云端版本吧！

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/231937-610701.png)

看这个界面其实和vscode是差不多的，其实vscode本来就有开源的云端版
本[code-server](https://github.com/cdr/code-server),可以
从[che-incubator.github.io](https://che-incubator.github.io/vscode-theia-comparator/status.html)这
个网页相对直观的比较Theia和vscode的区别，废话不多说我们跟着官方文档跑一个项目来
试一试吧

文档提供了Docker的启动方式，这就很舒服了，直接一个命令就跑起来吧

```sh
# Linux, macOS, or PowerShell
docker run -it --init -p 3000:3000 -v "$(pwd):/home/project:cached" theiaide/theia:next

# Windows (cmd.exe)
docker run -it --init -p 3000:3000 -v "%cd%:/home/project:cached" theiaide/theia:next
```

然后直接`http://localhost:3000/`打开界面，这是web的使用方式

随便写点东西保存预览，整个流程非常的流畅

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/232429-377426.png)

里面的拓展和设置都是和vscode一样的，并且是兼容vscode的插件的

很多人就是会问好好的vscode不用，折腾这些东西干什么，其实我觉得存在即合理

假如你有一个学生机服务器，或者你们的校园局域网是通的，跑一个服务在服务器或者是自
己电脑上面，上机房课再也不用折腾环境了，回到寝室也可以马上继续开发；但是我觉得更
多的作用其实是厂家的二次开发，比如小程序开发工具、各种特定语言的开发工具，都可以
很方便的进行二次开发和优化；还有一些编程类的网站，放上一个Cloud IDE，调试是不是
就更加的方便了呢

好的今天的内容就到这里，如果视频对你有帮助的话可以给我一个三连！
