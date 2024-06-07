---
title: 盘点不怎么熟悉但十分有趣的html标签
description: 盘点不怎么熟悉但十分有趣的html标签
pubDate: 2020-08-03
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - HTML
---

在网页开发中，很多的效果需要借助JavaScript才能实现，今天就和大家一起盘点一下一些
你可能不太熟悉，但十分有趣的html标签

## Input输入框

如果你需要一个取色器

```html
<input type="color" />
```

拖动条

```html
<input type="range" />
```

搜索框

```html
<input type="search" />
```

时间和日期选择器

```html
<input type="time" name="" id="" />
<input type="date" name="" id="" />
<input type="datetime-local" name="" id="" />
<input type="month" />
```

还可以在输入框里面给一些默认选项

```html
<input list="emailList" />
<datalist id="emailList">
  <option value="@gmail.com"></option>
  <option value="@qq.com"></option>
</datalist>
```

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/131653-906797.png)

## 进度条

```html
<progress value="30" max="100" color=""></progress>
<progress></progress>
<meter value="20" min="0" max="100" high="60" optimum="50" low="30"></meter>
<meter value="50" min="0" max="100" high="60" low="30" optimum="50"></meter>
<meter value="100" min="0" max="100" high="60" optimum="50" low="30"></meter>
```

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/131806-171318.png)

## 字体增强

```html
<del>删除线</del>
<ins>下划线</ins>
<abbr title="这是一个提示语句">放置</abbr>
<mark>学到了</mark>
<details>
  <summary>点击可查看更多</summary>
  <p>这是隐藏内容</p>
</details>
```

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/132159-126123.png)

## 图片

我们可以给图片添加描述信息，并且还可以根据不同的屏幕分辨率输出不同的图片

```html
<!-- 图片描述 -->
<figure>
  <img
    src="https://pic.zcily.life/images/2021/09/20/AvatarMaker011d0472ceaf8014.png"
    width="200"
    height="200"
  />
  <figcaption>这是我的个人头像</figcaption>
</figure>
<!-- 响应式资源 -->
<picture>
  <source
    media="(max-width: 300px)"
    srcset="
      ![](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/180530-958464.jpeg)/w100
    "
  />
  <source
    media="(max-width: 600px)"
    srcset="
      ![](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/180530-958464.jpeg)/w200
    "
  />
  <img
    src="![](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/180530-958464.jpeg)/w300"
  />
</picture>
```

## 表单

```html
<!-- 表单 -->
<!--表单组合 -->
<form>
  <fieldset>
    <legend>用户注册</legend>
    username：<input type="text" /> password：<input type="password" />
  </fieldset>
</form>
<!-- 必填字段 -->
<form action="">
  <input type="text" required />
  <input type="email" required />
  <input type="submit" value="发送" />
</form>
<!-- 发送邮件 -->
<form action="MAILTO:1270799700@qq.com" method="post" enctype="text/plain">
  <!-- <input type="text" required>
     <input type="email" required> -->
  <input type="submit" value="发送" />
</form>
```

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/144903-43095.png)

## 弹窗

自带的弹窗还挺好看的

![#](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/image/144911-417890.png)

```html
<dialog id="dialog">
  <h2>提示：</h2>
  <p>这是一个可关闭弹窗</p>
  <button onclick="closeModal()">close</button>
</dialog>
```

我们还是需要一点JavaScript来启动它

```js
<script>
    var dialog = document.getElementById("dialog");
    dialog.showModal();
    function closeModal() {
        this.dialog.close();
    }
</script>
```
