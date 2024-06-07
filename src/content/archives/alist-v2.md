---
title: 目录列表程序AList使用教程
description: 目录列表程序AList使用教程
pubDate: 2021-10-25
category: 文档
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Alist
---

## 简介

AList是一款支持多种存储的目录文件列表程序，后端基于`go-fiber`，前端使用`react`。

## 项目地址

- [alist](https://github.com/Xhofe/alist)
- [alist-web](https://github.com/Xhofe/alist-web)

## 预览

- [稳定版本](https://alist.nn.ci),即Github Release的最新版本
- [开发版本](https://alist.now.sh),随着GitHub提交更新

![alist预览图片](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/68747470733a2f2f73746f72652e686579746170696d6167652e636f6d2f63646f2d706f7274616c2f666565646261636b2f3230323131312f30332f36393565663737383534613134346539323835313865666465333864623937612e706e67)

## 手动部署

### 快速开始

1. 打开[AList Release](https://github.com/Xhofe/alist/releases)下载要部署的系统
   对应的文件
2. 解压下载对文件得到可执行文件：`tar -zxvf alist-xxxx.tar.gz`（Linux）
3. 赋予程序执行权限：`chmod +x alist-xxxx`
4. 运行程序：`./alist-xxxx`
5. 完成，后台默认密码为`alist`

### 守护进程

`vim /usr/lib/systemd/system/alist.service`添加以下内容，其
中`path_alist`为`alist`所在的路径

```
[Unit]
Description=alist
After=network.target

[Service]
Type=simple
WorkingDirectory=path_alist
ExecStart=path_alist/alist-xxxx -conf conf.yml
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

然后`systemctl daemon-reload`重载配置，现在你就可以使用这些命令来管理程序了：

- 启动: `systemctl start alist`
- 关闭: `systemctl stop alist`
- 自启: `systemctl enable alist`
- 状态: `systemctl status alist`

## 使用Docker

- 开发
  版：`docker run -d --restart=always -v /etc/alist:/opt/alist/data -p 5244:5244 --name="alist" xhofe/alist:v2`
- 稳定
  版：`docker run -d --restart=always -v /etc/alist:/opt/alist/data -p 5244:5244 --name="alist" xhofe/alist:latest`
- 指定版本：具体见 <https://hub.docker.com/r/xhofe/alist>

## 从源码运行

首先需要有`nodejs`、`yarn`、`golang>1.17`的环境

### 构建前端

clone <https://github.com/Xhofe/alist-web> 这个项目，执行`yarn&& yarn build`，得
到dist目录下的目标文件。

### 构建后端

将上一步dist目录下的文件全部拷贝至 <https://github.com/Xhofe/alist> 项目下的
public目录，然后：

```go
appName="alist"
builtAt="$(date +'%F %T %z')"
goVersion=$(go version | sed 's/go version //')
gitAuthor=$(git show -s --format='format:%aN <%ae>' HEAD)
gitCommit=$(git log --pretty=format:"%h" -1)
gitTag=$(git describe --long --tags --dirty --always)
ldflags="\
-w -s \
-X 'github.com/Xhofe/alist/conf.BuiltAt=$builtAt' \
-X 'github.com/Xhofe/alist/conf.GoVersion=$goVersion' \
-X 'github.com/Xhofe/alist/conf.GitAuthor=$gitAuthor' \
-X 'github.com/Xhofe/alist/conf.GitCommit=$gitCommit' \
-X 'github.com/Xhofe/alist/conf.GitTag=$gitTag' \
"
go build -ldflags="$ldflags" alist.go
```

## 反向代理

程序默认监听5244端口，要实现https访问，需要使用nginx反向代理，在配置文件中加入

```nginx
  location / {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_redirect off;
      proxy_pass http://127.0.0.1:5244;
  }
```

## 使用

**后台默认密码为`alist`**

## 添加账号

### 所有账号的必填项

- `name`（名称）：唯一标识符，也是当有多个账号时展示的路径
- `index`（索引）：当有多个账号时，用于排序，越小越靠前
- `proxy`（带理）：是否允许服务器中转下载

### 本地存储

只需填写根目录路径即可，可以是绝对路径，也可以是程序所在的相对路径

### 阿里云盘

- `refresh_token`（刷新令盘）：如何获取参
  见<https://media.cooluc.com/decode_token/>
- 根目录`file_id`：打开阿里云盘官网，点进去你要设置的文件夹时url后面的一串，
  如`https://www.aliyundrive.com/drive/folder/5fe01e1830601baf774e4827a9fb8fb2b5bf7940`就
  是`5fe01e1830601baf774e4827a9fb8fb2b5bf7940`
- `order_by`（排序）：可选值为`name`，`size`，`updated_at`，`created_at`
- `order_direction`（排序方向）：可选`ASC`（正序），`DESC`（倒序）

### Onedrive

打开:<https://tool.nn.ci/onedrive/request>

#### 创建应用

- 在打开的页面，选择所在区域，点击创建应用
- 登陆后选择「`注册应用程序`」，输入「`名称`」，选择
  「`任何组织目录中的账户和个人`」（注意这里不要看位置选择而是看文字，部分人可能
  是中间那个选项，不要选成单一租户或者其他选项，否则会导致登陆时出现问题），输入
  重定向 `URL` 为 `https://tool.nn.ci/onedrive/callback`，「`注册`」即可，然后可
  以得到`client_id`
- 注册好应用程序之后，选择「`证书和密码`」，点击「`新客户端密码`」，输入一串密
  码，选择时间为最长的那个，点击「`添加`」（注：在添加之后输入的密码之后会消失，
  请记录下来 `client_secret` 的值）

#### 获取刷新令牌

将上一步骤中获得的`client_id`和`client_secret`填
入[这个页面](https://tool.nn.ci/onedrive/request)，点击获取刷新令牌，就可以得到
刷新令牌了

#### 获取`Sharepoint site_id`（未测试）

如果需要挂载`Sharepoint`，完成上一步后，在显示刷新令牌的界面会出现一个输入站点地
址，输入站点地址后点击获取`site_id`即可。

#### 添加账号

将上述过程中获取得到的值**依次填入**即可。

### 天翼云盘

填写账号（手机号），密码即可。可能会触发验证码，可等一段时间再重试。

根目录ID：与阿里云盘类似，官网url最后面一串，如：

- `https://cloud.189.cn/web/main/file/folder/-11` -> `-11`
- `https://cloud.189.cn/web/main/file/folder/71398114617385472` ->
  `71398114617385472`

### GoogleDrive（支持团队盘）

参照 <https://install.kenci.workers.dev/> 获
取`client_id`,`client_secret`,`refresh_token`；或：

1. Open
   [Google Drive API](https://console.developers.google.com/apis/api/drive.googleapis.com/overview)
2. Create a
   [OAuth client ID](https://console.developers.google.com/apis/credentials/oauthclient)
3. Install rclone software locally
4. Get refresh_token with rclone

### 123Pan

填写账号密码即可。

## 元信息（meta）设置

此处的`path`（路径）是访问`alist`页面时的`pathname`，如要设
置`https://alist.nn.ci/本地存储`则路径是`/本地存储`

### 设置密码

填写密码字段即可

### 隐藏文件/文件夹

填写`hide`字段，填写要隐藏的文件（夹）名称，以`,`分隔，比如要隐
藏`https://alist.nn.ci/本地存储`下的`README.md`和`index.tsx`文件，则填
写`README.md`,`index.tsx`即可。

## 常见问题

- 向前不兼容版本记录
  - **v2.0.0-beta5**
- 阿里云盘视频无法播放，下载显示`InvalidArgument`？
  - 由于referrer的限制，必须使用移动端token
- 视频播放不了？
  - 检查一下是不是编码不支持，`h5`不支持`h265`编码视频，`ac3/acc`编码音
    频，`Safari`不支持的更多，建议使用软件播放。
- 获取中转链接？
  - 允许中转之后，复制对应文件直链，将`/d`改成`/p`即可。
- 前端文件在哪里？
  - 为方便安装，前端文件与程序打包在一起了，如需修改，请按照从源码运行自行修改编
    译或填写自定义样式/脚本字段。
- 密码忘了怎么半？
  - 命令行 `./alist-xxxx -password`查看。
- 自定义样式/脚本不生效？
  - 是否前后端分开了？自定义部分为后端处理，只有在不分开时才起作用。
- 上传的文件不显示/删除的文件还在？
  - 程序缓存一小时自动失效，后台右上角可手动清除缓存。
