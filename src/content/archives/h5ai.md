---
title: h5ai服务器目录搭建详细教程以及各种坑的解说
description: h5ai服务器目录搭建详细教程以及各种坑的解说
pubDate: 2020-10-13
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - 云盘
---

最近一直想折腾`h5ai`服务器`目录`或者一种分享的工具，但是一直没有处理，最近搞了一
些时间就开始处理一下，具体请看下面的解说；

:::note
前提请准备服务器、域名，以及解析好，最好也安装好宝塔控制面板
:::

## 本教程就是结合宝塔处理的，具体请参阅以下

1. 宝塔开一个空间，然后绑定刚才需要解析好的域名；==然后记录一下自己新开空间mysql
   的用户以及密码==；

2. 下载及解压`h5ai`文件

在宝塔面板中左边找到文件 进入`/www/wwwroot/`你的域名这个文件夹下

然后点击远程下载 输入: `https://release.larsjung.de/h5ai/h5ai-0.29.2.zip` 然后解
压文件

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/11148c60811286c.png)

3. 安装依赖和配置PHP

查看依赖信息 在浏览器中访问`你的域名/_h5ai/public/index.php`

==默认密码是空的== 直接点击登入即可

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/7fce8c2a8138e7b.png)

左边已经是yes或者变成绿色的,证明对应的依赖已经安装成功

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/5d0a1ae31e75bac.png)

## 配置PHP

在你的软件商店中找到你下载的PHP版本–进入设置–禁用函数

> 删除`exec` 和 `passthru`<br/>`Shell` `tar` `Shell zip` `Shell du`就会显示
> 成`yes`

### 安装 Use EXIF thumbs

然后点击安装扩展

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/44bdf3c937c988c.png)

> 安装`imagemagick`和`exif`<br/>`Use` `EXIF` `thumbs`会显示成`yes`

现在还差两个,再次连接你的服务器

### 安装依赖

#### 安装PDF thumbs(convert)

执行

```sh
yum -y install ImageMagick
```

#### 安装Movie thumbs(ffmpeg)

```sh
#x86_64下载二进制文件
wget https://www.moerats.com/usr/down/ffmpeg/ffmpeg-git-64bit-static.tar.xz
#解压文件
tar xvf ffmpeg-git-64bit-static.tar.xz
rm -rf ffmpeg-git-64bit-static.tar.xz
#将ffmpeg和ffprobe可执行文件移至/usr/bin方便系统直接调用
mv ffmpeg-git-20180831-64bit-static/ffmpeg ffmpeg-git-20180831-64bit-static/ffprobe /usr/bin/
#查看版本
ffmpeg
ffprobe
```

出现错误的看这里:

> 如果
> 在`mv ffmpeg-git-20180831-64bit-static/ffmpeg ffmpeg-git-20180831-64bit-static/ffprobe /usr/bin/`这
> 条命令中如果你执行出现了错误,请`cd到 / 目录`,然后执行`ls`查看解压之后的文件夹

然后替换命令中的两个`ffmpeg-git-20180831-64bit-static`,改成你解压之后的文件夹即
可

此时你的再访问`xxx/_h5ai/public/index.php`全变成了`yes`,这就`ok`了

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/c5732626ebadcab.png)

## 设置网站默认文档

进入你的`宝塔面板–进入网站点击设置–点击默认文档`,在**最上面**添加一个
`/_h5ai/public/index.php` 记得点击添加

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/e0027343cf90232.png)

这时候你可以直接访问你域名了,可以看到搭建成功，教程到此结束；

### 修改默认语言

h5ai支持多语言，但默认显示的是英文，可修改配置文
件`_h5ai/private/conf/options.json`将

```json
"l10n": {
        "enabled": true,
        "lang": "en",
        "useBrowserLang": true
    },
```

`en`修改为`zh-cn`，这样默认就是中文界面啦。

```json
"l10n": {
        "enabled": true,
        "lang": "zh-cn",
        "useBrowserLang": true
    },
```

### 开启搜索功能

依然是修改`options.json`这个文件，将

```json
"search": {
        "enabled": false,
        "advanced": true,
        "debounceTime": 300,
        "ignorecase": true
    },
```

`false`修改为`true`就OK了

```json
"search": {
        "enabled": true,
        "advanced": true,
        "debounceTime": 300,
        "ignorecase": true
    },
```

### 显示二维码

某些手机软件为了方便下载，可以开启二维码显示功能，直接用手机扫描下载，非常方便。
修改`options.json`配置文件，

```json
"info": {
        "enabled": false,
        "show": false,
        "qrcode": true,
        "qrFill": "#999",
        "qrBack": "#fff"
    },
```

`false`修改为`true`就OK了

```json
"info": {
        "enabled": true,
        "show": true,
        "qrcode": true,
        "qrFill": "#999",
        "qrBack": "#fff"
    }，
```

### 替换Google字体

这时候你会发现`h5ai`打开速度非常缓慢，原因是加载了`Google字体`导
致，`Google字体`在墙内总是时灵时不灵的一会儿打得开一会儿打不开，干脆替换掉。修
改`options.json`配置文件将`fonts.googleapis.com`替换为`fonts.lug.ustc.edu.cn`即
可，替换后如下：

```json
"resources": {
        "scripts": [],
        "styles": [
            "//fonts.lug.ustc.edu.cn/css?family=Ubuntu:300,400,700%7CUbuntu+Mono:400,700"
        ]
    },
```

#### 打包下载

搜索 “`download`” `127` 行，`enabled` 由 `false` 改为 `true`。

#### 文件及文件夹多选

搜索 “`select`” `323` 行，`enabled` 由 `false` 改为 `true`。

#### 默认密码

首先生成自定义 `sha512` 密码：`http://md5hashing.net/hashing/sha512` 然后搜索
“`passhash`”，大概第 `10` 行，将其密码改成自己生成的。

## 总结

`h5ai`代码开源，并且还提供更多的配置项，功能丰富，体验了好几个索引目录程序，目前
来说`h5ai`最令人满意，需要的功能都有，大家可以试试。

[h5ai官网](https://larsjung.de/h5ai/)
