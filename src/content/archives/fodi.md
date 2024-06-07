---
title: FODI，一款 OneDrive 秒级列表程序
description: FODI，一款 OneDrive 秒级列表程序
pubDate: 2021-07-08
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - FODI
---

::: warning腾讯云停止维护，请部署 [Cloudflare](/document/fodi-cloudflare.md) 版
:::

FODI，Fast OneDrive Index 的缩写，意为 OneDrive 快速列表，是我自用的一版
OneDrive 列表程序。相较于其他程序，此版列表速度极快，且无需服务器，部署极为简
单，当然，除此之外都是缺点。

## 演示地址

- [主页](https://logi.im/fodi.html)
- [图片/音频/视频](https://logi.im/fodi.html?path=/Media/Music/Jay%20Chou/%E4%B8%8D%E8%83%BD%E8%AF%B4%E7%9A%84%E7%A7%98%E5%AF%86)

## SCF 简介

腾讯云云函数（ ==Serverless Cloud Function，SCF== ）是腾讯云为企业和开发者们提供
的无服务器执行环境，帮助您在无需购买和管理服务器的情况下运行代码，是实时文件处理
和数据处理等场景下理想的计算平台。您只需使用 `SCF` 平台支持的语言编写核心代码并
设置代码运行的条件，即可在腾讯云基础设施上弹性、安全地运行代码。

无服务器（`Serverless`）不是表示没有服务器，而表示当您在使用 `Serverless` 时，您
无需关心底层资源，也无需登录服务器和优化服务器，只需关注最核心的代码片段，即可跳
过复杂的、繁琐的基本工作。核心的代码片段完全由事件或者请求触发，平台根据请求自动
平行调整服务资源。`Serverless` 拥有近乎无限的扩容能力，空闲时，不运行任何资源。
代码运行无状态，可以轻易实现快速迭代、极速部署。

腾讯云 `SCF` 目前仍在
[公测](https://cloud.tencent.com/document/product/583/17299) 阶段，所有用户可免
费使用，结束日期待定。公测结束后，每月仍可享受足量的
[免费资源使用量和免费调用次数](https://cloud.tencent.com/document/product/583/12282)，
但收取 `外网出流量` 费用。

|  资源类型  | 每月免费额度 |
| :--------: | :----------: |
| 资源使用量 |  40 万 GBs   |
|  调用次数  |   100 万次   |

所谓**外网出流量**，即程序通过 `SCF` 访问外部网络的流量，对于本程序即请求微软
API 的流量，每次调用从`几 B` 到`几 KB` 不等；文件上传下载直接与微软交互，不经过
`SCF`。

下图（老图可能与描述不符）是我一天的使用量，大概调用了 10000 次，如果是 30 天就
是 30 万次，还不到免费额度的 1/3。资源使用量 1000 GBs，30 天就是 3 万 GBs，远低
于 40 万 GBs。外网出流量 0.05G ，一个月大概是 1.5 G，按照
[正式收费标准](https://cloud.tencent.com/document/product/583/12281) 0.8 元 /
G，每月要支付 1.2 元的出流量费用，完全可以接受（目前不会收取）。

![YL51PJT6NML6PZW](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/affd65fa8e220bf2.png)

## 获取 refresh_token

进入
[该网址](https://service-36wivxsc-1256127833.ap-hongkong.apigateway.myqcloud.com/release/scf_onedrive_filelistor)/[世纪互联版点这个](https://service-gzs9xkdm-1256127833.ap-hongkong.apigateway.myqcloud.com/release/onedrive-token-cn)，
点击其中的 `Get a refresh_token`，在打开的微软账号登录页面中，填写你的
`OneDrive` 账号和密码，完成登录。

![C6QSEL5POOL75U](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/2c65ab509bb73465.png)

稍等片刻页面将返回 refresh_token，复制它备用。

![C6QSEL5POOL75U](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/220f0d790f980277.png)

## 填写 refresh_token

下载并解压
[FODI](https://github.com/vcheckzen/FODI/archive/refs/heads/master.zip) 源码，随
后进入文件夹，用记事本打开 `back-end-py/main/api/fodi.py`，将上一步得到的
`refresh_token` 粘贴进，下图所示的 `ONEDRIVE_REFRESH_TOKEN` 对应的双引号之间。

如需设置网盘展示的根目录，则填写第 10 行的 `EXPOSE_PATH` 变量，如 `/媒体/电影`，
全盘展示请留空。填写完毕后注意 保存。

![UUU{L_%MUDV1I}YSTPXZ2.png](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/157572337379391044.jpg)

## 创建函数服务

以浏览器 `隐身模式` 登录
[腾讯云 SCF](https://cloud.tencent.com/login?s_url=https%3A%2F%2Fconsole.cloud.tencent.com%2Fscf%2Flist)
控制台（在此之前要完成腾讯云 **实名认证**），点击左侧菜单栏的 `函数服务`，接着点
击顶栏的地区选择下拉框，选择 `香港或新加坡`，因为国外访问 `OneDrive` 较快。接着
点击蓝色的 `新建` 按钮，创建函数。

![create_a_function](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/c193a7a039e82f6e.png)

随后在新建函数页面填写 `函数名称`，名字随意；运行环境 选择 `Python3.6`；创建方式
选择 `模板函数`；选择 `helloworld` 模板，最后点击最下方的 `下一步`。进入
`② 函数配置` 页面后不做任何修改，直接点击 `完成`。（下面这张是之前的老图，与描述
不符，不要照搬）

![GXVWO~RYU4QSIHM](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/aac10c9eab43d942.png)

## 上传函数代码

点击 SCF `函数代码` 面板，将 `提交方法下拉框` 的值改为 `本地上传文件夹`。点击
`上传`，选择 解压文件夹内的 `back-end-py`，待上传完毕后点击 `保存`。注意，上传的
是 `back-end-py` 文件夹，不是整个项目。

![D5OFS6O`X7}$VW)B3$UTQA.png](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/1d30dd4b9ce9d475.png)

## 添加触发方式

进入函数服务的 触发方式 面板，点击 `添加触发方式`。选择触发方式下拉框中的
A`PI网关触发器`，勾选下方的 `启用集成响应`，点击 `保存`。

![SC6P6OFK7IBS34.png](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/7cbe89ce911aff9f.png)

稍等片刻，下方会出现一个 访问路径，点击打开它。

![2UVQ5HV13S956IWG72.png](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/b2977f4e630803b3.png)

片刻，你将看到如下 JSON 数据（部分数据被省略），否则必须重新上传。

```json
{
  "code": -1,
  "error": "path error.",
  "examples": [
    ".../ciba/",
    ".../proxy/",
    ".../dnspod/",
    ".../wechat-step/",
    ".../lanzous/",
    ".../cloudmusic/",
    ".../aes/",
    ".../qr/",
    ".../fodi/"
  ]
}
```

## 通过 Github Pages 部署前端

前端仅是一个 `HTML` 文件，可放到任意静态服务器，此处通过 ==Github Pages== 部署，
部署完成后可通过 `username.github.io` 打开你的网盘。

注册并登录 [Github](https://github.com/join)，随后打开
[该仓库](https://github.com/vcheckzen/FODI-FRONT-END)，点击靠近右上角的 `Fork`。
稍等片刻，打开页面中部的 `index.html`。

![YSGWFV6I8ZRF7FK.png](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/4a9ce41b6920475d.png)

点击靠近 **右上角** 的 `铅笔` 按钮，编辑该文件。

![fafdafdafQA.png](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/743de165e87e8bab.png)

将你的 `函数 API 网关访问路径` 填写到 `index.html` 的 `SCF_GATEWAY` 变量对应的引
号中。`SITE_NAME` 变量是 `站点名称`，可以随意修改。

![U69DAL0U9D9.png](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/69db0a328c6c3e03.png)

![abc](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/87175f85c8403942.png)

填写完毕后点击靠近页面最下方的 `Commit changes`。

![56PLO1DV2P4WRP6B.png](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/72e92de2f4ad12f1.png)

点击靠近页面右上角的 `Settings`，将 `Repository name`改成 你的
`Github 用户名.github.io`，随后点击 `Rename`。

![S16VV48O8MHD6KYB5D.png](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/67833a2afe813604.png)

下拉该页面，找到 `Github Pages`，将 `Source` 下拉框的值改成 `master branch`，如
果没有则无需修改。

![R6NLINVXYJ5LEP59.png](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/b8a6c84311f74234.png)

现在，就可以通过 你的 Github 用户名.github.io 访问网盘了。

## 加密文件夹

在某个文件夹下添加 `.password` 文件，里面写入密码，即可加密该文件夹。注意文件必
须以 `UTF8NoBOM` 编码，且密码前后不能有空格或空行，Windows 下可通过以下方式生
成：

在待加密文件夹下按住 `Shift` 键的同时，鼠标右击文件夹空白处，选择
`在此处打开 Powershell 窗口(S)`，接着执行以下命令，其中 `1234` 便是密码。

```sh
'1234' | Out-File -FilePath .password -Encoding ascii -NoNewline
```

> 最后，如果你觉得这个项目还行，请到 [Github](https://github.com/vcheckzen/FODI)
> 为我加颗星。
