---
title: WechatExporter
description: WechatExporter
pubDate: 2022-02-13
image:
  url: 'https://pic.mch.icu/images?T5yQ8d'
  alt: 'wait-this-is-not-my-commit'
tags:
  - WechatExporter
---

> [最新版本下载](https://github.com/BlueMatthew/WechatExporter/)

:::danger[BUG!!!]
1.8.0.7 以前的版本异步加载方式存在一个比较严重的小白 bug：当设置为滚动到页面底部
异步加载时，越靠后面的页码，加载的消息数量越少；设置为页面打开全部消息异步加载
时，消息只能加载到一半。

如果 iTunes 备份还存在，请使用版本 1.8.0.8 重新导出一遍。如果过往的备份已经清除
了，可以下载补丁程
序[Win64 版本](https://github.com/BlueMatthew/WechatExporter/releases/download/v1.8.0.8/patch_x64_win.zip)/[MacOS 64 版本](https://github.com/BlueMatthew/WechatExporter/releases/download/v1.8.0.8/patch_x64_macos.zip)并
解压，把wxexpatch.exe/wxexppatch拷贝到导出目录，并执行，来修复已经导出的页面（补
丁修复的文件清单可查看日志文件 patch.log）。
:::

本程序参考 <https://github.com/stomakun/WechatExport-iOS> 修改成 C++来实现，便于
在各个平台以更少依赖运行。同时增加了聊天群名称的解析支持和更多消息类型的导出支
持。导出支持 Text、HTML、PDF 三种格式。

- 导出的聊天记录页面可以设置为打开时一次性加载完成（默认方式）、打开时异步加载、
  页面滑动到底部时加载更多三种方式，可以在菜单“选项”中修改加载方式。
- 可以在导出的页面增加过滤功能，功能也需要在菜单“选项”中设置。
- PDF 格式，实质是导出打开时一次性加载完成的 HTML 页面，然后通过 Google Chrome
  或者 Microsoft Edge 浏览器的功能转成 PDF 文件，转 PDF 文件耗时较长，请不要关闭
  自动弹出的命令行窗口。
- 增量导出：菜单“选项”中，如果设置了增量导出，则会仅仅导出上一次导出的最后一条消
  息之后的部分，通过此功能，再一次备份之后，微信中的聊天记录可以删除，下一次导
  出，可以把同一个聊天群的消息合并在一起。

## 操作步骤

1. 通过 iTunes 将手机备份到电脑上(备份时不要选择设置口令)，Windows 操作系统一般
   位于目录：C:\用户[用户名]\AppData\Roaming\Apple
   Computer\MobileSync\Backup\。Android 手机可以找一个 iPad/iPhone 设备，把聊天
   记录迁移到 iPad/iPhone 设备上，然后通过 iTunes 备份到电脑上。

   ![iTunesBackup-960](https://cdn.zcily.life/image/125906418-090d4ac8-a2ba-4a26-9db2-c6dbed4b0a3c.png!WebP)

2. 下载执行文件（最新版本下载链接见上）。

3. 执行解压出来的 WechatExport.exe/WechatExporter.app (Windows 下如果运行报缺少
   必须的 dll 文件，请安
   装[Visual C++ 2017 redist](https://aka.ms/vs/16/release/vc_redist.x64.exe)后
   再尝试运行)

4. 按界面提示进行操作。  
   ![Windows界面截屏](https://cdn.zcily.life/image/win.png!WebP) ![MacOS界面截屏](https://cdn.zcily.life/image/mac.png!WebP)

5. 导出后的页面示例：  
   ![导出后的页面示例截屏](https://cdn.zcily.life/image/WechatExporter-demo.png!WebP)

点击链接可打开网页：[https://src.wakin.org/github/wxexp/demo/](https://src.wakin.org/github/wxexp/demo/)

## 模版修改

解压目录下的 res\templates(MacOS 版本位于 Contents\Resources\res)子目录里存放了
输出聊天记录的 html 页面模版，其中通过两个%包含起来的字符串，譬如，%%NAME%%，不
要修改之外，其它页面内容和格式都可以自行调整。

特别感谢 Chao.M 帮忙优化当前的模版。

## 系统依赖

Windows 版本：Windows 7+(XP 不支持),
[Visual C++ 2017 redist](https://aka.ms/vs/16/release/vc_redist.x64.exe) at
[The latest supported Visual C++ downloads](https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads)  
MacOS
版本：MacOS 10.10(Yosemite)+

## 程序编译

程序依赖如下第三方库：

- libxml2: <http://www.xmlsoft.org/>
- libcurl: <https://curl.se/libcurl/>
- libsqlite3: <https://www.sqlite.org/index.html>
- libprotobuf: <https://github.com/protocolbuffers/protobuf>
- libjsoncpp: <https://github.com/open-source-parsers/jsoncpp>
- lame: <http://lame.sourceforge.net/>
- silk: <https://github.com/collects/silk> (也参考了：
  <https://github.com/kn007/silk-v3-decoder>)
- libplist: <https://github.com/libimobiledevice/libplist>,
  <https://github.com/libimobiledevice-win32/libplist>
- libiconv(windows only): <https://www.gnu.org/software/libiconv/>
- openssl(windows only)：<https://github.com/openssl/openssl>
- WTL (windows only)：<https://sourceforge.net/projects/wtl/>

MacOS 下，libxml2,libcurl,libsqlite3 直接使用了 Xcode 自带的库，其它第三方库需自
行编译。  
libmp3lame 需手动删除文件 include/libmp3lame.sym 中的行：lame_init_old

Windows 环境下，silk 自带 Visual Studio 工程文件，可以直接利用 Visual Studio 编
译，其余除了 libplist 之外，都通过 vcpkg 可以编译。libplist 在 vcpkg 中也存在，
但是在编译 x64-windows-static target 的时候报了错，于是直接通过 Visual Studio 建
了工程进行编译。

已测试 iTunes 和微信版本

- iTunes 12.3.3.17 + 微信 6.5.9
- iTunes 12.5.1.21 + 微信 6.3.30
- iTunes 12.10.10.2 + 微信 7.0.2
- iTunes 12.10.9.3 + 微信 7.0.15
- iTunes 12.9.5.5 + 微信 7.0.2
- Windows 10 + iTunes 12.11.0.26(Microsoft Store) + 微信 7.0.2
- Windows 10 + iTunes 12.11.0.26(Microsoft Store) + 微信 8.0.1
- Mac Catalina (Embedded iTunes) + 微信 8.0.1/8.0.2
- Windows 7 + iTunes 12.10.9.3 + 微信版本 8.0.2
- Windows 10 + iTunes 12.11.3.17 + 微信 8.0.7
- Windows 7 + iTunes 12.10.9.3/Mac Catalina (Embedded iTunes) + 微信 7.0.2 + iOS
  9.3.5
- Windows + iTunes 12.10.3.1+ 微信 7.0.10 + iOS 13.3 (@lazybug163)
- MacOS 11.6（Embedded iTunes）+ iOS Version: 15.0 + 微信 8.0.9
