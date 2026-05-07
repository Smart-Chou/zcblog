---
title: Windows Office 安装指南
description: Windows Office 安装指南
pubDate: 2021-09-10
image:
    url: "https://pic-api.marxchou.com/api/random?m3L6zF"
    alt: "wait-this-is-not-my-commit"
tags:
    - Windows
---

**前言**：Office 是日常办公必需品，目前新买到的笔记本都会自带正版
`Office 2019 家庭中文版`，而且只需要拿邮箱激活一次，之后重装电脑只需要登录激活的
邮箱账号即可自动激活，这里简单记录一下下载 `Office` 的步骤。

## 使用工具

`Office Tool Plus`

> Office Tool Plus 基于 Office 部署工具制作，除此之外还集成了各种实用性工具帮助
> 用户部署和管理 Office.

[Office Tool Plus 官网](https://otp.landian.vip/zh-cn/)

[帮助文档](https://help.coolhub.top/zh-cn/)

工具代码开源，地址[点这里](http://github.com/YerongAI/Office-Tool)

## 步骤

### 首先下载并解压工具

推荐下载包含框架的版本，不需要安装额外依赖，下载解压后运行文件夹内 `RunMe.bat`

![运行程序](/assets/note/ffa19825ae00efca7552a8729e66a9e1.png)

1. 选择 `部署` 按钮，进去后看到如下界面

![部署界面](/assets/note/f8bf6513ec310c10d22b7ed678ef50b8.jpg)

选择需要安装的版本以及需要安装的应用，如 `Word` `Excel` `PowerPoint`，添加需要安
装的语言，之后点击 `开始部署` 即可开始安装。

1. 安装完成后登录第一次激活时的 `Office` 账号即可使用
2. 若没有账号，可使用工具内的激活工具

首先点击主界面的 `代码` 按钮

![主界面代码](/assets/note/073774c8eb6da29f7d92d33e5888eeee.jpg)

然后在红框内输入如下代码按回车，等待激活结束

```
/osppilbyid MondoVolume /osppsethst:kms.loli.beer /osppsetprt:1688 /osppact
```

`Office Tool Plus`还提供了许多常用工具，可以解决日常使用中的许多问题，工具官方页
面也有[帮助文档](https://help.coolhub.top/zh-cn/)，以
及[新手教程](https://www.coolhub.top/archives/42)，自行探索。
