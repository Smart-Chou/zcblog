// 功能开关配置

/**
 * 网站功能配置
 */
export interface FeaturesConfig {
    lang: string; // 默认网站语言 en | zh-CN
    PageSize: number; // 文章页面上的文章数
    codeFoldingStartLines: number; // 代码折叠起始行数
    ga: string | false; // 如果您想与Google Analytics进行集成，只需在此处输入您的GA-ID即可
    redirect: boolean; // 是否开启链接重定向
    redirectIncludeClass: string[]; // 链接重定向包含的类
    redirectExcludeClass: string[]; // 链接重定向排除的类
}

/**
 * 页面视图配置
 */
export interface ViewConfig {
    backtotop: boolean; // 返回顶部
    author: boolean; // 显示作者
}

/**
 * 捐赠配置
 */
export interface DonateConfig {
    enable: boolean; // 是否启用捐赠功能
    tip: string; // 捐赠提示
    wechatQRCode: string; // 微信二维码图片地址, 图片地址应该放在 public 目录下
    alipayQRCode: string; // 支付宝二维码图片地址, 图片地址应该放在 public 目录下
    paypalUrl: string; // PayPal 捐赠地址
    donators: DonatorItem[]; // 捐赠者列表
}

/**
 * 捐赠者配置项
 */
export interface DonatorItem {
    id: string; // 捐赠者ID
    name: string; // 捐赠者名称
    amount: number; // 捐赠金额
    date: string; // 捐赠日期
    avatar?: string; // 捐赠者头像（可选）
    message?: string; // 捐赠留言（可选）
}

/**
 * Waline评论功能配置
 */
export interface WalineConfig {
    enable: boolean; // 是否启用
    serverUrl: string; // 评论服务器地址
    lang: string; // 评论语言
    pageSize: number; // 评论分页大小
    reaction: string[]; // 是否开启表情
    search: boolean; // 是否开启搜索
    whiteList: string[]; // 白名单 总是开启
}

/**
 * 搜索功能配置
 */
export interface SearchConfig {
    enable: boolean; // pagefind 是否启用
}

/**
 * Umami统计配置
 */
export interface UmamiConfig {
    enable: boolean; // 是否启用
    umamiBaseUrl: string; // Umami服务器地址
    umamiId: string; // Umami网站ID
}

/**
 * 网站功能配置
 */
export const config: FeaturesConfig = {
    lang: "zh-CN",
    PageSize: 9,
    codeFoldingStartLines: 16,
    ga: false,
    redirect: true,
    redirectIncludeClass: ["post__content"],
    redirectExcludeClass: ["modal-mask", "friends-container", "author"],
};

/**
 * 首页视图配置
 */
export const pageView: ViewConfig = {
    backtotop: false,
    author: true,
};

/**
 * 文章页视图配置
 */
export const postView: ViewConfig = {
    backtotop: true,
    author: true,
};

/**
 * 捐赠配置
 */
export const donate: DonateConfig = {
    enable: true,
    tip: "赞赏金额将全部用于开源项目维护，以及服务器、域名及各类云服务的开销",
    wechatQRCode: "/assets/image/WeChatQR.jpg",
    alipayQRCode: "/assets/image/AliPayQR.jpg",
    paypalUrl: "https://paypal.me/xxxxxxxxxx",
    donators: [
        {
            id: "donator-1",
            name: "匿名用户",
            amount: 5,
            date: "2026-01-21",
        },
        {
            id: "donator-2",
            name: "支持者A",
            amount: 10,
            date: "2026-01-20",
        },
        {
            id: "donator-3",
            name: "支持者B",
            amount: 20,
            date: "2026-01-19",
        },
        {
            id: "donator-4",
            name: "支持者C",
            amount: 50,
            date: "2026-01-18",
            message: "感谢你的分享！",
        },
    ],
};

/**
 * 评论系统配置
 */
export const waline: WalineConfig = {
    enable: true,
    serverUrl: "https://waline.marxchou.com",
    lang: "zh-CN",
    pageSize: 16,
    reaction: [],
    search: false,
    whiteList: ["/message/", "/friends/"],
};

/**
 * 搜索功能配置
 */
export const search: SearchConfig = {
    enable: true,
};

/**
 * 统计配置
 */
export const umami: UmamiConfig = {
    enable: true,
    umamiBaseUrl: "https://umami.marxchou.com",
    umamiId: import.meta.env.UMAMI_ID || "73b29141-fccf-4d54-9c2f-f7d0d146f86b",
};
