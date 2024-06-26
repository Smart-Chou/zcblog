---
title: 驰为Hi8安装Debian Linux
description: 驰为Hi8安装Debian Linux
pubDate: 2021-10-04
image:
  url: 'https://pic.mch.icu/images?9wQ2fL'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Linux
---

## 系统选择

### 驰为 Hi8 上面有两个系统

- `Android` 4.4
- `Windows` 10 Home Edition

二者可以自由切换。想着既然能跑 win10，那 `linux` 系统问题也不大，而且以前搞机的
时候刷贴看到有人成功安装 `Ubuntu`，bingo~

考虑到`驰为 Hi8` 渣渣电池，桌面版的系统耗电估计和 `windows` 差不多，怕是没开几个
小时就嗝屁了，所以还是装个类似云服务器上的 `linux` 版本。

### Ubuntu 官方有很多版本，主要有

- Ubuntu Desktop 带桌面的
- Ubuntu Server 只有命令行窗口的

### 包括其它的 flavour（衍生）版

- Ubuntu Kylin 优麒麟，国内公司主导开发
- Kubuntu 基于 KDE 桌面

所以选择很明显了，我的选择是 `Debian` Standard 😂 装 Ubuntu 20 版后的血泪教训，
一定要找准官方支持版本，不然难度超乎你的想象。

## 相关知识储备

### 简单了解一点（来自于门外汉的血泪教训的积累）

- 官方固件/ROM
- 硬件系统架构
- 引导方式
- 分区
- `Android` 开发者选项

### 官方固件/ROM

一般来说，手机/电脑出厂后，官方就把一些固件/ROM植入到了设备里（介于硬件和软件之
间），供高级用户使用，比如 `Andoriod` 的 `recovery/fastboot`、电脑的 `BIOS`，进
入到这些模式就可以使用一些高级功能：重装、恢复等等。

网上也有很多刷机教程，但是，在没有支持的情况下千万小心操作，否则很容易变砖（我
猜）。本着对官方的尊重，就不刷了。。。

实则是因为驰为官方论坛倒了，以前能上去下载官方 ROM，变砖后还能刷回来，现在没了；
另一个安卓手机现在权限做的越来越完善，加了 BL 锁，未解锁刷不了，而华为早已关闭解
锁码申请入口了。

### 硬件系统架构

接触到的品牌基本都是：Intel、AMD、ARM。ARM 主要是低功耗，手机基本上都是用的这个
处理器，直接跳过；电脑大部分用的时候都插着电源，追求更高的性能效率，采用的都是
Intel 和 AMD。这些都不重要 😂 重要的是电脑位数：32 位 or 64 位：

- 32 位体系，简称 i386
- 64 位体系，简称 amd64

> 称呼来自于这些公司划时代的创举（详情可百度之）。`驰为 Hi8` 处理器是
> `Intel Atom Z3736F`，非常廉价，当时买的时候只花了 `¥500`，不过倒也是
> `64 位`的，但是内存只有 `2G`，要跑起来的话可能也够呛。

下载系统镜像的时候，会有版本的区分，比如：`i386.iso`、`amd64.iso`。`Ubuntu 20`
只提供了 `64 位`版本，制作启动盘后一直检测不到，改 BIOS 里的设置也木有用，折腾了
好久才找到办法引导，官方不支持就是香菇。

痛定思痛，果断换 `Debian` 了，并且 `Ubuntu` 是基于 `Debian` 构建的，最重要的
`Debian` 有 `i386` 版本！制作好 U 盘后就被检测到了。

### 引导方式

有时候在装完双系统或者双系统重装后，开机直接进入了一个系统，另一个系统进不去，打
开 `bootloader`（引导程序）也只能看到一个系统启动项，另一个却不见了。

这时候莫方，系统和数据还在，只是有些系统安装时比较“流氓”，只留下了自己的引导，所
以直接修复下引导就好了。回到系统的引导方式，主要分为：

- Legacy - 传统方式，典型的白底蓝字界面
- `UEFI` - 现在的主流引导方式，图形化界面，还能用鼠标

二者引导流程基本一样，不同的是 `UEFI` 省去了自检的过程，因此快了一丢丢，大概
1、2s，听起来没差，但这是技术的发展趋势，这就好比大哥大和苹果的选择题。。。

`UEFI` 基本都跑在 64 位电脑上，于是有的操作系统，比如 Ubuntu，就没提供 `UEFI` 32
位的安装镜像，即使有 32 位老版也是传统引导。

操蛋的是，有些廉价平板还就只支持 32 位 `UEFI` 引导，比如`驰为 Hi8` 😭 血泪教训提
醒，一开始的选择很重要。

