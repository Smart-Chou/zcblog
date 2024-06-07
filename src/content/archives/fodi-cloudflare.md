---
title: 在 Cloudflare 部署 FODI 后端
description: 在 Cloudflare 部署 FODI 后端
pubDate: 2021-11-02
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - FODI
---

之前写过一个基于`腾讯云 SCF` 的 OneDrive 列表程序 [FODI](/document/fodi.md)，现
在腾讯云要收费了，每月至少 8 毛钱，虽然不多，但既然 Cloudflare 仍是免费的，不如
移植一下，反正只是改改入口。

:::danger 突然白屏 `refresh_token`有效期 3 个月，如突然无法打开，请
[重设后端代码](https://logi.im/fodi/get-code/)。~~计划使用 Github Action 自动更
新，还没开始写，请耐心等待。~~ 现已支持自动续期，请展开下方迟到的自动续期查看
（如果是初次部署，请阅读完其它部分再看）。迟到的自动续期 :::

::: details 迟到的自动续期之前，`FODI` 每过 3 个月要重设后端代码，原因是
`Cloudflare Worker` 是 `Serverless` 环境，不支持持久化存储。刚编写 `FODI`
时，`Cloudflare KV` 还处于收费状态，如果使用第三方免费存储则担心可用性和延迟问
题。

考虑过使用 `CI` 定时更新环境变量但一直没有动工，想着整体重构后一并添加。但现在重
构意愿不强了，`Cloudflare KV` 免费服务也已推出一段时间，于是添加几句代码，让它支
持 `Token 自动续期`。

## 重设后端代码

首先，打开 [部署助手](https://logi.im/fodi/get-code/)，按照页面上方步骤重设
`Worker` 代码。

## 创建 KV 命名空间

保存好代码后，切换到顶部菜单栏的 KV 标签。在 命名空间名称 下方的输入框中输入
FODI_CACHE，随后点击右边蓝色的 `添加` 按钮。

![a64a4c6e8fa445dd91353d75ddd3dc04.png](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/a64a4c6e8fa445dd91353d75ddd3dc04.png)

## 添加 KV 命名空间

在 Worker 中绑定 KV 转到 FODI Worker 脚本的 `设置` 页面，点击页面中部
`KV 命名空间绑定` 项目右侧的 添加绑定 按钮。

![添加命名空间绑定](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/bef907bec3404f89875ee85aa657a563.png)

在 `变量名称` 下方的输入框键入 `FODI_CACHE`，`KV 命名空间` 下拉框也选择
`FODI_CACHE`，最后点击 `保存`。

![设定变量名称](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/ece08d93814a415f8436b6596e35810c.png)

## 添加续期计划任务

转到设置左边的 `触发器` 面板，点击页面右边蓝色的 `添加 Cron` 触发器 按钮。

![添加触发器](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/d39848e511a743368ae9fb188cf216e5.png)

切换到 `添加 Cron 触发器` 项目的 `Cron` 标签，在 **Cron** 下方输入框键入
`0 0 1 * *`，最后点击右下方蓝色的 `Add Trigger` 按钮。

![保存触发器](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/91466f9f4d2a45e9a1452d67397839bd.png)

## 验证 Token 是否保存

现在打开你的 FODI 前端等待网页列出文件后，再次进入 `KV` 面板，点击页面中部
`FODI_CACHE` 右侧的 查看。

![查看 KV](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/00deeb5a8d0c4911ba64213850669df3.png)

当看到 `token_data` 时，表明代码工作正常，不出意外，以后都不再需要手动续期。

![token_data](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/a928638713ce497d9c55c85102a3dc24.png)

:::

## 演示地址

- [主页](https://logi.im/fodi.html)
- [图片/音频/视频](https://logi.im/fodi.html?path=/Media/Music/Jay%20Chou/%E4%B8%8D%E8%83%BD%E8%AF%B4%E7%9A%84%E7%A7%98%E5%AF%86)

## 注册 Cloudflare 并创建 Workers

打开 [Cloudflare 注册页面](https://dash.cloudflare.com/sign-up)，输入 `邮箱` 和
`密码` 后点击 `Create Account`，进入下个页面后直接点击左上角的 `CLOUDFLARE` 图标
进入控制面板主页，不要进行其他操作。

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/feea00008a220626610f)

进入主页后，点击靠近右下角的 `Workers`。

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/ffb20001f67505de8458)

此时系统会建议你修改子域名，直接点击 Set up，随后点击弹出对话框中的 Confirm。

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/ff89000099fb8b529539)

之后会进入套餐选择页面，页面往下拉，找到 Continue with free，点击它。

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/ffb100005abae0d840ab)

完成上述步骤后，系统会发送确认邮件到你的注册邮箱，请自行登录邮箱，找到相关邮件，
点击其中的确认链接，完成确认。

## 上传 FODI 后端

完成邮箱验证后，再次点击左上角的 `CLOUDFLARE` 图标进入控制面板主页，点击右下角的
`Workers`。

现在点击页面中间你刚刚创建的函数，进入代码编辑界面，随后打开
[FODI Deployment Helper](https://logi.im/fodi/get-code/)，按照指引生成并复制代
码，粘贴到下图的代码编辑器中。

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/febe0000b03f9a04a181)

填写完毕后，点击页面中下部的 `Save and Deploy`。

## 部署 FODI 前端

前端部署方法和老文章相同，见 通过 [Github Pages 部署前端](/document/fodi.md) 章
节。

唯一不同的是 `SCF 网关地址` 要换成 `Cloudflare` 的，右击下图箭头，选择 复制链接
地址 即可获得。

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/fe95000135f4d98e2270)

最后如果这个项目帮到了你，不妨到 [Github](https://github.com/vcheckzen/FODI) 为
我点颗星。
