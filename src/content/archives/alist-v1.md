---
title: 阿里云盘列表AList部署教程
description: 阿里云盘列表AList部署教程
pubDate: 2021-06-25
category: 文档
image:
  url: '/postImage/wait-this-is-not-my-commit.png'
  alt: 'wait-this-is-not-my-commit'
tags:
  - Alist
---

## 简介

AList是一款阿里云盘的目录文件列表程序，后端基于`golang`最好的`http`框架`gin`，前
端使用`vue`和`ant design`。没有专门学过前端，大佬轻喷?

:::caution
更新的时候后端和前端文件都需要替换！！！！以及补上配置文件新的配置
项！！！！第一次启动需要网页底部rebuild！！！

更新的时候后端和前端文件都需要替换！！！！以及补上配置文件新的配置项！！！！第一
次启动需要网页底部rebuild！！！

更新的时候后端和前端文件都需要替换！！！！以及补上配置文件新的配置项！！！！第一
次启动需要网页底部rebuild！！！
:::

## 项目地址

- [alist](https://github.com/Xhofe/alist) 分支选择V1
- [alist-web](https://github.com/Xhofe/alist-web)

## 快捷部署

By [大白一号](https://www.cooluc.com/)

- 脚本安装：`bash -c "$(curl -sS https://www.cooluc.com/alist-install.sh)"`
- [refresh_token获取](https://media.cooluc.com/decode_token/)
- [Heroku部署](https://github.com/sbwml/alist-heroku)

## 预览

![alist预览](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/d81d2dab3e5f0.png)

## 如何部署

### 获取`refresh_token`

web端token加入了referrer限制，请参考这
个[issue](https://github.com/Xhofe/alist/issues/88)通过手机端抓包/查找日
志`(/data/media/0/Android/data/com.alicloud.databox/files/logs/trace/)`来获
取`refresh_token`，或使用[这个](https://media.cooluc.com/decode_token/)。

~~为什么不直接使用`access_token`，因为有效期只有两小时。
经[Syc](https://www.hostloc.com/space-uid-22146.html)大佬的提醒，获
取`refresh_token`其实没这么麻烦，我们只需要登陆阿里云盘之后，打开开发者工具，切
换到`Application`选项卡，点开`Local storage`,会有一个token项，点开就可以看
到`refresh_token`了，此处感谢一下[Syc](https://www.hostloc.com/)大佬。~~

### 部署

#### 使用gin作为静态资源服务器

- 前往[AList Release](https://github.com/Xhofe/alist/releases)下载对应系统的程
  序，解压得到一个示例配置文件和一个系统名称文件夹里面包含运行文件`alist`
- 前往`AList-web`下载打包好的前端，解压得到一个`dist`目录放到`alist`同级目录下
- 在同级目录下新建一个配置文件`conf.yml`，复制以下内容到该文件中，或直接使用示例
  配置文件进行修改

```yaml
info:
  title: AList #标题
  logo: '' #网站logo 如果填写,则会替换掉默认的
  footer_text: Xhofe's Blog #网页底部文字
  footer_url: https://www.nn.ci #网页底部文字链接
  music_img: https://img.xhofe.top/2020/12/19/0f8b57866bdb5.gif #预览音乐文件时的图片
  check_update: true #前端是否显示更新
  script: #自定义脚本,可以是脚本的链接，也可以直接是脚本内容
  autoplay: true #视频是否自动播放
  preview:
    text: [
        txt,
        htm,
        html,
        xml,
        java,
        properties,
        sql,
        js,
        md,
        json,
        conf,
        ini,
        vue,
        php,
        py,
        bat,
        gitignore,
        yml,
        go,
        sh,
        c,
        cpp,
        h,
        hpp,
      ] #要预览的文本文件的后缀，可以自行添加
server:
  address: '0.0.0.0'
  port: '5244'
  search: true
  download: true
  static: dist
  site_url: '*'
  password: password #用于重建目录
ali_drive:
  api_url: https://api.aliyundrive.com/v2
  max_files_count: 3000
  drives:
    - refresh_token: xxx #refresh_token
      root_folder: root #根目录的file_id
      name: drive0 #盘名，多个盘不可重复，这里只是示例，不是一定要叫这个名字，可随意修改
      password: pass #该盘密码，空('')则不设密码，修改需要重建生效
      hide: false #是否在主页隐藏该盘，不可全部隐藏，至少暴露一个
    - refresh_token: xxx #只有一个盘的话，该段完全可以删除，反之有更多可以继续添加
      root_folder: root
      name: drive1
      password: pass
      hide: false
database:
  type: sqlite3
  dBFile: alist.db
```

- 填入最开始获取到的`refresh_token`，然后自行修改配置文件中默认的值
- 现在的情况应该是，目录下有两个文件`alist`、`conf.yml`和一个文件夹`dist`:

```
$ tree
.
├── alist
├── conf.yml
└── dist
    ├── favicon.ico
    ├── index.html
    └── static
        ├── css
        │   ├── about.f0b54b1c.css
        │   ├── app.4f0c3e9a.css
        │   └── chunk-vendors.8f913079.css
        ├── img
        │   └── alist.bcb68ba0.png
        └── js
            ├── about.8108f65b.js
            ├── app.34cb39e5.js
            └── chunk-vendors.131f0f41.js

5 directories, 12 files
```

在该文件夹下面执行下面的命令(Linux)

```sh
chmod +x alist
nohup ./alist > log.log 2>&1 &
```

ok，程序已经跑起来了。你可以`cat log.log`看看有没有报错。或者访
问`http://ip:5244`进行查看。

#### 守护进程(可选)

`vim /usr/lib/systemd/system/alist.service`添加以下内容，其
中`path_alist`为`alist`所在的路径

```
[Unit]
Description=alist
After=network.target

[Service]
Type=simple
WorkingDirectory=path_alist
ExecStart=path_alist/alist -conf conf.yml
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

然后`systemctl daemon-reload`重载配置，现在你就可以使用这些命令来管理程序了：

- 启动: `systemctl start alist`
- 关闭: `systemctl stop alist`
- 自启: `systemctl enable alist`
- 状态: `systemctl status alist`

#### 使用mysql(可选)

需要使用utf8mb4编码，修改database部分配置：

```
database:
  type: mysql
  user: 用户名
  password: 密码
  host: 127.0.0.1
  port: 3306
  name: 数据库名
```

#### 自定义静态资源服务器

与使用`gin`作为静态资源服务器操作步骤差不多，不同的地方在于：

- 下载`AList-web`的源码，修改`.env.production`中的`VUE_APP_API_UR`L为具体部署的
  后端地址，然后`yarn && yarn build`自行部署
- `conf.yml`中的`server.site_url`填写前端部署的域名或者默认为`'*'`，需要正确填
  写，否则会报错。
- 建议直接使用`gin`作为静态资源服务器，使用`nginx`的话因为路由使用了`history`模
  式(没有`#`号好看一点)，所以还需要设置一下`nginx`：

```
location / {
  try_files $uri $uri/ /index.html;
}
```

[参考](https://router.vuejs.org/zh/guide/essentials/history-mode.html)

#### 反向代理

程序默认监听5244端口，要实现https访问，需要使用nginx反向代理，在配置文件中加入

```
    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_redirect off;
        proxy_pass http://127.0.0.1:5244;
    }
```

## 常见问题解答

- 如何给文件夹设置密码？
  - 在要加密的目录名称后面加上.password-密码，列表中会自动消除后面的密码部分。
- 如何隐藏文件夹
  - 在要隐藏的文件夹名称后面加上.hide即可。
- 如何重建目录树
  - 点击网页底部的rebuild按钮，输入配置文件中设置的server.password确定即可。
- 如何设置根目录？
  - 修改配置文件中的ali_drive.root_folder 为想要设置的文件夹的file_id即可。文件
    夹的file_id是什么？根目录就是root，其他目录为点进文件夹之后的url中folder/后
    面那一串
- 如何自定义网页底部链接？
  - 修改配置文件中的footer_text和footer_url为要设置的内容，或者不填则不会显示。
- 怎么复制文件直链？
  - 点进文件，右上角有复制直链的按钮。
- 修改网站icon？
  - 替换掉dist目录下的favicon.ico即可。
- 为什么新上传的文件不显示/删除了的文件还在？
  - 列表展示的是本地数据库里的数据，更新文件之后需要重建。
- 如何更新？
  - 前端：下载新的打包好的文件，删掉原来的dist文件夹，解压新的dist放入原来的位置
    即可。
  - 后端：pkill alist 停掉老的进程，删除旧的alist，下载新的alist，查看配置文件，
    补上新的配置项，再次运行即可。
- 运行显示检查更新之后直接报错？
  - 可能是无法访问到GitHub的api，可以在命令行后面加上-skip-update跳过检查更新。
- 怎么指定路径重建？
  - 在哪个路径点rebuild就是在哪里重建。
- The input parameter limit is not valid. limit should be less than 200？
  - [Xhofe/alist-web#22](https://github.com/Xhofe/alist-web/issues/22)
