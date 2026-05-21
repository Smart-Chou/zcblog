---
title: 宝塔面板部署 Vaultwarden 密码管理服务
description: 基于宝塔面板 + Docker 自建轻量级 Vaultwarden 密码管理服务，兼容 Bitwarden 全平台客户端。
pubDate: 2026-04-01
upDate: 2026-05-21
image:
  url: "../../assets/coverimage/bitwarden.png"
  alt: "Vaultwarden 密码管理服务"
tags:
  - Vaultwarden
  - Bitwarden
  - 密码管理
  - Docker
  - 宝塔面板
---

## 前言

以前我用 KeePass 配合坚果云 WebDAV 同步，桌面端体验一般，浏览器插件也不太好用。后来了解
到 [Bitwarden](https://bitwarden.com/)，开源免费、全平台支持，官方还提供了 Docker 镜像可以
自建服务端。

不过官方镜像要求服务器内存 2G 以上，对于轻量云服务器有点吃力。社区用 Rust 重写
的 [Vaultwarden](https://github.com/dani-garcia/vaultwarden) 把资源要求降到了 512MB，功能上
完全兼容 Bitwarden 所有客户端。

:::tip
这个项目原名 `bitwarden_rs`，后来改名为 `vaultwarden`。如果你看到旧教程里用
`bitwardenrs/server` 镜像名，替换成 `vaultwarden/server` 即可。
:::

## 准备工作

开始部署之前，先确保以下环境就绪：

- **宝塔面板** 已安装，推荐 LNMP 环境
- **一个域名** 解析到服务器，创建站点并配置好 SSL 证书
- **Docker** 已安装（可以直接在宝塔软件商店装「Docker 管理器」）

## 教程开始

### 安装 Docker 管理器

宝塔面板 → 软件商店 → 搜索「Docker 管理器」→ 安装。安装完默认就是运行状态。

![安装 Docker 管理器](/assets/note/23bb13c6fa48ab4f5e31a1edaecb9183.png)

### 拉取镜像

打开 Docker 管理器 →「镜像管理」→「获取镜像」。国内服务器可以先配置镜像加速：

![加速镜像](/assets/note/d6942180db67cc4f239768b63fa9011e.png)

加速地址填：

```
https://docker.mirrors.ustc.edu.cn/
```

然后在输入框填入镜像名 `vaultwarden/server`，点击获取。

![拉取镜像](/assets/note/15103da79c7d963851b56b3b3cfd93c0.png)

镜像不大，几十 MB，很快就能拉下来。

### 创建容器

「容器列表」→「创建容器」，按以下参数填写：

![创建容器](/assets/note/c86e6a6a47d8b721af5a5217c4c35991.png)

| 参数 | 值 | 说明 |
|------|-----|------|
| 容器端口 | `80` | 容器内 Web 服务端口 |
| 服务器端口 | `6789`（可自定义） | 宿主机映射端口，后面反代要用 |
| 服务器目录 | 站点目录（如 `/www/wwwroot/你的域名/`） | 数据存这里，方便备份 |
| 容器目录 | `/data` | 固定值，不用改 |
| 内存配额 | 按服务器配置填 | 建议 256MB 起步 |

:::warning
端口映射和目录映射填完一定要点 `+` 添加，不然不会生效。
:::

提交后把容器名称改成 `vaultwarden`，方便后续操作。

![修改容器名称](/assets/note/d23d21a60e849970b31cd624655e86b6.png)

命令行的同学可以直接跑：

```shell
# 拉取镜像
docker pull vaultwarden/server:latest

# 创建容器
docker run -d --name vaultwarden \
  -v /www/wwwroot/你的域名/:/data/ \
  -p 6789:80 \
  vaultwarden/server:latest
```

### 配置反向代理

站点设置 →「反向代理」→ 目标 URL 填 `http://127.0.0.1:6789`，提交。

![添加反向代理](/assets/note/daa0696a7c7c54a11348dfb99d14ef0d.png)

> 端口号 `6789` 就是上一步填的服务器端口，保持一致就行。

### 创建账号

现在用域名访问站点，应该能看到登录/注册页面了：

![网站页面](/assets/note/9e9a372c88a990d5628adbbb1fbc3fe0.png)

点击「创建账号」，填邮箱和主密码完成注册。**主密码一定要记牢，丢了没法找回。**

### 关闭公开注册

部署完建议把注册关掉，免得被别人滥用。

在容器列表里**先停止再删除**当前容器：

![停止并删除容器](/assets/note/a6397ebd7a7f1849a43a53f001e846cd.png)

:::warning
一定先停止再删除，直接删可能导致数据问题。
:::

然后重新创建，这次加上 `SIGNUPS_ALLOWED=false`：

```shell
docker run -d --name vaultwarden \
  -e SIGNUPS_ALLOWED=false \
  -v /www/wwwroot/你的域名/:/data/ \
  -p 6789:80 \
  vaultwarden/server:latest
```

创建完重启一下：

```shell
docker stop vaultwarden
docker start vaultwarden
```

:::tip
重新创建容器后如果之前注册的账号登不上，再完整走一遍「停止 → 删除 → 创建 → 启动」就好。
:::

## 客户端使用

1. 去 [Bitwarden 下载页面](https://bitwarden.com/download/) 装客户端或浏览器插件
2. 登录界面点左上角设置图标，服务器地址改成你的域名

![浏览器插件页面](/assets/note/1865d83b4adc665f282220d92dae3d47.png)

![自定义服务端](/assets/note/fe8842629a33089b0c62d179dde3f678.png)

3. 用刚才注册的邮箱和主密码登录

Bitwarden 的 iOS、Android、Windows、macOS、Linux 客户端和浏览器插件全部兼容 Vaultwarden，
跟用官方服务没区别。

## 后续维护

### 更新

新版本发布后，拉最新镜像重建容器就行，数据目录不受影响：

```shell
docker pull vaultwarden/server:latest
docker stop vaultwarden
docker rm vaultwarden
docker run -d --name vaultwarden \
  -e SIGNUPS_ALLOWED=false \
  -v /www/wwwroot/你的域名/:/data/ \
  -p 6789:80 \
  vaultwarden/server:latest
```

### 备份

所有数据都在映射的服务器目录里，定期打个压缩包就行：

```shell
tar -czf vaultwarden-backup-$(date +%Y%m%d).tar.gz /www/wwwroot/你的域名/
```

更详细的配置（SMTP 邮件通知、WebSocket、管理员面板等）可以看 [Vaultwarden Wiki](https://github.com/dani-garcia/vaultwarden/wiki)。

## 相关文章

- [Bitwarden 帮助中心 — 自托管指南](https://bitwarden.com/help/self-host-vaultwarden/)
- [Vaultwarden Wiki 中文版](/project/vaultwarden/)
- [Docker Hub — vaultwarden/server](https://hub.docker.com/r/vaultwarden/server)
