---
title: 宝塔面板部署 Bitwarden 密码管理软件
description: 宝塔面板部署 Bitwarden 密码管理软件
pubDate: 2021-10-01
image:
  url: 'coverimage/bitwarden.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Bitwarden
---

## 自建 Bitwarden 密码管理服务

:::tip
更新记录目前项目名称已更换为 `vaultwarden`
:::

### 前言

如今越来越多的账号使得我们拥有非常多的密码，密码多起来难免会出现忘记、记错等情
况。有的朋友像我一样密码全都设成同一个，虽然好记，但是如果一个密码泄露，那么你就
需要花时间修改所有的密码，而且也非常不安全。

另外有的朋友设置密码会采用 “**平台名 + 自己独有的加密方式**”，这样确实相对安全好
记，但是每次输密码需要再加工一下，对我来说有点麻烦。

最后就是使用密码管理软件，省心又方便，使用密码管理软件的好处如下：

- 一键生成复杂密码，提高安全度
- 自动填充密码，比较方便
- 多设备同步
- 可检测密码是否已经泄露

而这样的管理软件也非常多，又需要进行选择。

## 选择过程

最开始在 Android 上使用的一个 `APP` 名为[账号本子](https://www.coolapk.com/apk/com.wei.account)，但没法满足自己的要求。

后来发现了 [Keepass](https://keepass.info/)，使用了很长一段时间。

:::tip[这里稍微介绍一下 Keepass]

`Keepass` 是一款开源、免费的密码管理软件，同时拥有众多插件。`Keepass` 将密码存储
到一个数据库，同时设置一个主密码或是密钥文件，只需要记住主密码或者传入密钥文件即
可解锁数据库，目前的密码管理软件基本也都是这种方式。

:::

我使用的时候采用的是使用 `坚果云`同步备份，同时设置 `WebDAV` 密码，在手机上通过
`Keepass2Android` 应用 以 `WebDAV` 方式登陆。这样做当你修改了数据库，会立马同步
到 `坚果云`，也是比较方便的。

之后更换了设备，`iOS` 上支持 `Keepass` 的客户端也有很多，但大多不再更新，只有一
款名为[奇密](https://apps.apple.com/us/app/fantasypass-ikeepass/id1357961740)的
`APP` 使用起来非常顺手。

但是 `Keepass` 的桌面端使用起来不是很方便，加上浏览器插件支持也不是很好，因此开
始更换软件。

中途使用 `Google` 的密码管理，但是更换手机后不太方便，而我的电脑又不是 `Mac`，因
此 `钥匙串`也不适合我。

同类软件中如 `1Password`, `Lastpass` 都有很大的用户群体，其中 `1Password` 全平台
支持优秀，但是花费不小，而 `Lastpass` 前几日公布免费用户只支持一种类型的设备间同
步，因此 `Bitwarden` 的优势则体现了出来。

## Bitwarden 简介

[Bitwarden](https://bitwarden.com/) 是一款免费开源的密码管理软件，同时官方提供了
`docker` 镜像，将服务端部署在自己的设备上，正好前段时间的腾讯云轻量活动机用得
上。遂选择自建 `Bitwarden`。

`Bitwarden` 官方 `docker` 要求服务器内存在 `2G` 以上，但有大佬使用 `Rust` 进行重
写，项目名为 [vaultwarden](https://github.com/dani-garcia/vaultwarden)，降低了配
置要求。

最近把原作者的项目Wiki，由英文翻译到中文，详细内容可以
看[Vaultwarden Wiki 中文版](/project/vaultwarden/)

## 部署

这里通过 `宝塔面板`和 `Docker` 共同完成。

### 准备工作

1. 首先安装好`宝塔面板`并配置好环境，这里采用的是 `LNMP`，`PHP` 版本 `7.4`

:::tip[建议]

如果不是特别担心密码安全，还是建议使用官方服务端，自建和官方并没有什么差别

勤备份也会避免很多问题

:::

1. 解析好一个二级域名，并且创建一个站点，配置好 `SSL` 证书
2. 安装好 `docker`，也可直接使用下面的 `Docker 管理器`

### 安装 Docker 管理器

在软件商店第 `3` 页 找到 `Docker 管理器`并安装。

![安装 Docker 管理器](/assets/note/23bb13c6fa48ab4f5e31a1edaecb9183.png)

### 获取镜像

打开 `Docker 管理器`，点击 `镜像管理`，再点击 `获取镜像`，如果是国内机器可以使用
镜像加速

![加速镜像](/assets/note/d6942180db67cc4f239768b63fa9011e.png)

这里使用的镜像加速地址如下：

```shell
https://docker.mirrors.ustc.edu.cn/
# 也可自行寻找其他地址
```

然后将以下镜像名称填入输入框：`vaultwarden/server`，之后点击 `获取镜像`。

![拉取镜像](/assets/note/15103da79c7d963851b56b3b3cfd93c0.png)

### 创建容器

1. 点击`容器列表`→`创建容器`，弹出创建容器界面后按如下填写四部分内容：

![创建容器](/assets/note/c86e6a6a47d8b721af5a5217c4c35991.png)

- 容器端口为 `80`
- 服务器 (TCP) 端口可以自定义，这里使用 `6789`
- 服务器目录自定义，这里使用站点目录
- 容器目录填写 `/data`
- 内存配额按照自己服务器配置填写

:::tip
端口映射和目录映射填写完成记得点击 `+` 添加，否则无效 
:::

1. 点击提交按钮创建容器
2. 修改容器名称以便之后操作，这里使用 `vaultwarden`

![修改容器名称](/assets/note/d23d21a60e849970b31cd624655e86b6.png)

**上述步骤也可直接使用命令安装（前提已安装 `docker`）**

```shell
# 安装 vaultwarden/拉取镜像
docker pull vaultwarden/server:latest
# 创建容器
docker run -d --name vaultwarden -v /www/wwwroot/domain.com/:/data/ -p 6789:80 bitwardenrs/server:latest
```

### 添加反向代理

在站点设置添加反向代理

![添加反向代理](/assets/note/daa0696a7c7c54a11348dfb99d14ef0d.png)

`目标 URL` 填写 `http://127.0.0.1:6789`，端口即为上边服务器的端口，之后点击提交

### 创建账号

此时即可通过域名访问服务

![网站页面](/assets/note/9e9a372c88a990d5628adbbb1fbc3fe0.png)

点击创建账号，填写相应信息即可完成注册

### 开始使用

1. 在官网[下载页面](https://bitwarden.com/download/)下载相应的客户端或者浏览器插
   件
2. 在设置中填写服务端地址

![浏览器插件页面](/assets/note/1865d83b4adc665f282220d92dae3d47.png)

![自定义服务端](/assets/note/fe8842629a33089b0c62d179dde3f678.png)

1. 登陆账号

### 关闭注册

如果不希望别人注册账号可通过如下操作

1. 首先在管理器中停止容器
2. 删除容器

![停止并删除容器](/assets/note/a6397ebd7a7f1849a43a53f001e846cd.png)

:::warning
一定先停止再删除
:::

1. 运行如下命令再次创建容器

```shell
docker run -d --name vaultwarden -e SIGNUPS_ALLOWED=false -v /www/wwwroot/domain.com/:/data/ -p 6789:80 vaultwarden/server:latest

# name 后参数为容器名称
# v 后参数为上边填写的容器目录
# p 后参数为`服务器端口:容器端口`
```

1. 重新启动一下容器

```shell
docker stop vaultwarden
docker start vaultwarden
```

完成后就关闭了注册功能，所以一定要在这步之前注册账号

:::tip
如果重新创建容器后登陆出现问题，记得重启一下容器如果出现重新创建容器后注
册的账号无法登录的情况，在命令行上进行相关操作 (停止、删除、创建) 即可解决
:::

## 更新

如果需要更新，直接拉取最新镜像，停止并删除旧容器，创建新容器

```shell
# 拉取最新镜像
docker pull vaultwarden/server:latest
# 停止旧容器
docker stop vaultwarden
# 删除旧容器
docker rm vaultwarden
# 创建新容器
docker run -d --name vaultwarden -e SIGNUPS_ALLOWED=false -v /www/wwwroot/domain.com/:/data/ -p 6789:80 vaultwarden/server:latest
```
