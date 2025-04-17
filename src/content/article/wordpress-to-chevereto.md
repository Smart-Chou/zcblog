---
title: WordPress编辑器中添加“上传到Chevereto图床”
description: WordPress编辑器中添加“上传到Chevereto图床”
pubDate: 2020-11-26
image:
  url: 'https://pic.mcc.im/images?A9xP5t'
  alt: 'wait-this-is-not-my-commit'
tags:
  - 图床
---

## 缘由

之前我的图片是放在用oneindex搭建的网盘上，blog文章的图片存放在Onedrive上，同步至
oneindex，但似乎OneDrive的api接口对访问量有限制，有时我浏览博客的会发现图片不能
显示。

这样的情况持续了很久,直到我偶然了解到了 Chevereto ，于是决定搭建一个图床来存放图
片。

前段时间我把我博客文章的图片一张一张从OneDrive上转移到了Chevereto图床，虽然我的
图片不算太多，但这种在图床页面上传再回到博客文章编辑页面的方式浪费了我很多时间，
并且以后更新文章也会使用图床，我可不想这样一步步傻傻地操作。

在Chevereto的仪表发现了API V1后，我开始研究。网上关于这个的资料很少，作为一个小
白，我的探索之路很是艰辛。

先上一张成果图：

![效果图](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/Chevereto.png)

:::tip
支持多张图片上传哦！
:::

## 获取API KEY

- 准备一个`Chevereto`搭建的图床（废话！），不会搭建的话请`Google`
- 登录，转到`仪表盘-设置-API`，将`API v1 key`记录下来，一会儿要用

## API后端设置

进入`Chevereto`的安装目录，将`app/routes/route.api.php`文件拷贝
到`app/routes/overrides/route.api.php`文件

### 允许跨域

打开`app/routes/overrides/route.api.php`，第二行（`<?php后面`）添加如下几行

```php
header('Access-Control-Allow-Origin: https://spiritx.xyz');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-Requested-With, Origin, Accept');
```

记得把白名单`https://spiritx.xyz`改成自己的域名或者改成`*`

### 设置API user(可选)

在`app/routes/overrides/route.api.php`中，找到

```php
$uploaded_id = CHV\Image::uploadToWebsite($source);
```

那一行，更改为

```php
$uploaded_id = CHV\Image::uploadToWebsite($source,spirit);
```

将`spirit`替换为图床中的用户

## 前端添加上传按钮(media button)

将以下代码添加到`WordPress`正在使用的**主题目录**的`functions.php`中

```php
//添加图床上传按钮
add_action('media_buttons', 'add_my_media_button');
function add_my_media_button() {
    $currentUser = wp_get_current_user();
        if(!empty($currentUser->roles) && in_array('administrator', $currentUser->roles)){
            $DOMAIN="图床的域名";
            $APIkey="图床的API v1 key";// 是管理员
        }
        else
            return 0;  // 非管理员
    echo '
            <input id="up_to_chevereto" type="file" accept="image/*" multiple="multiple"/>
            <label for="up_to_chevereto" id="up_img_label"><i class="fa fa-picture-o" aria-hidden="true"></i> 上传图片到Chevereto</label>
          ';
?>
<style type="text/css">
#up_to_chevereto {
  display: none;
}
#up_img_label {
  color: #fff;
  background-color: #16a085;
  border-radius: 5px;
  display: inline-block;
  padding: 5.2px;
}
</style>
<script type="text/javascript">
jQuery('#up_to_chevereto').change(function() {
  window.wpActiveEditor = null;
  for (var i = 0; i < this.files.length; i++) {
    var f=this.files[i];
    var formData=new FormData();
    formData.append('source',f);
    jQuery.ajax({
        async:true,
        crossDomain:true,
    image:
    url:'https://<?php echo $DOMAIN; ?>/api/1/upload/?key=<?php echo $APIkey; ?>&format=json',
        type : 'POST',
        processData : false,
        contentType : false,
        data:formData,
        beforeSend: function (xhr) {
            jQuery('#up_img_label').html('<i class="fa fa-spinner rotating" aria-hidden="true"></i> Uploading...');
        },
        success:function(res){
            wp.media.editor.insert('<a href="'+res.image.url+'"><img src="'+res.image.url+'" alt="'+res.image.title+'"></img></a>');
            jQuery("#up_img_label").html('<i class="fa fa-check" aria-hidden="true"></i> 上传成功,继续上传');
        },
        error: function (){
            jQuery("#up_img_label").html('<i class="fa fa-times" aria-hidden="true"></i> 上传失败，重新上传');
        }
    });
  }
});
</script>
<?php
}
```