### 分区

真正理解分区的概念需要实践，以前网上各种介绍看了也是云里雾里的，一言难尽。简单来
说装多系统都得给磁盘分区，之后系统所在的那个分区就是主分区了，主分区比较特别，因
此根据一块磁盘上分区表的类型，其数量也不一样：

MBR 类型的最多 4 个主分区，而新的 GPT 类型最多可达 128 个！

分区表 (partion table) 是一张控制着所有分区的表，其中记录了分区类型、大小及在磁
盘上物理空间起始位置等详细信息。

平时大家说的改磁盘类型就是改这个分区表，很多磁盘分区软件其实也是改这个表，又比如
在 `linux` 上分区时还是用命令行改这个表。

常见口熟能详的分区有：

1.主分区，系统所在分区。`Windows` 所在的 C 盘，`Linux` 挂载的根目录 `/`

2.启动分区，引导文件所在分区。一般都是 ESP 分区，`Linux` 挂载的 `/boot/efi`

3.恢复分区。`Windows` 或 `Android` 恢复出厂设置时，都是从这个分区读取的原装系统文件。

4.其它的诸如分区类型啊，推荐的 `Linux` 分区方案啊，用多了之后就明白了。

### Android 开发者选项

打开 `Android` 的开发者选项，并启用 USB 调试，这是最最基本的第一步。

