---
title: Typora直传图片文件方案
description: Typora直传图片文件方案
pubDate: 2020-12-28
image:
  url: 'https://pic.mcc.im/images?wK3d9A'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Typora
---

:::tip
让你的typora支持自定义图床，直接贴图保存在云存储
:::

hello大家好我是ChouCong，上一期视频里面我分享到自己的markdown笔记使用typora编
写，自动将里面的图片上传到oss，有些朋友问我直传oss的方式，一般大家都是使用PicGo
的方式上传图片，我本人是不太喜欢再开启一个服务的，

本期就是分享两个直传的方式，当然不仅限于上传到oss空间，也可以折腾一些免费的方
案，但是我建议可以直传oss，oss是真的不贵，速度还快，数据存放也相对安全

第一个是使用一个开源的插
件[typora-plugins-win-img](https://github.com/Thobian/typora-plugins-win-img)

第二个的话使用脚本代码的方式

## 首先来创建一个oss账号

一定要创建子用户

![#](/assets/image/152835-547872.png)

然后添加权限

![#](/assets/image/152944-288062.png)

## 使用插件的方式

下载地
址[typora-plugins-win-img](https://github.com/Thobian/typora-plugins-win-img)

## 安装

- 首先解压，拿到插件包
  ![markdown-ChouCong](/assets/image/212925-928139.png)

然后找到Typora的安装根目录下的`resources/app`,将plugins粘贴在这里

```html
<!-- 打开window.html文件，找到 -->
`
<script src="./app/window/frame.js" defer="defer"></script>
`
<!-- 在后面添加一行-->
`
<script src="./plugins/image/upload.js" defer="defer"></script>
`
```

## 配置文件

打开刚刚复制的`plugins`下的`image/upload.js`文件

修改`setting`里面的 `target` 标签为你的存储厂商，这里以阿里云为例

然后修改下面的`aliyun`这个标签修改为你自己的配置信息

## 自己编写脚本文件

> 注意你要测试你的环境 php在命令行是可以执行的

然后分享一个我收集（非原创，找不到原本的链接了）的使用脚本文件上传的方式，使用
node或者php都可以，这里我使用php举例

composer安装阿里云的sdk

```json
{
  "name": "typora/alioss",
  "type": "project",
  "authors": [
    {
      "name": "ChouCong",
      "email": "3518439599@qq.com"
    }
  ],
  "require": {
    "aliyuncs/oss-sdk-php": "^2.3"
  }
}
```

写个简单的php脚本

```php
<?php

require_once 'vendor/autoload.php';

$file =  $argv[1];

$name = pathinfo($file, PATHINFO_BASENAME);

$uploader = new \OSS\OssClient(
    '你的SecretId',
    '你的SecretKey',
    '你的oss区域地址 oss-cn-chengdu.aliyuncs.com'
);

$res = $uploader->uploadFile(你的文件夹',文件路径+文件名, $file);
$str=$res['info']['url'];
//可以替换成自己的域名 $newstr=str_replace("","",$str);
echo $str . "\n";
```

然后来到typora的偏好设置中，将上传服务设置为自定义命令

```
php 你的脚本地址
```

![#](/assets/image/213932-683672.png)

点击下方的验证上传

![#](/assets/image/214031-408648.png)

成功！
