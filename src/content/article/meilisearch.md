---
title: meilisearch
description: meilisearch
pubDate: 2021-12-30
image:
    url: "https://pic-api.marxchou.com/api/random?7Hk3X2"
    alt: "wait-this-is-not-my-commit"
tags:
    - meilisearch
sticky: 10
---

该插件用于让 Vuepress 的搜索栏支持全文搜索。

- 当用户在搜索栏中输入字符串时，该插件会实时地向 meilisearch 服务器发出 AJAX 形
  式的查询请求，然后将查询结果显示在搜索栏下方。

meilisearch 是一个开源的搜索引擎，采用 Rust 语言开发，借鉴了 Algolia 引擎，适合
用于实现个人网站的搜索栏。

- [官网(opens new window)](https://docs.meilisearch.com/)
- 使用 meilisearch 的主要流程如下：
    1. 运行 meilisearch 服务器。
    2. 执行 meilisearch 的 scrape 工具，抓取目标网站的内容信息，并送到 meilisearch
       服务器中存储。 每当目标网站的内容更新时，就应该抓取一次。
    3. 向 meilisearch 服务器发出 HTTP 查询请求，搜索某一字符串在目标网站上的位置。

:::danger
着重提示插件、服务器、抓取程序，三者的适配（版本）要一致，不然会报
错，无数据。可以在[GIthub](https://github.com/meilisearch)查看三者版本
:::

:::note
此时文档所使用的版本：meilisearch: v0.26.1 docs-scraper: v0.12.1
vuepress-plugin-meilisearch: v0.12.1
:::

## 使用步骤

1. 启动 meilisearch 服务器：

    ```sh
    docker run -d --name meilisearch --restart=always \
        -p 7700:7700 \
        -e MEILI_HTTP_ADDR=0.0.0.0:7700 \
        -v /path/to/data.ms:/data.ms \
        getmeili/meilisearch:v0.26.1
    ```

    - 启动 meilisearch 服务器时，默认没有设置密钥，允许用户访问任意 URL 。设置密
      钥就可以拒绝非法用户的访问。密钥尽量长一些。

    - 可以设置环境变量

        ```
        MEILI_MASTER_KEY=******
        ```

        即；

        ```sh
        docker run -d --name meilisearch --restart=always \
        -p 7700:7700 \
        -e MEILI_MASTER_KEY=myMasterKey \
        -e MEILI_HTTP_ADDR=0.0.0.0:7700 \
        -v /path/to/data.ms:/data.ms \
        getmeili/meilisearch:v0.26.1
        ```

        作为主密钥，此时会自动生成私钥和公钥，发送以下 HTTP 请求即可查询到：

        ```sh
        [root@CentOS ~]# curl \
        > -X GET 'http://ip:7700/keys' \
        > -H 'Authorization: Bearer myMasterKey'
        ```

        会返回俩个密钥：`Default Search API Key` 和 `Default Admin API Key`

    - 如果用户在发出的 HTTP 查询请求的 headers 中加上 `Default Admin API Key`（主
      密钥一般不用于查询），才有权访问除了 `/keys` 以外的 URL 。如果使用 Default
      Search API Key，则只有权查询 `/indexes` 下的部分内容。

    - 部署新的 meilisearch 时，索引不能向上兼容，需要清空 `/data.ms` 目录，重新生
      成索引。

2. 执行 meilisearch 的 scrape 工具：

    ```sh
    docker run -t --rm \
        --network=host \
        -e MEILISEARCH_HOST_URL='http://ip:7700' \
        -e MEILISEARCH_API_KEY='myMasterKey' \
        -v /path/to/docs-scraper.json:/docs-scraper/config.json \
    getmeili/docs-scraper:v0.12.1 pipenv run ./docs_scraper config.json
    ```

    这里需要创建 scrape 的配置文件 docs-scraper.json ，如下：

    ```json
    {
        "index_uid": "docs", // 索引 ID ，用于区分不同的抓取结果
        "sitemap_urls": ["http://test.com/sitemap.xml"],
        "start_urls": ["http://test.com"], // 待抓取的目标网站
        "selectors": {
            "lvl0": {
                "selector": ".sidebar-heading.open",
                "global": true,
                "default_value": "Documentation"
            },
            "lvl1": ".theme-default-content h1",
            "lvl2": ".theme-default-content h2",
            "lvl3": ".theme-default-content h3",
            "lvl4": ".theme-default-content h4",
            "lvl5": ".theme-default-content h5",
            "text": ".theme-default-content p, .theme-default-content li"
        },
        "strip_chars": " .,;:#",
        "scrap_start_urls": true
    }
    ```

3. 安装：`yarn add vuepress-plugin-meilisearch`

4. 在 config.js 中添加如下配置：

    ```js
    module.exports = {
        plugins: [
            [
                "vuepress-plugin-meilisearch",
                {
                    hostUrl: "http://ip:7700", // 该 URL 应该能在用户的浏览器上被访问，不能为 localhost
                    apiKey: "Default Search API Key", // 这里应该使用 Search key
                    indexUid: "docs",
                    placeholder: "Search as you type...", // 在搜索栏中显示的占位符
                    maxSuggestions: 5, // 最多显示几个搜索结果
                    cropLength: 30, // 每个搜索结果最多显示多少个字符
                },
            ],
        ],
    };
    ```

5. 重新编译 Vuepress 网站。
