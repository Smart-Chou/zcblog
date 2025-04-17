---
title: 重置网络
description: 重置网络
pubDate: 2022-01-17
image:
  url: 'https://pic.mcc.im/images?xV2L4k'
  alt: 'wait-this-is-not-my-commit'
tags:
  - 重置网络
---

## 根据描述，大多和网络有关

:::danger
建议合法使用代理
:::

可以尝试更换一个网络运营商（不同地区的同一个网络运营商也可能情况不同），例如链接
一下手机数据流量的热点，看下情况。

同时建议关闭代理，加速器后，重置一下网络

## PowerShell

`鼠标右键单击开始菜单` →
`Windows PowerShell (管理员)/WIndows11 中可能显示 Windows 终端（管理员）`→ 输
入：

1. netsh winsock reset（按下 Enter 键）
2. netsh int ip reset（按下 Enter 键）
3. ipconfig /release（按下 Enter 键）
4. ipconfig /renew（按下 Enter 键）
5. ipconfig /flushdns（按下 Enter 键）
6. ipconfig /registerdns（按下 Enter 键）
7. inetcpl.cpl ▲（按下 Enter 键）（将打开 Internet 属性界面）▲
8. ncpa.cpl ◆（按下 Enter 键）（将打开网络链接面板）◆

## Internet 属性界面

▲ 在“Internet 属性界面”点击“高级”，点击“还原高级设置”，然后再点击“重置
”（Windows11 中没有“重置”按钮，请忽略此步骤）。

然后在上述选择框中找到：使用 TLS1.0→→ 使用 TLS1.1→→ 使用 TLS1.2→→ 使用
TLS1.3（实验），这 4 个打上勾，点击确定。▲

◆ 在 “网络链接面板”，鼠标右键单击需要设置的网络适配器 →“属性””，在“网络”属性窗口
中双击 “Internet 协议版本 4 (TCP / IPv4)”。选择“自动获得 IP 地址”，选择“自动获得
DNS 服务器地址”，点击“确定”。◆

执行完毕上述方案后，重启设备。
