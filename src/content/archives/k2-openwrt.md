---
title: 斐讯K2路由器刷openwrt
description: 白捡的斐讯K2路由器，还刷机了，刷的openwrt，厉害了
pubDate: 2021-08-23
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Openwrt
---

本想给家里现有的`fast`、`tp-link`路由器刷`openwrt`系统，可惜硬件不被系统所支持，
刚好听说有一款智能路由器可以免费白捡，于是我薅（==hao==）羊毛的精神有发扬了一
回，嘻嘻。下面给出链接，大家自行了解 购买。下面才是正题，我的刷机流程，仅供大家
参考，交流学习。

[京东购买斐讯K2智能路由器地址](https://union-click.jd.com/jdc?d=zKK1iR)

我买的路由器是`斐讯K2`，硬件版本`A5`，`CPU`芯片为`mt7620a`，我是奔着`openwrt`来
的，所以我在`www.openwrt.org`找到相应的`bin固件`，并下载下来准备好

[Bin固件地址](https://archive.openwrt.org/chaos_calmer/15.05/ramips/mt7620/openwrt-15.05-ramips-mt7620-mt7620a-squashfs-sysupgrade.bin)

路由器刚入手，高兴过头了，于是手贱点了一下自动升级最新系统，这个后面的刷固件找了
不少麻烦，还好网络是开放共享的，废了好些时间找到了解决方法。主要思路是降级系统，
找到官方下架的固件，手机更新上去，然后再刷入`breed`固件。相关固件这里汇总了一
下，需要的朋友拿去。

接下来是具体步骤，先由最新版本 ==V22.6.507.43== ,降级到
==K2_V22.6.506.28.bin==，最新版本没有开启`Telnet`功能，这个次新版本开启
了`Telnet`功能且不提示不合法固件，处女刷，用的必须要用此功能哦，呵呵，登录路由后
台点手动升级，选择下载好的固件。

1.下载 `K2_V22.6.506.28.bin`,[固件链接](https://pan.baidu.com/s/1dGYpUHr),密码:
   8z3m

2.下载`telnet` 打开工
   具`RoutAckProV1B2`,[链接](https://pan.baidu.com/s/1jJK88qM),密码: qaix

3.下载路由器刷`breed Web`控制台助手`v4.8`版本（内含breed固
   件）,[链接](https://pan.baidu.com/s/1pLXFt2b) ,密码: cban

把上面两个工具分别右键管理员身份打开，路由器长按恢复出厂设置按钮**10**秒，红灯状
态下点击工具`telnet`按钮直到出现收到应答信号，紧接着快速点击**breed工具**的开始
刷机按钮，（失败很多次的原因都是`Telnet`开启时间特别短，黄灯亮了`telnet`就关闭
了，两个按钮几乎要同时按下去了），中间什么都不用管，一会就显示成功了拔掉路由器电
源，按着复位键插电源，浏览器`192.168.1.1`进入`breed刷机`界面（我是手动修改
的`ip`，两次`ip`不一样，`k2控制台`管理`ip`为`192.168.2.1`）一路默认，要用网线，
据说wifi无线网不可以，其他不相干的网卡先禁用掉。

![breed 界面](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/20180128085017151710061744052.png)

![breed 界面](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/20180128085033151710063319001.png)

点击`是`按钮

切换设置主机`ip:192.168.1.12`

登录`192.168.1.1` 登录之前断一下电重启，下面是升级固件的页面（少一张选择固件的页
面截图）

![breed 界面](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/20180128085042151710064235458.png)

![breed 界面](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/4.png)

![breed 界面](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/20180128085101151710066144139.png)

刷完之后，再重启一下，访问`192.168.1.1`若不能访问，恢复出厂设置后再访问。（断电
后按键`reset`键，接通电源，持续按键`10s`）

![路由器](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/20180128085141151710070155198.png)

默认密码`admin`或者`root`，进去之后重新设置密码

![路由器](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/20180128085156151710071622467.png)

最后上图是PuTTY工具登录`Telnet`,

远程工具[下载链接](https://pan.baidu.com/s/1jJ4Z48m),密码: d4ng

这就是一台小型的linux主机，系统体积非常的小，只有数M，可以装进智能摄像头、智能家
居、小型机器人、电话里等，用途十分广泛，当然这些只是听说，我没有安装过，呵呵，大
家多交流吧 qq787940000

可以使用opkg命令安装相关软件

```
opkg update # 更新可以获取的软件包列表

opkg upgrade # 对已经安装的软件包升级

opkg list # 获取软件列表

opkg install # 安装指定的软件包

opkg remove # 卸载已经安装的指定的软件包
```

当然，必须先让路由器连上网才行。
