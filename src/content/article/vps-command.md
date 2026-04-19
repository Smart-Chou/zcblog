---
title: VPS 常用命令
description: VPS 常用命令
pubDate: 2020-07-16
image:
  url: 'https://pic-api.marxchou.com/api/random?8Fq2rX'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Vps
  - Ssh
---

## 宝塔面板

```sh
# centos
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh

# ubuntu/deepin
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh

# debian
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && bash install.sh

# fedora
wget -O install.sh http://download.bt.cn/install/install_6.0.sh && bash install.sh

# 更新
curl http://download.bt.cn/install/update6.sh|bash

# 删除登录验证
sed -i "s|if (bind_user == 'True') {|if (bind_user == 'REMOVED') {|g" /www/server/panel/BTPanel/static/js/index.js
rm -rf /www/server/panel/data/bind.pl
# 还原绑定
sed -i "s|if (bind_user == 'REMOVED') {|if (bind_user == 'True') {|g" /www/server/panel/BTPanel/static/js/index.js
```

## BBR 加速

```sh
wget --no-check-certificate -O tcp.sh https://github.com/cx9208/Linux-NetSpeed/raw/master/tcp.sh && chmod +x tcp.sh && ./tcp.sh

wget -O tcp.sh mcnb.top/tcp.sh && bash tcp.sh

wget "https://dt.yixiagege.cn/shell/TCP-CN.sh" && chmod +x TCP-CN.sh && ./TCP-CN.sh
```

## 回程路由

```sh
wget https://raw.githubusercontent.com/nanqinlang-script/testrace/master/testrace.sh
bash testrace.sh

bash <(curl -sL mcnb.top/besttcp.sh)
```

## 测速

```sh
# SuperBench
wget -qO- --no-check-certificate https://raw.githubusercontent.com/oooldking/script/master/superbench.sh | bash
curl -Lso- -no-check-certificate https://raw.githubusercontent.com/oooldking/script/master/superbench.sh | bash

# Zbench
wget -N --no-check-certificate https://raw.githubusercontent.com/FunctionClub/ZBench/master/ZBench-CN.sh && bash ZBench-CN.sh
wget -N --no-check-certificate https://raw.githubusercontent.com/FunctionClub/ZBench/master/ZBench.sh && bash ZBench.sh

# SuperSpeed
bash <(curl -Lso- https://git.io/superspeed)

# LemonBench
curl -fsL https://ilemonra.in/LemonBenchIntl | bash -s fast

# 91yun
wget -N --no-check-certificate https://raw.githubusercontent.com/91yun/91yuntest/master/test.sh && bash test.sh -i "io,bandwidth,chinabw,download,traceroute,backtraceroute,allping"
```

## 更改 SSH 端口

```sh
# 备份
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
# 更改端口
vim /etc/ssh/sshd_config
# 重启服务
systemctl restart sshd
# 设置防火墙
# firewall
firewall-cmd --permanent --zone=public --add-port=xxxx/tcp
firewall-cmd --reload
# iptables
iptables -A INPUT -p tcp --dport xxxx -j ACCEPT
service iptables save
systemctl enable iptables
```

## 一键安装 File2Ban

```sh
# 安装
wget https://raw.githubusercontent.com/FunctionClub/Fail2ban/master/fail2ban.sh
bash fail2ban.sh
# 卸载
wget https://raw.githubusercontent.com/FunctionClub/Fail2ban/master/uninstall.sh
bash uninstall.sh
```

## Brook 中转

```sh
wget -N --no-check-certificate https://zhujiget.com/wp-content/uploads/2020/brook-pf.sh && chmod +x brook-pf.sh && ./brook-pf.sh
```

## 添加 Swap 分区

```sh
wget https://www.moerats.com/usr/shell/swap.sh && bash swap.sh
```

## buyvm 挂载存储块

```sh
# 查询存储块ID
ls /dev/disk/by-id/
# 格式化硬盘
mkfs.ext4 -F /dev/disk/by-id/scsi-0BUYVM_SLAB_VOLUME-xxxx
# 创建挂载点
mkdir /mnt/pan
# 挂载硬盘
mount -o discard,defaults /dev/disk/by-id/scsi-0BUYVM_SLAB_VOLUME-xxxx /mnt/pan
# 开机自动挂载
echo '/dev/disk/by-id/scsi-0BUYVM_SLAB_VOLUME-xxxx /mnt/pan ext4 defaults,nofail,discard 0 0' | sudo tee -a /etc/fstab
```

## 一键查询主机是否解锁 Netflix

```sh
bash <(curl -L -s https://raw.githubusercontent.com/lmc999/RegionRestrictionCheck/main/check.sh)
```
