---
title: Windows 常见问题
description: Windows 常见问题
pubDate: 2021-08-30
image:
    url: "https://pic-api.marxchou.com/api/random?9rK1vW"
    alt: "wait-this-is-not-my-commit"
tags:
    - Windows
---

## 删除自带输入法

删除以下注册表

```powershell
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\CTF\TIP

{81d4e9c9-1d3b-41bc-9e6c-4b40bf79e35e}
```

## 双系统时间问题

Windows 下以管理员身份打开命令行窗口

```powershell
Reg add HKLM\SYSTEM\CurrentControlSet\Control\TimeZoneInformation /v RealTimeIsUniversal /t REG_DWORD /d 1
```

## 解决部分图标加载不出来

- 在桌面新建文本文档，复制以下代码

```powershell
rem 关闭Windows外壳程序explorer


taskkill /f /im explorer.exe


rem 清理系统图标缓存数据库


attrib -h -s -r "%userprofile%\AppData\Local\IconCache.db"


del /f "%userprofile%\AppData\Local\IconCache.db"


attrib /s /d -h -s -r "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\*"


del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_32.db"

del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_96.db"

del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_102.db"

del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_256.db"

del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_1024.db"

del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_idx.db"

del /f "%userprofile%\AppData\Local\Microsoft\Windows\Explorer\thumbcache_sr.db"


rem 清理 系统托盘记忆的图标


echo y|reg delete "HKEY_CLASSES_ROOT\Local Settings\Software\Microsoft\Windows\CurrentVersion\TrayNotify" /v IconStreams

echo y|reg delete "HKEY_CLASSES_ROOT\Local Settings\Software\Microsoft\Windows\CurrentVersion\TrayNotify" /v PastIconsStream


rem 重启Windows外壳程序explorer


start explorer
```

1.将 txt 后缀修改为 bat

2.双击运行
