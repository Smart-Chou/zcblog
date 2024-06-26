---
title: Substats：快速统计你在各个平台的关注者!
pubDate: 2020-03-16
tags: ['Tech', 'Server', 'Serverless', 'Cloudflare']
image:
  url: 'coverimage/substats.png'
  alt: 'substats'
description: Subscriber statistics：专注提供各个网站和社区里用户的订阅者、关注者、粉丝数量的 Serverless API
---

:::tip[important]
SUBSTATS Serverless Function to Count How Many People are Subscribed to You in Your Favorite Services. **只管调用，我们来帮你找订阅者！**
:::

在 [上一篇文章](https://blog.spencerwoo.com/2020/03/ttrss-noteworthy/) 里面，我在开头用 Feedly 的 API 和 Shields.io 制作了显示我 RSS 订阅数量的 Badge。这个Badge 不仅是实时更新、动态加载的，还能轻松嵌入各个网页里面。

<a href="https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml"><img src="https://img.shields.io/badge/dynamic/json?color=2bb24c&amp;label=subscribers&amp;query=%24.source.subscribers&amp;url=https%3A%2F%2Ffeedly.com%2Fv3%2Frecommendations%2Ffeeds%2Ffeed%252Fhttps%253A%252F%252Fblog.spencerwoo.com%252Fposts%252Findex.xml&amp;logo=feedly&style=for-the-badge" alt="" style="display: inline; margin: 0 0.1rem 0 0; width: auto;"></a>

但是，RSS 订阅服务不仅仅有 Feedly 一家，还有 Inoreader 和 NewsBlur 等等。单一个Feedly 提供的数据并不能真正显示我们 RSS 链接的订阅人数，于是，我就准备用Serverless 技术搭建一个「API 中转站」，**提供多个服务商的订阅人数整合的工作。**

其实，最初的 Substats 实际上叫做 RSS-stats，也就是集合多个 RSS 服务商提供的订阅人数数据得到的一个 API 服务。但是后来经过我一番思考，既然都是调用 API，那么为什么不把其他的平台和服务，比如微博粉丝、知乎、少数派、以及 GitHub 和 Twitter 的关注者等等，一起支持一下呢？💡 可行！于是 Substats 就这样诞生啦。(≧∇≦)ﾉ

:::tip[相关链接]

- **Substats API 地址**：[API - Substats](https://api.spencerwoo.com/substats/)
- **Substats GitHub 项目地址**：[spencerwooo/Substats](https://github.com/spencerwooo/Substats)
  
:::

## 功能特性

Substats 是一个非常方便易用的**请求订阅者、粉丝、关注用户数量 API 服务**。目前，Substats 平台支持了包括 Feedly、GitHub、Twitter、知乎和少数派在内的五个平台和网站，并使用 Serverless 技术部署到了 Cloudflare 的 CDN 上，全球部署，飞速响应。Substats 将复杂的原平台 API 请求进行了隐藏、简化和集成，让用 Substats 的你只需要关注**两个参数：平台名称、用户名称**，一波访问，即可得到对应的关注数量。

得益于强大的 Cloudflare 全球 CDN 网络，Substats 不仅部署方便、维护轻松，**还有着极强的可拓展性、极快的访问速度和极小的请求时延**。甚至在你懂得的地方，你都可以轻松访问到 Twitter 的粉丝数量！🥂

### API Endpoint

Substats 的请求非常简单，基础 API Endpoint 位于：

```html
https://api.spencerwoo.com/substats/
```

接下来，我们只需要关注前文提到的平台名 `source` 和用户名称（或 RSS 链接、用户slug 等标识）`queryKey` 即可构造一个基本的请求。为了更好的和 Shields.io 整合，Substats 仅支持 `GET` 请求，并使用查询字符串（Query String）来添加请求参数。

### 基础请求

一个最基础的请求参数类似：

```http
GET /?source={SOURCE}&queryKey={QUERY}
```

其中，我们只需要填入平台名称 `{SOURCE}` 和请求参数 `{QUERY}` 即可。

### 平台串联请求

我们可以用下面的语法构建单个请求 query 并列请求多个平台的 API，只需要将平台之间用 `|` 分隔即可：

```http
GET /?source={SOURCE_1}|{SOURCE_2}|{SOURCE_3}&queryKey={QUERY}
```

其中，这一请求格式特别适合 RSS 订阅的请求，比如当我们想统计同一个 RSS 链接在 Feedly、Inoreader 以及 NewsBlur 三个平台的订阅者数量，即可使用这一语法进行 API请求。（详见下文例子）

### 多个平台和用户名的串联请求

```http
GET /?source={SOURCE}&queryKey={QUERY}&source={SOURCE}&queryKey={QUERY} ....
```

如果我们每个平台的请求参数（也就是用户名）不一样，没关系，我们也可以用上面的语法组织各个 `[平台, 参数]` 二元组，依次请求，得到最终数据。在这一过程中，平台、参数的顺序在请求和内部 API 处理的过程中是完全一致的。（你也就不必担心请求的错位。）

## 一些例子

将 Substats 和 [Shields.io](https://shields.io/) 配合起来，我们可以构造稳定可用的关注者数量实时显示 Badge，嵌入包括 GitHub README、博客文章等等网站的各个位置。我来举个栗子。🌰

### 单个请求

Substats 最初就是为了请求 RSS 订阅者数量，我们先来请求一波 Feedly 的订阅数量。我自己博客（也就是本博客）的 RSS 订阅链接是`https://blog.spencerwoo.com/feed.xml`，那么，我们就可以用下面的 URL 构造请求：

```http
GET /?source=feedly&queryKey=https://blog.spencerwoo.com/feed.xml
```

这一请求会返回如下的数据：

```json
{
  "status": 200,
  "data": {
    "totalSubs": 14,
    "subsInEachSource": { "feedly": 14 },
    "failedSources": {}
  }
}
```

我们所需要的数据即位于：`data.totalSubs`。在 [Shields.io](https://shields.io/)官网，我们即可借助 Dynamic Badge 构建一个自定义的 Badge：

- `data type` 选择：`json`
- `label` 填入：Feedly RSS Subscribes
- `data url` 填
  入：`https://api.spencerwoo.com/substats/?source=feedly&queryKey=https://blog.spencerwoo.com/feed.xml`
- `query` 填入：`$.data.totalSubs`
- `color` 填入：`2bb24c`（Feedly 的强调色）

点击 Make badge，即可生成如下的 Feedly RSS 订阅 Badge：

<a href="https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml"><img src="https://img.shields.io/badge/dynamic/json?color=2bb24c&label=Feedly%20RSS%20Subscribes&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dfeedly%26queryKey%3Dhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml" alt="" style="display: inline; margin: 0 0.1rem 0 0; width: auto;"></a>

```html
https://img.shields.io/badge/dynamic/json?color=2bb24c&label=Feedly%20RSS%20Subscribes&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dfeedly%26queryKey%3Dhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml
```

在这一请求链接的结尾，再手动添加上 Feedly 的 logo 请求参数 `&logo=feedly`，即可将 Badge 添加上图标：

<a href="https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml"><img src="https://img.shields.io/badge/dynamic/json?color=2bb24c&label=Feedly%20RSS%20Subscribes&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dfeedly%26queryKey%3Dhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml&logo=feedly" alt="" style="display: inline; margin: 0 0.1rem 0 0; width: auto;"></a>

```html
https://img.shields.io/badge/dynamic/json?color=2bb24c&label=Feedly%20RSS%20Subscribes&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dfeedly%26queryKey%3Dhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml&logo=feedly
```

另外，我们还可以指定生成超大 For The Badge 风格的 Badge，在上面请求末尾再手动添加参数 `&style=for-the-badge` 即可：

<a href="https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml"><img src="https://img.shields.io/badge/dynamic/json?color=2bb24c&label=Feedly%20RSS%20Subscribes&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dfeedly%26queryKey%3Dhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml&logo=feedly&style=for-the-badge" alt="" style="display: inline; margin: 0 0.1rem 0 0; width: auto;"></a>

```html
https://img.shields.io/badge/dynamic/json?color=2bb24c&label=Feedly%20RSS%20Subscribes&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dfeedly%26queryKey%3Dhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml&logo=feedly&style=for-the-badge
```

### 多个平台串联请求

当然，我们可以用 `|` 串联多个请求，比如我同时请求 Feedly、Inoreader 中订阅我 RSS链接的用户数量：

```http
GET /?source=feedly|inoreader&queryKey=https://blog.spencerwoo.com/feed.xml
```

我们会得到如下数据（截至发文 Inoreader 的 API 尚未实现，我正在咨询 Inoreader 平台方是否提供 API 接口）：

```json
{
  "status": 200,
  "data": {
    "totalSubs": 14,
    "subsInEachSource": { "feedly": 14, "inoreader": 0 },
    "failedSources": {
      "inoreader": "Not implemented"
    }
  }
}
```

<a href="https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml"><img src="https://img.shields.io/badge/dynamic/json?label=RSS%20subs&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dfeedly%257Cinoreader%26queryKey%3Dhttps%3A%2F%2Fblog.spencerwoo.com%2Fposts%2Findex.xml&color=ffa500&logo=rss&style=for-the-badge" alt="" style="display: inline; margin: 0 0.1rem 0 0; width: auto;"></a>

### 多平台多请求参数串联请求

当每个平台的请求参数（用户名）不一样时，我们可以串联多个请求参数并行请求，比如我希望统计「少数派」平台和「Twitter」平台的粉丝，但是我在这两个平台上面的用户名分别是 `spencerwoo` 和 `realSpencerWoo`，我们即可用下面的方法构造请求：

```http
GET /?source=sspai&queryKey=spencerwoo&source=twitter&queryKey=realSpencerWoo
```

我们会得到如下数据：

```json
{
  "status": 200,
  "data": {
    "totalSubs": 756,
    "subsInEachSource": { "sspai": 636, "twitter": 120 },
    "failedSources": {}
  }
}
```

这样，我们即可非常轻松的构造这样的三个 Badge：

<a href="https://api.spencerwoo.com/substats/?source=sspai&queryKey=spencerwoo&source=twitter&queryKey=realSpencerWoo"><img src="https://img.shields.io/badge/dynamic/json?label=Social%20media&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dsspai%26queryKey%3Dspencerwoo%26source%3Dtwitter%26queryKey%3DrealSpencerWoo&color=brightgreen&style=for-the-badge" alt="" style="display: inline; margin: 0 0.1rem 0 0; width: auto;"></a>
<a href="https://api.spencerwoo.com/substats/?source=sspai&queryKey=spencerwoo&source=twitter&queryKey=realSpencerWoo"><img src="https://img.shields.io/badge/dynamic/json?label=%E5%B0%91%E6%95%B0%E6%B4%BE&query=%24.data.subsInEachSource.sspai&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dsspai%26queryKey%3Dspencerwoo%26source%3Dtwitter%26queryKey%3DrealSpencerWoo&color=d71a1b&style=for-the-badge" alt="" style="display: inline; margin: 0 0.1rem 0 0; width: auto;"></a>
<a href="https://api.spencerwoo.com/substats/?source=sspai&queryKey=spencerwoo&source=twitter&queryKey=realSpencerWoo"><img src="https://img.shields.io/badge/dynamic/json?label=Twitter&query=%24.data.subsInEachSource.twitter&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dsspai%26queryKey%3Dspencerwoo%26source%3Dtwitter%26queryKey%3DrealSpencerWoo&color=1da1f2&logo=twitter&style=for-the-badge" alt="" style="display: inline; margin: 0 0.1rem 0 0; width: auto;"></a>

## 小结

这些就是 Substats 的特别之处，Substats 不仅整合了原服务复杂的 API，还拥有方便的请求构建方法。与 [Shields.io](https://shields.io/) 配合，我们可以及其方便的构造自定义 Badge。虽然当前 Substats 支持的服务平台还比较少，但是整合其他服务 API 的方法还是相当方便的，欢迎同学们帮我来共同整合其他平台，一起将 Substats 发扬壮大 (•̀ ω •́ )✧

**最后，如果你觉得 Substats 非常棒，请不要吝啬你的 Star！你们的支持是我输出的最大动力 φ(\*￣0￣)**

<a href="https://github.com/spencerwooo/Substats"><img src="https://img.shields.io/github/stars/spencerwooo/Substats?logo=github&style=social" alt="" style="display: inline; margin: 0 0.1rem 0 0; width: auto;"></a>
