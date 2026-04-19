---
title: 使用宝塔docker安装为知笔记私有部署
description: 使用宝塔docker安装为知笔记私有部署
pubDate: 2021-09-18
image:
  url: 'https://pic-api.marxchou.com/api/random?7W4s2b'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Wiz
---

之前使用的语雀客户端最近同步很有问题,遂弃坑,搞起来之前用的为知笔记。官方提供了
docker镜像可以私有部署，配合 **宝塔docker** 安装非常方便。

## 正文开始

前情提示，`wiznote`对性能有略微要求，建议内存`2G`及以上服务器部署。（运行起来大
概占了`800M`内存）

本文仅针对`Linux 宝塔面板`。

`Windows`及`Linux`原生部署请查看**为知官方文
档**:[为知笔记服务端docker镜像使用说明](https://www.zmki.cn/go/?url=https://www.wiz.cn/zh-cn/docker)

## 教程开始

### 去宝塔面板软件商店里安装Docker管理器

默认不出问题安装完成后直接就正常运行。如果运行状态 未运行的话可以使用`SSH`执行命
令

```sh
sudo systemctl restart docker
```

然后在镜像管理- 获取镜像 输入名称: `wiznote/wizserver` 获取官方镜像

![插图](/assets/note/20200903-cdfc95cfd4c1c.png)

`WizNote`镜像大概`1.6G`,运行后会自动下载镜像,下载完之后才会出现在镜像管理里。
（下载约`10分钟`左右，根据你的`服务器带宽速度`）

### 下载完成后在容器列表内,创建容器

`Docker`端口映射填写`80` ，后边的服务器端口根据你的需要填写。（安装完的访问格式:`IP:端口`）

目录映射如下,选着同步的文件即可。

![插图](/assets/note/20200903-7b24562c96d55.png)

内存分配建议`800MB`以上,太小了跑不起来。`CPU`根据实际情况分配

然后提交后 等待`2~3分钟`即可完成启动,访问上边我们映射的端口进入即可。`IP+端口`
如图上就是`127.0.0.1:1234`

启动成功访问就会进入到为知笔记页面.如图:

![插图](/assets/note/20200903-ede43bd641f49.png)

### 使用宝塔面板反向代理,自定义域名访问

上边安装完成了,但是一直通过ip加端口访问未免有些奇怪。利用宝塔的反向快速绑定域
名。

在宝塔里新建一个站点,然后给创建反向代理,如下:

![插图](/assets/note/20200903-8d6c4b06ae208.png)v

到这一步基本已经大功告成了。如果需要开启SSL。请看下边

### 开启SSl,配置Https

首先就是现在反向代理的那个域名下 开启SSL

![插图](/assets/note/20200903-5c30b7eb65c6d.png)

然后在这个域名下的反向代理里边修改配置

```nginx title="nginx.conf"
# 将宝塔反代配置文件的proxy_set_header全部替换:
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header x-wiz-real-ip $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header Host $http_host;
proxy_set_header X-Forwarded-Proto $scheme;
```

测试`HTTPS`是否生效

访问 `https://你的域名/?p=wiz&c=endpoints`

正常情况下，会返回一个 `json` 数据，检查第一个 `key wizas` 的值，应该是 `https`
开头。如果是 `http` 开头，则说明配置没有生效。

![插图](/assets/note/20200903-0e253f7fc0ec4.png)

### 至此,部署完成

默认管理员账号：`admin@wiz.cn`，密码：`123456`

![插图](/assets/note/20200903-1800905715d10.png)

## 相关文章

官方文
档:[为知笔记服务端docker镜像使用说明](https://www.zmki.cn/go/?url=https://www.wiz.cn/zh-cn/docker)

盛夏博
客:[LeaNote&WizNote:基于宝塔面板搭建私有云笔记](https://www.zmki.cn/go/?url=https://sumrday.net/exp/LeaNote-WziNote-quick-build.html)

青风流
云:[【Docker】利用宝塔docker管理器搭建为知笔记(docker安装为知笔记)](https://www.zmki.cn/go/?url=https://www.idkzr.com/archives/52/)

LengYues'Blog:
[搭建为知笔记 Docker 版，以及注意事项](https://www.zmki.cn/go/?url=https://www.apkdv.com/build-docker-version-of-knowledge-notes-and-precautions.html)

官方文
章:[使用云存储来保存笔记数据(WizNote)](https://www.zmki.cn/go/?url=https://www.wiz.cn/zh-cn/docker-using-object-storage)