`style`里的样式可以根据自己偏好自定义

## 使用预览

这里我的编辑器用的是`WP Editor.md`，界面不同但不影响上传按钮的使用

![上传界面](https://cdn.jsdelivr.net/gh/Smart-Chou/webphoto@latest/note/29cc590dd171182f21d9772b635f8f64.gif)

## 更新

有几个小伙伴反馈说上传有问题，了解情况后主要是`https`混用和`CORS`的问题，故在这
里更新上传方法，上传方式改用`WordPress REST API`，为了保证兼容，请确
保`WordPress`版本为`4.9+`。注意：**前文的操作均不用管**，以下的操作均在
`functions.php` 中完成。

### 注册路由

```php
add_action('rest_api_init', function () {
    register_rest_route('chevereto/v1', '/image/upload', array(
        'methods' => 'POST',
        'callback' => 'upload_to_chevereto',
    ));
});
```

之后，可以使用`post`的方式发送数据到
`http(s)://博客域名/chevereto/v1/image/upload` 来上传图片。

### 加入回调函数

```php
function upload_to_chevereto() {
    //Authentication
    if (!check_ajax_referer('wp_rest', '_wpnonce', false)) {
        $output = array('status' => 403,
            'message' => 'Unauthorized client.',
            'link' => $link,
        );
        $result = new WP_REST_Response($output, 403);
        $result->set_headers(array('Content-Type' => 'application/json'));
        return $result;
    }
    $image = file_get_contents($_FILES["chevereto_img_file"]["tmp_name"]);
    $upload_url = '图床的域名/api/1/upload';
    $args = array(
        'body' => array(
            'source' => base64_encode($image),
            'key' => '图床的API v1 key',
        ),
    );

    $response = wp_remote_post($upload_url, $args);
    $reply = json_decode($response["body"]);

    if ($reply->status_txt == 'OK' && $reply->status_code == 200) {
        $status = 200;
        $message = "success";
        $link = $reply->image->image->url;
    } else {
        $status = $reply->status_code;
        $message = $reply->error->message;
        $link = $link;
    }
    $output = array(
        'status' => $status,
        'message' => $message,
        'link' => $link,
    );
    $result = new WP_REST_Response($output, $status);
    $result->set_headers(array('Content-Type' => 'application/json'));
    return $result;
}
```

将图床的域名和图床的`API v1 key`填写完整，注意加上`http或https`

### 后台编辑器添加按钮

```php
//添加图床上传按钮
add_action('media_buttons', 'add_my_media_button');
function add_my_media_button() {
    echo '
            <input id="up_to_chevereto" type="file" accept="image/*" multiple="multiple"/>
            <label for="up_to_chevereto" id="up_img_label"><i class="fa fa-picture-o" aria-hidden="true"></i> 上传图片到Chevereto</label>
          ';
?>
<style type="text/css">
#up_to_chevereto {
  display: none;
}
#up_img_label {
  color: #fff;
  background-color: #16a085;
  border-radius: 5px;
  display: inline-block;
  padding: 5.2px;
}
</style>
<script type="text/javascript">
jQuery('#up_to_chevereto').change(function() {
  window.wpActiveEditor = null;
  for (var i = 0; i < this.files.length; i++) {
    var f=this.files[i];
    var formData=new FormData();
    formData.append('chevereto_img_file',f);
    jQuery.ajax({
        async:true,
        crossDomain:true,
    image:
    url:'<?php echo rest_url("chevereto/v1/image/upload") ."?_wpnonce=". wp_create_nonce("wp_rest"); ?>',
        type : 'POST',
        processData : false,
        contentType : false,
        data:formData,
        beforeSend: function () {
            jQuery('#up_img_label').html('<i class="fa fa-spinner rotating" aria-hidden="true"></i> Uploading...');
        },
        success:function(res){
            if (res.status == 200) {
                wp.media.editor.insert('<a href="'+res.link+'"><img src="'+res.link+'" alt="'+f.name+'"></img></a>');
                jQuery("#up_img_label").html('<i class="fa fa-check" aria-hidden="true"></i> 上传成功,继续上传');
            }else{
                console.log("code: "+res.status+"message: "+res.message);
            }
        },
        error: function (){
            jQuery("#up_img_label").html('<i class="fa fa-times" aria-hidden="true"></i> 上传失败，重新上传');
        }
    });
  }
});
</script>
<?php
}
```

然后就开始使用吧 :smile:
