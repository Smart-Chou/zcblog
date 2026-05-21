---
title: 宝塔面板部署 Vaultwarden 密码管理服务
description: 宝塔面板 + Docker 一键部署 Vaultwarden 自托管密码管理服务。支持 Bitwarden 全平台客户端（iOS/Android/浏览器插件），含反向代理配置、SSL 证书、关闭公开注册、数据备份等完整教程。
pubDate: 2026-04-01
upDate: 2026-05-21
image:
  url: "../../assets/coverimage/bitwarden.png"
  alt: "Vaultwarden 密码管理服务"
tags:
  - Vaultwarden
  - Bitwarden
  - 密码管理
  - Docker
  - 宝塔面板
  - 自托管
  - 反向代理
  - Nginx
  - SSL
  - 安全
---

## 前言

以前我用 KeePass 配合坚果云 WebDAV 同步，桌面端体验一般，浏览器插件也不太好用。后来了解
到 [Bitwarden](https://bitwarden.com/)，开源免费、全平台支持，官方还提供了 Docker 镜像可以
自建服务端。

不过官方镜像要求服务器内存 2G 以上，对于轻量云服务器有点吃力。社区用 Rust 重写
的 [Vaultwarden](https://github.com/dani-garcia/vaultwarden) 把资源要求降到了 512MB，功能上
完全兼容 Bitwarden 所有客户端。

:::tip
这个项目原名 `bitwarden_rs`，后来改名为 `vaultwarden`。如果你看到旧教程里用
`bitwardenrs/server` 镜像名，替换成 `vaultwarden/server` 即可。
:::

## 准备工作

开始部署之前，先确保以下环境就绪：

- **宝塔面板** 已安装，推荐 LNMP 环境
- **一个域名** 解析到服务器，创建站点并配置好 SSL 证书
- **Docker** 已安装（可以直接在宝塔软件商店装「Docker 管理器」）

## 教程开始

### 安装 Docker 管理器

宝塔面板 → 软件商店 → 搜索「Docker 管理器」→ 安装。安装完默认就是运行状态。

![安装 Docker 管理器](/assets/note/23bb13c6fa48ab4f5e31a1edaecb9183.png)

### 拉取镜像

打开 Docker 管理器 →「镜像管理」→「获取镜像」。国内服务器可以先配置镜像加速：

![加速镜像](/assets/note/d6942180db67cc4f239768b63fa9011e.png)

加速地址填：

```
https://docker.mirrors.ustc.edu.cn/
```

然后在输入框填入镜像名 `vaultwarden/server`，点击获取。

![拉取镜像](/assets/note/15103da79c7d963851b56b3b3cfd93c0.png)

镜像不大，几十 MB，很快就能拉下来。

### 创建容器

「容器列表」→「创建容器」，按以下参数填写：

![创建容器](/assets/note/c86e6a6a47d8b721af5a5217c4c35991.png)

| 参数 | 值 | 说明 |
|------|-----|------|
| 容器端口 | `80` | 容器内 Web 服务端口 |
| 服务器端口 | `6789`（可自定义） | 宿主机映射端口，后面反代要用 |
| 服务器目录 | 站点目录（如 `/www/wwwroot/你的域名/`） | 数据存这里，方便备份 |
| 容器目录 | `/data` | 固定值，不用改 |
| 内存配额 | 按服务器配置填 | 建议 256MB 起步 |

:::warning
端口映射和目录映射填完一定要点 `+` 添加，不然不会生效。
:::

提交后把容器名称改成 `vaultwarden`，方便后续操作。

![修改容器名称](/assets/note/d23d21a60e849970b31cd624655e86b6.png)

命令行的同学可以直接跑：

```shell
# 拉取镜像
docker pull vaultwarden/server:latest

# 创建容器
docker run -d --name vaultwarden \
  -v /www/wwwroot/你的域名/:/data/ \
  -p 6789:80 \
  vaultwarden/server:latest
```

### 配置反向代理

站点设置 →「反向代理」→ 目标 URL 填 `http://127.0.0.1:6789`，提交。

![添加反向代理](/assets/note/daa0696a7c7c54a11348dfb99d14ef0d.png)

> 端口号 `6789` 就是上一步填的服务器端口，保持一致就行。

### 创建账号

现在用域名访问站点，应该能看到登录/注册页面了：

![网站页面](/assets/note/9e9a372c88a990d5628adbbb1fbc3fe0.png)

点击「创建账号」，填邮箱和主密码完成注册。**主密码一定要记牢，丢了没法找回。**

### 关闭公开注册

部署完建议把注册关掉，免得被别人滥用。

在容器列表里**先停止再删除**当前容器：

![停止并删除容器](/assets/note/a6397ebd7a7f1849a43a53f001e846cd.png)

:::warning
一定先停止再删除，直接删可能导致数据问题。
:::

然后重新创建，这次加上 `SIGNUPS_ALLOWED=false`：

```shell
docker run -d --name vaultwarden \
  -e SIGNUPS_ALLOWED=false \
  -v /www/wwwroot/你的域名/:/data/ \
  -p 6789:80 \
  vaultwarden/server:latest
```

创建完重启一下：

```shell
docker stop vaultwarden
docker start vaultwarden
```

:::tip
重新创建容器后如果之前注册的账号登不上，再完整走一遍「停止 → 删除 → 创建 → 启动」就好。
:::

## 启用管理面板

Vaultwarden 内置了 Web 管理面板，可以对所有用户、组织进行管理，还能查看系统诊断信息。强烈建议启用。

### 配置 ADMIN_TOKEN

管理面板通过 `ADMIN_TOKEN` 环境变量来设置访问密码。生成一个强随机令牌：

```shell
openssl rand -base64 32
```

重建容器时加上这个环境变量：

```shell
docker run -d --name vaultwarden \
  -e SIGNUPS_ALLOWED=false \
  -e ADMIN_TOKEN=你的随机令牌 \
  -v /www/wwwroot/你的域名/:/data/ \
  -p 6789:80 \
  vaultwarden/server:latest
```

宝塔面板操作：创建容器时在「环境变量」里添加 `ADMIN_TOKEN`。

### 访问管理面板

容器启动后访问 `https://你的域名/admin`，输入上面设置的 `ADMIN_TOKEN` 即可进入管理后台。

:::tip
为了安全，建议用 Argon2 哈希存储 ADMIN_TOKEN 而非明文。在容器内执行：

```shell
docker exec -it vaultwarden /vaultwarden hash
```

按提示输入两次密码，将输出的 `$argon2id$...` 字符串设为 `ADMIN_TOKEN` 即可。Docker Compose 中需将 `$` 转义为 `$$`。
:::

管理面板可以做什么：
- 查看所有注册用户、组织及其角色
- 移除用户的 2FA、取消授权所有会话、禁用或删除用户
- 调整组织成员角色
- 查看系统诊断信息，检测配置错误
- 后续更多配置（SMTP、WebSocket 等）都可以在面板里直接改

> 注意：管理面板中保存的配置会写入 `config.json`，**优先级高于环境变量**。如果改了环境变量但没生效，检查一下 `config.json` 是否覆盖了它。

## 客户端使用

1. 去 [Bitwarden 下载页面](https://bitwarden.com/download/) 装客户端或浏览器插件
2. 登录界面点左上角设置图标，服务器地址改成你的域名

![浏览器插件页面](/assets/note/1865d83b4adc665f282220d92dae3d47.png)

![自定义服务端](/assets/note/fe8842629a33089b0c62d179dde3f678.png)

3. 用刚才注册的邮箱和主密码登录

Bitwarden 的 iOS、Android、Windows、macOS、Linux 客户端和浏览器插件全部兼容 Vaultwarden，
跟用官方服务没区别。

### 实用技巧

**URI 匹配优化**：浏览器插件默认按「基础域名」匹配密码，会导致同一个主域名下的子站全都弹出来。建议在客户端设置 → 自动填充 → 默认 URI 匹配检测，改为 **主机（Host）**。

**Send 功能**：安全分享文本或文件给他人。支持端到端加密、密码保护、自动过期（最长 31 天），单文件最大 500MB。在网页版或客户端中都能使用。

**两步验证（2FA）**：强烈建议开启。支持 TOTP（Authenticator App）、FIDO2 WebAuthn（硬件密钥）、邮箱验证码等方式。在网页版 → 账户设置 → 两步登录中配置。

**密码生成器**：客户端内置密码生成器，可自定义长度和字符类型（大小写字母、数字、符号），也可生成易读的「密码短语」。

## Docker Compose 部署（进阶）

如果你习惯用 Docker Compose 管理容器，这个方式比 `docker run` 更易维护和迁移。

创建 `docker-compose.yml`：

```yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    volumes:
      - /www/wwwroot/你的域名/data:/data
    environment:
      DOMAIN: "https://你的域名"
      SIGNUPS_ALLOWED: "false"
      ADMIN_TOKEN: "你的随机令牌"
      WEBSOCKET_ENABLED: "true"
    ports:
      - "6789:80"
```

然后一键启动：

```shell
docker compose up -d
```

更新也只需要两条命令：

```shell
docker compose pull
docker compose up -d
```

宝塔面板用户如果装了 Docker 管理器，可以在「终端」里执行这些命令。如果不想用宝塔的反向代理，也可以配合 Nginx Proxy Manager 或 Traefik 等专业的反向代理工具来管理 SSL 和域名路由。

## 后续维护

### 更新

新版本发布后，拉最新镜像重建容器就行，数据目录不受影响：

```shell
docker pull vaultwarden/server:latest
docker stop vaultwarden
docker rm vaultwarden
docker run -d --name vaultwarden \
  -e SIGNUPS_ALLOWED=false \
  -v /www/wwwroot/你的域名/:/data/ \
  -p 6789:80 \
  vaultwarden/server:latest
```

### 备份

密码数据属于一等重要数据，建议遵循 **3-2-1 备份原则**：至少 3 份副本、存于 2 种不同介质、其中 1 份异地存放。

#### 手动备份

所有数据都在映射的服务器目录里，定期打个压缩包：

```shell
tar -czf vaultwarden-backup-$(date +%Y%m%d).tar.gz /www/wwwroot/你的域名/
```

:::warning
直接 tar 打包时如果容器正在写入数据库，备份的 `db.sqlite3` 可能不完整。稳妥做法是**先停容器再备份**：

```shell
docker stop vaultwarden
tar -czf vaultwarden-backup-$(date +%Y%m%d).tar.gz /www/wwwroot/你的域名/
docker start vaultwarden
```

停容器的时间通常不到一秒，几乎不影响使用。
:::

#### GPG 加密备份 + 定时任务

如果备份文件要传到云端（网盘、对象存储），建议先加密再上传：

```shell
# 加密备份
gpg --symmetric --cipher-algo AES256 vaultwarden-backup-$(date +%Y%m%d).tar.gz

# 解密还原
gpg --decrypt vaultwarden-backup-xxx.tar.gz.gpg > vaultwarden-backup.tar.gz
```

配合 cron 定时任务实现自动化：

```shell
# 编辑 crontab
crontab -e

# 每天凌晨 3 点执行备份脚本
0 3 * * * /path/to/backup-vaultwarden.sh
```

备份脚本示例 `backup-vaultwarden.sh`：

```shell
#!/bin/bash
set -e
DATE=$(date +%Y%m%d)
DATA_DIR=/www/wwwroot/你的域名
BACKUP_DIR=/backup/vaultwarden
BACKUP_FILE=vaultwarden-$DATE.tar.gz

mkdir -p $BACKUP_DIR

# 停容器 → 备份 → 重启
docker stop vaultwarden
tar -czf "$BACKUP_DIR/$BACKUP_FILE" -C "$DATA_DIR" .
docker start vaultwarden

# GPG 加密（密码建议存于环境变量或密钥文件中）
gpg --batch --yes --passphrase "$GPG_PASSPHRASE" \
    --symmetric --cipher-algo AES256 "$BACKUP_DIR/$BACKUP_FILE"

# 清理 30 天前的旧备份
find $BACKUP_DIR -name "*.tar.gz*" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gpg"
```

### 安全加固

部署完成后，建议做以下加固：

**1. 以非 root 用户运行容器**

默认容器以 root 身份运行，有一定安全风险。宝塔面板可以在创建容器时勾选「非 root 运行」，命令行加 `--user 1000:1000`：

```shell
docker run -d --name vaultwarden \
  --user 1000:1000 \
  ...其他参数...
  vaultwarden/server:latest
```

:::tip
Docker 20.10+ 默认允许非 root 进程绑定 80 等特权端口，无需额外配置。
:::

**2. 关闭密码提示**

登录页默认显示密码提示，可能被攻击者利用进行密码猜测。在管理面板中取消勾选「Show password hints」即可关闭。

**3. 只允许域名访问**

避免通过 IP 直接访问（如 `https://1.2.3.4`），公网 IP 会被不断扫描，增加暴露风险。在宝塔面板的反向代理配置中确保只响应域名请求。

**4. 配置 fail2ban 防暴力破解**

若未开启 2FA，理论上可暴力破解主密码。安装 fail2ban 并配置 Vaultwarden 规则，多次登录失败后自动封禁 IP。详见 [Vaultwarden Fail2Ban 设置](https://github.com/dani-garcia/vaultwarden/wiki/Fail2Ban-Setup)。

**5. 定期更新**

Vaultwarden 更新频繁且常包含安全修复。建议关注 [GitHub Releases](https://github.com/dani-garcia/vaultwarden/releases)，每个月拉一次最新镜像重建容器。

### 常用环境变量参考

| 变量 | 说明 | 示例 |
|------|------|------|
| `SIGNUPS_ALLOWED` | 是否允许公开注册 | `true` / `false` |
| `ADMIN_TOKEN` | 管理面板访问令牌 | 随机字符串或 Argon2 哈希 |
| `DOMAIN` | 服务域名（用于生成链接） | `https://vault.example.com` |
| `WEBSOCKET_ENABLED` | 开启 WebSocket 实时同步 | `true` / `false` |
| `SMTP_HOST` | 邮件服务器地址 | `smtp.qq.com` |
| `SMTP_FROM` | 发件人地址 | `noreply@example.com` |
| `SMTP_PORT` | 邮件服务器端口 | `587` |
| `SMTP_SECURITY` | 加密方式 | `starttls` / `force_tls` |
| `SMTP_USERNAME` | 邮箱账号 | `your@email.com` |
| `SMTP_PASSWORD` | 邮箱密码或授权码 | `your_password` |
| `LOG_FILE` | 日志文件路径 | `/data/vaultwarden.log` |
| `LOG_LEVEL` | 日志级别 | `warn` / `info` / `debug` |

更详细的配置（SMTP 邮件通知、WebSocket、管理员面板等）可以看 [Vaultwarden Wiki](https://github.com/dani-garcia/vaultwarden/wiki)。

## 常见问题

### 忘记主密码怎么办？

主密码是端到端加密的，服务端无法找回。如果忘记了，只能删除数据目录重新部署，之前的所有密码数据无法恢复。**务必把主密码记在安全的地方。**

### 部署后网站打不开 / 浏览器提示不安全？

1. 检查容器是否正常运行：`docker ps | grep vaultwarden`
2. 检查反向代理的端口号是否跟容器映射的服务器端口一致
3. 确认 SSL 证书已正确配置（宝塔面板 → 站点设置 → SSL）

### 端口冲突怎么处理？

创建容器时「服务器端口」避开常用端口（80、443、3306、6379 等）。用哪个端口，反向代理的目标 URL 就填 `http://127.0.0.1:端口号`。

### 如何迁移数据到新服务器？

打包数据目录传到新服务器即可：

```shell
# 旧服务器
tar -czf vaultwarden-data.tar.gz /www/wwwroot/你的域名/

# 传到新服务器后解压到相同路径，再 docker run
```

所有密码库和配置都在数据目录里，迁移不需要额外操作。

### 支持 WebSocket 通知吗？

支持。创建容器时加上环境变量 `WEBSOCKET_ENABLED=true`，并在宝塔反向代理中开启 WebSocket 支持。配置后浏览器插件和移动端可以实时同步，不用手动刷新。

### 可以多用户使用吗？

创建第一个账号后关闭公开注册（`SIGNUPS_ALLOWED=false`），之后可以通过管理员面板邀请其他用户。管理员面板需要在环境变量中设置 `ADMIN_TOKEN`。详见 [Vaultwarden Wiki](https://github.com/dani-garcia/vaultwarden/wiki)。

## 相关阅读

- [宝塔 Docker 安装为知笔记私有部署](/article/wiz-docker) — 同样是宝塔 + Docker 自托管方案
- [VPS 常用命令](/article/vps-command) — 服务器运维常用命令速查
- [Bitwarden 官方自托管指南](https://bitwarden.com/help/self-host-vaultwarden/)
- [Vaultwarden GitHub Wiki](https://github.com/dani-garcia/vaultwarden/wiki)
- [Docker Hub — vaultwarden/server](https://hub.docker.com/r/vaultwarden/server)