安装 `Android` SDK 里的
[platform-tools](https://developer.android.com/studio/releases/platform-tools)
则可以使用 `adb/fastboot` 做更多神奇的事情，比如卸载厂商预置应用、刷机等等。

> 以前年轻不懂，下载了完整的 `android` studio 安装包（贼大）然后再安装
> `platform-tools` 使用 `adb`，没想到官网直接就能下了。。。

如果 `adb devices` 或 `fastboot devices` 看不到连接的手机的话，典型的没装驱动，
这个自行 `Google` 下载驱动安装。

很多童鞋往往入门搞机的时候，都是下载刷机软件刷机，流氓软件不用多说，接着又跑去下
载一些第三方的 ROM，又可能刷机过程中不小心地操作，刷完后就变砖了，一脸懵逼地不知
道该干嘛，惨~~

其实如果提前了解一些开发者的基本知识，知道刷机的过程，也就不会这么慌了，当然门槛
要高得多。另外刷机是有风险的，即便开发者刷也可能变砖，不过能更简单地刷回来就是
了，不用售后花冤枉钱 😀

刷机的过程主要分为三步（具体看 ROM 中的命令）：

1.分区。创建各种用途的分区，比如 cache、system、data，具体看分区表

2.清除分区。也就是格式化，手机“双清时”就是格式化 cache、data 两个分区

3.刷入文件。常说的刷机具体就是这一步，给每个分区刷入 .img 映像文件

附上一些好用的命令：

```sh
adb reboot recovery # 重启到恢复模式，省得按键
adb shell # 执行命令
adb install/uninstall # 安装或卸载预置应用

adb reboot fastboot # 重启到刷机模式
fastboot oem unlock [code] # 解锁 bootloader，刷机的前提
fastboot flash boot /path/boot.img # 刷机
```

## 安装步骤

手把手教你在`驰为 Hi8` 上安装 `Debian Linux`~~ ❤

### 制作启动盘

首先去 `debian.org` 官网上找到 `i386` 版的下载地址，最好使用国内镜像源，这样快
点，比如：`mirrors.163.com`。

下载 [Rufus](https://rufus.ie/) 制作 usb 启动盘，可以参考
[Ubuntu 上的制作教程](https://ubuntu.com/tutorials/create-a-usb-stick-on-windows)。

记住，一定要是 `i386` 版的。重要的事情说三遍！

### 预分区

安装前的另一个步骤就是分区，分配一块空闲的磁盘空间给新系统。怎么在`驰为 Hi8` 上
分区之前困扰了很久：

- `Android` 上连接 `adb shell`，使用 `fdisk` 命令分区。这种太复杂，各种分区类型
  啊不懂，手动计算位置还可能导致分区报废，找硬盘练手又没条件，因此不敢下手。。。
- `Windows` 上使用分区软件 `DiskGenius`。调整分区大小的时候老是报错有 `inode` 什
  么的，百度了一下午也没找到解决办法，切到 `Android` 双清了好几次也还是这个问
  题，心累~

直到最后，用的一个笨方法：先把 `data 分区`备份出来，备份好之后删掉，然后建立一块
小的 `data 分区`（留空闲的给 `Debian`），接着再使用备份恢复到这个小分区。另外还
可以在减少点 `Windows` 分区的大小，留给 `Debian`。

### 跟着流程进行安装

忘了说了硬条件，得先买 `OTG` 线和 `USB hub`，这样才能同时用 **U 盘和键盘**。

按完开机键屏幕亮后，狂按键盘 `Esc`，直到出现了启动菜单，选择 `Boot Manager`，进
去后应该就能看到自己的 U 盘了。如果没有看到，大概率是因为没用 `i386` 版的镜像。

> 之前用 `Ubuntu 64` 位做完启动盘后，死活没看到启动项，后来研究了好几天了才知
> 道，对于只支持 `UEFI 32` 位启动的平板，启动盘里得有 `EFI\boot\bootia32.efi` 这
> 个文件才能被检测到！

**Debian installer** 安装程序相当自动化，具体的忘了，一步一步来就行了。如果中途
提示了缺少固件，直接 `Google` 对应文件名下载到 U 盘即可。

其中有个最重要的步骤是分区，网上有很多 `Linux` 分区方案，比如：

|    名称     |  挂载点   |   容量   |    格式    |
| :---------: | :-------: | :------: | :--------: |
|     ESP     | /boot/efi |   512M   | EFI System |
|    boot     |   /boot   |    1G    |    ext4    |
| swap(可选)  |           |    8G    |    swap    |
| DebianLinux |     /     | 剩余空间 |    ext4    |

> 上面是普通笔记本的分区方案，`驰为 Hi8` 空间有限，可酌情调整大小。

## 更多的问题 or 优化

### 下载缺失固件 firmware

安装过程中，有一步总提示缺少 `brcm/brcmfmac43430a0-sdio.bin`，跟 wifi 相关的驱
动，可以直接 Google 下载对应文件 =>
[Github 仓库传送门](https://github.com/armbian/firmware/tree/master/brcm)。但有
个 `.clm_blob` 文件始终没找到，对 wifi 会有些影响，这个下面再说。

另一个需要提前下载好软件包
[iw](https://packages.debian.org/buster/i386/iw/download)，复制到 U 盘里，进入系
统后挂载到某个目录下，然后 `apt install /path/iw.deb`，其作用是连接 wifi 用的。

电源的驱动也没找到~~~会导致进去后看不了电量。

### 调整字体

进入系统后输了一会儿命令，但字体大小了看着十分难受，因此 Google 一波调整字体：

```sh
dpkg-reconfigure console-setup
```

字体选择 **Terminus**，大小选最大的一档 ==16x32==，这样看起来就舒服多了。

### 修改屏幕方向及亮度

竖向的屏幕空间不够长，亮度也太亮了不够省电，万能的 `Google`：

### 修改屏幕亮度为 50%

```sh
echo 50 > /sys/class/backlight/intel_backlight/brightness
### 调整屏幕方向
echo 3 > /sys/class/graphics/fbcon/rotate
```

每次重启后又变了，可以添加到默认配置中

```sh
vim /etc/rc.local # 输入以下内容
echo 50 > /sys/class/backlight/intel_backlight/brightness
exit 0

vim /etc/default/grub # 输入以下内容
GRUB_CMDLINE_`LINUX`="fbcon=rotate:3"
```

经过这么顿折腾，才终于明白了 `Linux` 中 ==万物皆文件== 👍

### 配置 wifi

没有网就如同鸟儿折断了翅膀，搞铲铲~相比于桌面图形化系统，命令行配置挺复杂的，先
前没网时下载的包派上了用场。

```sh
ip a
iw dev
ip link set wlp2s0 up # wlp2s0 是示例网卡名称，记得替换
```

上面了解了一些网卡信息，下面扫描 wifi：

```sh
iwlist scan
iwlist scan | grep ESSID # 只显示 wifi 名称
```

> 可能死活看不到自己路由器的 wifi，那是因为之前的 brcm 固件问题，导致 wifi 功能
> 受损，扫描不到某些 channel（信道）的 wifi。进入到路由器管理页修改即可。

接下来配置 wifi 名称与密码，设置开机自动连接：

```sh
vim /etc/network/interfaces # 输入以下内容
# Wi-Fi
auto wlp2s0
allow-hotplug wlp2s0
iface wlp2s0 inet dhcp
        wpa-ssid ESSID
        wpa-psk PASSWORD
```

最后启动 wifi 连接之：

```sh
ifup wlp2s0
iw wlp2s0 link
ip a
ping baidu.com # 测试
```

## 参考链接

- Google.com
- debian.org
- [WiFi/HowToUse - Debia` Wiki](https://wiki.debian.org/WiFi/HowToUse#Command_Line)
- [Debian:命令行连接下wifi配置](http://blog.sina.com.cn/s/blog_a6559d920102xsui.html)
