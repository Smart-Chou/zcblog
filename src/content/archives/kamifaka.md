---
title: 宝塔面板一键部署佰阅发卡
description: 宝塔面板一键部署佰阅发卡
pubDate: 2021-07-22
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - 发卡系统
---

佰阅发卡KAMIFAKA由佰阅博主开发，这是一款让普通人都能快速搭建和使用的卡密发卡系
统，适用于各种电商、优惠卷、论坛邀请码、充值卡、激活码、注册码、腾讯爱奇艺积分
CDK等。

本篇主要讲述无需命令行，直接在宝塔面板上可视化安装佰阅发卡程序。

## 效果演示

[佰阅小店](https://mall.baiyue.one)

## 宝塔面板安装教程

如果您是新买的服务器，可以参考往期教程安装好宝塔环
境。[新手购买VPS及安装宝塔基础演示](htttps://codenoob.top/)

:::warning
 注意当前安装方法与宝塔其他程序都不会冲突，可正常安装卸载等操作，不会
影响原有环境。
:::

安装好宝塔环境后，打开宝塔面板，软件商店，找到Docker管理器并安装，此步骤需要等待
两分钟。

![如何使用宝塔面板Docker管理器一键部署佰阅发卡](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/yyycode_com20201112151929.png)

完成后，打开Docker管理器设置，获取镜像，输入`baiyuetribe/kamifaka`,获取发卡程序
镜像。

![如何使用宝塔面板Docker管理器一键部署佰阅发卡](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/yyycode_com20201112152651.png)

安装完成后结果如图：

![如何使用宝塔面板Docker管理器一键部署佰阅发卡](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/yyycode_com20201112152756.png)

然后点击容器列表，创建容器：

![如何使用宝塔面板Docker管理器一键部署佰阅发卡](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/yyycode_com20201112154914.png)

只需要确保红线参数正确即可，端口映射：左侧容器内是固定的8000端口，右侧端口可随
意，推荐跟左侧一致。

**目录映射**：作用是容器内公共部分文件目录映射到服务器上，左侧为容器内固定地
址`/usr/src/app/public`,右侧为服务器上可查看的目录地址`/opt/kamifaka`,常用于数据
持久化或备份文件。其余参数保存默认即可。记得填写参数后点下`+`号，否则无效。

**备注**：第二行目录映射不添加的话，删除重装，已配置的网站参数都会没有，只有添加
之后，已保存的网站参数，下次卸载安装后数据不会丢失。

完成上述不步骤后，程序就安装完毕了，可以访问`ip:8000`就可以看到效果，后台地
址`ip:8000/admin`。默认管理员账号`admin@qq.com`，密码：1`23456`。

程序相关的重要文件，都可以在`/opt/kamifaka`这个目录下查看。

![如何使用宝塔面板Docker管理器一键部署佰阅发卡](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/yyycode_com20201112215640.png)

## 关于域名访问

宝塔面板新建网站，然后打开网站设置，设置域名反代。

![如何使用宝塔面板Docker管理器一键部署佰阅发卡](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/yyycode_com20201103222431.png)

之后就可以通过域名正常访问了。

## 如何使用宝塔自带的Mysql数据库？

需要先到宝塔左侧，数据库里创建一个新的数据库，然后更改权限为所有人。

程序安装同上，只需要在创建容器的时候，**环境变量**里可以添加如下参数(注意替换中
文为真实参数)：

```sql
DB_TYPE=Mysql
DB_HOST=数据库(容器)ip
DB_PORT=数据库端口
DB_USER=数据库用户名
DB_PASSWORD=数据库用密码
DB_DATABASE=数据库名
```

实际案例：

```sql
DB_TYPE=Mysql
DB_HOST=172.17.0.1
DB_PORT=3306
DB_USER=faka
DB_PASSWORD=GxJn7ZPHwYrE366j
DB_DATABASE=faka
```

![如何使用宝塔面板Docker管理器一键部署佰阅发卡](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto/note/yyycode_com20201112170542.png)

## 关于升级

当前程序内设计了热更新备份，可以备份重要的网站设置信息、商品卡密信息等到备份文件
夹里，暂时不支持程序内自动更新升级。

程序可直接卸载，操作方法是Docker容器管理里面，删除容器，然后再去删除镜像，重新按
上面的的步骤安装一次即可，旧数据不会丢失。

如果删除了`/opt/kamifaka`里的数据库文件夹，则会创建全新的数据库。备份文件夹在整
个过程中都不参与修改，因此永远都不会被程序删除。

## 关于卸载

操作方法是Docker容器管理里面，删除容器，然后再去删除镜像。

## 其他教程

佰阅发卡KAMIFAKA：一款全新的基于VUE3.0+FLASK的卡密发卡系统

[项目开源地址](https://github.com/Baiyuetribe/kamiFaka)
[官方帮助文档](https://kmfaka.baklib-free.com)
