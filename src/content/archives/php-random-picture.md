---
title: PHP实现随机图片展示
description: PHP实现随机图片展示
pubDate: 2020-09-28
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - PHP
---

## 主要代码如下

```php
<?php
$img_array = glob('images/*.{gif,jpg,png,jpeg,webp,bmp}', GLOB_BRACE);
if(count($img_array) == 0) die('没有图片文件。请先上传一些图片到 '.dirname(__FILE__).'/images/ 文件夹');
header('Content-Type: image/png');
echo(file_get_contents($img_array[array_rand($img_array)]));
?>
```
