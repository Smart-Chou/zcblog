---
title: 前端分阶段学习路线
description: 前端分阶段学习路线
pubDate: 2020-06-03
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - 前端
---

我的订阅号我开通订阅号啦！关注即可获得海量学习资料！

![java](/assets/img/qr_weixin.png)

## 说明（认真看！！！）

- 这个路线都是我的个人总结，肯定不够全面，如果你有好的资源和知识点请在评论区讨论
  或者私信我，让我们一起来共同维护这个路线

- 基本上知识点我都覆盖了学习资源，并且都是不容易和谐的免费的资源

- 下图的资料和路线足够你完成学习，收集制作不易

## 思维导图

<iframe
  :src="$withBase('https://www.processon.com/embed/5ef571fde0b34d4dba55c48f')"
  width="100%"
  height="400"
  frameborder="0"
  scrolling="No"
  leftmargin="0"
  topmargin="0"
/>

[嫌屏幕小也可以点击在线查看](https://www.processon.com/view/link/5ef760601e0853263745c210)密
码是我的名字

## 第一个阶段（看看能不能学走）

### 开发环境搭建

- 开发工具
  - vscode
  - webstorm
  - hbuilder
- 基础的计算机命令

### html

- 常用标签（不同刻意去背）
- 表单
- 语义化
- 多媒体
  - audio
  - video
- 一些常用的api
  - 文件读取
  - 网络状态
  - 本地缓存
  - 拖放
  - 定位
- Dom（重点）
- 自定义属性

### css

- 基础语法
- 几种样式定义的区别和优先顺序
  - 行内
  - 行外
  - 外部样式
- css层叠规则
- 盒模型
- 常见的布局方式
- 响应式布局
  - 媒体查询
  - bootstrap
- 动画和过渡效果

### JavaScript（重中之重）

- 基础语法

- 常用的数据结构（必须先学）

  - 数组
  - 集合
  - 堆栈
  - 队列
  - 链表
  - 哈希
  - 树
  - [学习资料](https://www.bilibili.com/video/BV1bT4y1j7BX)

- JavaScript的执行机制（了解一下）

- 面向对象（重点，多语言通用知识点）

- 原型链

- 实现继承的几个方式

- 几个重点

  - 类型转换
  - 作用域
  - 闭包
  - 深浅拷贝

- 正则表达式

- 操作Dom和canvas绘制

- 常见的工具库的使用（可以参考一下我上一期发的推荐视屏）

  - jquery（2020要学，花不了多少时间，了解一下链式编程和操作dom）
  - loadsh

- 网络相关基础（重要）

  - 常见的通信
    - HTTP/HTTPS
    - IP/UDP
      - websocket
        - [学习资料](https://www.bilibili.com/video/BV1CK4y1t7pR)
  - 常见的响应方式和状态码
    - Json
    - xml
    - 1xx 2xx 3xx
  - ajax通信（重要）
  - restful风格接口
    - [学习资料](https://www.imooc.com/video/17927)
  - rpc风格
  - GraphQL拓展
  - 使用postman调试接口
  - mock数据（重要）
    - [学习资料](https://www.imooc.com/video/17927)

- 最好还是学一点设计和切图

- 浏览器相关知识

  - 兼容性
  - SEO
    - [学习资料](https://www.bilibili.com/video/BV1fE411J7ya)
  - 控制台调试debug
    - [学习资料](https://www.imooc.com/learn/1164)
    - [学习资料](https://www.imooc.com/learn/759)

### 学习资料

- 基础入门
  - 前面没有注明学习资料的地方说明都在这面
  - [黑马36期](https://www.bilibili.com/video/BV1g4411N71d)
  - [鱼c小甲鱼](https://www.bilibili.com/video/BV1QW411N762)
  - [尚硅谷](https://www.bilibili.com/video/BV1XJ411X7Ud)
  - [pink老师-网友推荐](https://www.bilibili.com/video/bv14J4114768)
- 推荐书籍
  - 犀牛书
  - 红宝书
  - 新人看书很不容易看下来，可以后面再看
  - [电子书合集](https://github.com/biaochenxuying/awesome-books)
  - [开源的电子书合集](https://github.com/justjavac/free-programming-books-zh_CN)
  - [免费的电子书合集](https://github.com/ruanyf/free-books)

## 第二个阶段（开始正式踏入前端）

### Git和Svn的版本管理

- [学习资料](https://www.bilibili.com/video/BV15J411973T)
- [学习资料](https://www.bilibili.com/video/BV13s411h7QM)

### JavaScript进阶

- 基础算法的学习
  - 排序
  - 搜索
  - ...
- 函数式编程
  - [学习资料](https://zhuanlan.zhihu.com/p/21714695)
- es6+的学习（重点）
  - [阮一峰](https://es6.ruanyifeng.com/)
  - [石川](https://www.bilibili.com/video/BV1wt411t7hg)
- 模块化
  - [学习资料](https://www.bilibili.com/video/BV1WJ411P7DH)
- typescript
  - [学习资料](https://www.bilibili.com/video/BV1AE41137QL)
- 防抖节流

### 学习框架相关

- nodejs的基础

- 安装node的环境

  - package.json
  - npm cnpm yarn
  - [学习资料](https://www.bilibili.com/video/BV1bs411E7pD)

- 打包和构建

  - webpcak（重点）
  - [学习资料](https://www.bilibili.com/video/BV1e7411j7T5)
    - [学习资料](https://www.bilibili.com/video/BV1oK411p7SJ/)
  - [学习资料](https://survivejs.com/webpack/preface/)
  - gulp
  - grunt
  - babel
  - [学习资料](https://www.bilibili.com/video/BV1jt411z7Wk)

- css预处理

  - less
  - sass
  - stylus
  - 学习资料
    - [立即前往](https://www.bilibili.com/video/BV17W411w7nL)
    - [立即前往](https://www.bilibili.com/video/av59710179/)
    - [立即前往](https://www.zhangxinxu.com/jq/stylus/)

- JavaScript

  - 学习框架之前的准备
    - 了解mvc、mvp、mvvm的架构区别
    - 了解服务端渲染和spa框架
  - 三大框架
    - vue全家桶（适合入门）
      - 基础语法
      - router
      - vuex
      - vuecli脚手架
      - 学习资源
        - [立即前往](https://www.bilibili.com/video/BV1wK4y147xZ/)
        - [立即前往](https://www.bilibili.com/video/BV1AK411s76r)
        - [立即前往](https://www.bilibili.com/video/BV1hs411E7cB)
        - [立即前往](https://www.bilibili.com/video/BV1EE411B7SU)
    - react（也是必学，跳不过的）
      - 基础语法
      - router
      - redux
      - hooks
      - crate-react脚手架
      - 学习资源
        - [立即前往](https://www.bilibili.com/video/BV1g4411i7po)
        - [立即前往](https://www.bilibili.com/video/BV1CJ411377B)
        - [立即前往](https://www.bilibili.com/video/BV1st41137hg)
        - [立即前往](https://www.bilibili.com/video/BV1uT4y1G7xm)
    - angular
      - [学习资源](https://www.bilibili.com/video/BV1bt411e71b)
      - [学习资源](https://www.bilibili.com/video/BV1i741157Fj)
    - 网络
      - axios
      - umi-request
      - [学习资料](https://www.imooc.com/learn/1152)
    - ssr
      - [学习资料](https://www.bilibili.com/video/BV1Xt41117Kg)
      - [学习资料](https://www.bilibili.com/video/BV13441117KK)
    - 单元测试
      - [学习资源](https://www.bilibili.com/video/BV1yA411b7EV)
    - 框架主题库（千万别去背，能用就行）
      - antd
      - element
  - 可视化
    - svg
      - [学习资源](https://www.bilibili.com/video/BV1ME411F7BG)
    - webgl（难，非必学，可以作为职业定位）
    - canvas
      - 报表
      - 海报
      - 大屏
      - [学习资源](https://www.bilibili.com/video/BV1AJ41167V8)
      - [学习资源](https://www.bilibili.com/video/BV1ss411V7s1)
    - 移动端开发
      - 小程序
        - [学习资源](https://www.bilibili.com/video/BV1nE41117BQ)
        - [学习资源](https://www.bilibili.com/video/BV1M7411w7ez)
    - 跨平台（只要框架基础打好，入手很快）
      - react native
      - weex（不建议）
      - uniapp
      - taro
      - flutter（作为拓展学习，成本较高）
      - 学习资源
        - [立即前往](https://www.bilibili.com/video/BV15t411U7yf)
        - [立即前往](https://www.bilibili.com/video/BV1S4411E7LY)
        - [立即前往](https://www.bilibili.com/video/BV15J411L7PS)
        - [立即前往](https://www.bilibili.com/video/BV11J411n7Zv)
        - [立即前往](https://www.bilibili.com/video/BV1ZJ411p7kp)
    - 小游戏开发（可以作为职业定位）
      - cocos
        - [极客学院](https://www.bilibili.com/video/BV1Px411v7u8)
      - 白鹭
        - [官网回放](https://docs.egret.com/engine/videoplayback)

## 第三阶段（前端的进阶和大前端）

- 前端进阶
  - 性能优化‘
  - 框架的源码阅读
  - 浏览器原理
  - 造简单的轮子
  - 设计模式
- 服务器相关
  - linux基础
    - [学习资料](https://www.bilibili.com/video/BV1pE411C7ho)
  - nginx
    - [学习资料](https://www.bilibili.com/video/BV1zJ411w7SV)
  - docker/Jenkins
    - [学习资料](https://www.bilibili.com/video/BV1GW411w7pn)
    - [学习资料](https://www.bilibili.com/video/BV18b411K7q7)
- 服务端开发（你完全可以再学一门后端语言，但是成本较高，当然我们这里以JavaScript
  为例，学习其他可以看我前面的视频）
  - 了解serverless
    - [学习资料](https://juejin.im/post/5d9c47dce51d4578045a3569)
    - [学习资料](https://juejin.im/post/5cdc3dc2e51d453b6c1d9d3a)
  - 数据库知识
    - 关系型
      - mysql
    - 非关系型
      - MongoDB
    - [学习资料](https://www.bilibili.com/video/BV12b411K7Zu)
    - [学习资料](https://www.bilibili.com/video/BV18s411E78K)
- node的网络框架
  - express
    - koa
    - egg
    - nestJs（优先）
    - 学习资料
      - [立即前往](https://www.bilibili.com/video/BV1fb411F7se)
      - [立即前往](https://www.bilibili.com/video/BV1U441117xK)
      - [立即前往](https://www.bilibili.com/video/BV11t411k79h)
      - [立即前往](https://www.bilibili.com/video/BV1Ct411e7zG)
- session/cookie
- 权限管理和认证
- 缓存框架
  - redis
  - memcached
- 文档检索
  - elasticsearch
- webassembly（可以去了解一下，可能要火）

## 拓展

- 值得关注的博客
  - [张鑫旭](https://www.zhangxinxu.com/)
  - [百度](http://fex.baidu.com/)
  - [京东](https://jdc.jd.com/)
  - [阮一峰](http://www.ruanyifeng.com/home.html)
  - [腾讯](http://www.alloyteam.com/)
  - [囧克斯](https://www.lookroot.cn/views/article/jiongks.name)
  - [廖雪峰](https://www.liaoxuefeng.com/)

## 需要注意的点

- 学习资料不一定是最新的是最好的，特别是基础部分

- 前期的学习可以看视屏入门，后期注重书籍阅读和自主文档的学习（提升一下自身的英
  语）

- 前期的开发以实现需求为主，后期的开发就是注重优化和体验

- 前端比较繁杂，框架更新很快，但是入门以后会发现其实是有共同点的，所以不要害怕

- 技术的广度和深度都需要探索，但是入门以后一定要深入一个点，必须让自己有不可替代
  的点

- 不可闭门造车，多阅读博客和GitHub优秀项目的源码设计

- 编程语言的发展的不是技术问题，而是政治问题
