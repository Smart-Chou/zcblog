---
title: 添加看板娘
description: 添加看板娘
pubDate: 2022-01-30
image:
    url: "https://pic-api.marxchou.com/api/random?D5tR1g"
    alt: "wait-this-is-not-my-commit"
tags:
    - Live2d
---

> 刚把博客弄好，就开始各种折腾了，一直想加一个可以换装，可以对话的看板娘，于是看
> 了各种教程，各种插件，添加看板娘，感觉都不太满意，自己动
> 手。[演示页](https://api.itggg.cn/dome.html)

## 环境说明

- 需要 [Font Awesome](http://www.fontawesome.com.cn/) 支持，确保相关样式表已在页
  面中加载，否则换装等按钮不显示，如果不想要这些按钮就不用引入了（如果网页中已经
  加载了任何版本的 `Font Awesome` 就不要重复加载了）
- 其他博客或者网站主题将这一行代码加入`<head>`或 `<body>`即可。
- `Handsome`用户直接在：设置外观-开发者设置-自定义输出`header`头部的`HTML`代码
- 最近 `jsdelivr`的国内速度已经不行了，elemecdn 的可以选择，当然也可以下载放在本
  地，看各位喜好
  ([font-awesome-4.7.0.zip](https://p.tiax.cn/ALIYUN/font-awesome-4.7.0.zip))

```html
# jsdelivr
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css"
/>

# elemecdn
<link
    rel="stylesheet"
    href="https://npm.elemecdn.com/font-awesome@4.7.0/css/font-awesome.min.css"
/>
```

## 看板娘添加到网站

- 其他博客或者网站主题将这一行代码加入`<head>` 或 `<body>`就完事。
- Handsome 主题直接在：设置外观-开发者设置-自定义输出`body`尾部的`HTML`代码

:::danger

注：老版本，2022 年 5 月删除，请使用下方新版\*\*

:::

## 新版

```html
<script src="https://api.itggg.cn/live2dnew/left/index.js"></script>
<script src="https://api.itggg.cn/live2dnew/right/index.js"></script>
#可选位置左右或右边
```

**注意**：如果网站启用了 `PJAX`，看板娘不必每页刷新，因此要注意将相关脚本放到
`PJAX` 刷新区域之外。

## 个性化参数

**1、指定首次加载的模型和皮肤** , `JS` 传参即可，`modelId`是模型
，`modelTexturesId` 是模型皮肤，模型 ID 和皮肤 ID，可以通过演示页面`F12`打开控制
台日志查看。

```html
localStorage.setItem('modelId', '7'); localStorage.setItem('modelTexturesId',
'3');
```

**2、自定义看板娘大小**，`CSS` 自定义即可，类名称 `#waifu #live2d` ，示例如下；
注意高度和宽度需要一样，因为容器是个正方形，不一致会变形。

```css {2} collapse={3-5}
<style type="text/css">
    #waifu #live2d {
        height: 500px!important;
        width: 500px!important;
    }
</style>
```

**3、隐藏对话框和对话框高度**，`CSS` 自定义即可，类名称 `#waifu-tips` ，示例如
下；

```css
<style type="text/css">
    #waifu-tips {
        top: -60px;               #对话框高度
        display:none !important;  #隐藏对话框
    }
</style>
```

- 个性化演示如下，修改大小并指定首次加载模型；

```html
<style type="text/css">
    #waifu #live2d {
        height: 500px !important;
        width: 500px !important;
    }
    #waifu-tips {
        top: -60px;
        /*display:none !important;隐藏对话框*/
    }
</style>
<script>
    localStorage.setItem("modelId", "7");
    localStorage.setItem("modelTexturesId", "3");
</script>
```

## 插件版本

[typecho 博客 Live2D 插件 插件相对于 Paul 的 Pio 插件，简化了很多，并且自动在手机端隐藏](https://www.itggg.cn/fx/458.html)

## 模型接口

换装的后端和模型`API`接口由我这边提供，

## 移动端

移动端默认隐藏，有些手机加载卡的一匹，设备宽度低于`768PX`时，自动隐藏

## 更新记录

- `2020-05-06`：修复后端接口初始化，看板娘模型下方有`1CM`间隔
- `2020-05-30`：随着接口访问量日益巨大，截止`5`月底，已经请求了`600`万次了
  [![img](/assets/note/dead.png)](https://itggg.cn/8.3/assets/img/emotion/aru/dead.png)
  服务器负载天天`90%`,为了满足大家的需要，现在把接口数据都缓存在百度云`CDN`的，
  刷新时间`2h`，缓存生效后可以达到毫秒换装，请自己体验
- `2020-05-30`：优化 CND 换装，重构前端模型，现在的模型看起来效果更精细
- `2020-10-29`：修复在某些博客隐藏看板娘后，左侧召唤按钮被遮挡的`BUG`
- `2022-03-10`：优化接口速度，精简代码
- `2022-03-19`：新增模型，优化接口速度

## 桌面版本

<https://github.com/zenghongtu/PPet>

这位大佬开发的桌面版本，`WIN`和`MAC`都有，`Github`上不去的可以在网
盘[ppet.zip](https://p.tiax.cn/ALIYUN/ppet.zip)下载，打开即用，模型链接已经配置
好了。

接口模型`json`链接如下，模型会不定时更新~
