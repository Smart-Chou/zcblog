// 网站基本信息配置

/**
 * 网站基本信息配置
 */
export interface SiteConfig {
    title: string; // 网站标题
    subtitle: string; // 网站副标题
    description: string; // 网站描述
    keywords: string; // 网站关键字
    favicon: string; // 网站图标URL
    logo: string; // 网站logo
    coverImage: string; // 网站封面
    coverImageAlt: string; // 网站封面Alt
    url: string; // 网站链接
    domains: string[]; // 网站域名列表，用于重定向白名单和统计
    startYear: string; // 网站开始年份
    beian: string; // 中国政策 / 萌 ICP
    beianURL: string; // ICP备案链接
}

/**
 * 图床服务配置
 */
export interface ImageServiceConfig {
    baseUrl: string; // 图床基础URL
    randomPath: string; // 随机图片路径
    picPath: string; // 指定图片路径
}

/**
 * 作者信息配置
 */
export interface AuthorConfig {
    type: string; // 个人资料中使用的名字
    url: string; // 作者个性独立页面,如果有的话
    motto: string; // 个人资料中使用的口头禅
    avatar: string; // 个人资料中使用的头像
}

/**
 * Meta Twitter配置
 */
export interface TwitterConfig {
    type: string; // twitter 账号
    link: string; // twitter 名称
}

/**
 * 页面配置
 */
export interface PageConfig {
    title: string; // 页面标题
    description: string; // 页面描述
}

/**
 * 网站基本信息
 */
export const site: SiteConfig = {
    title: "Marx's Blog",
    subtitle: "这里没有答案，但有同路人。",
    description:
        "MarxChou 的个人博客。深圳非科班独立开发者，兼职探索欧美 SaaS。用 AI 辅助编程从零搭建产品，记录工具调研、踩坑解法、想法验证与收入数据。",
    keywords:
        "Marx's Blog, MarxChou, 独立开发者, indie developer, SaaS, 工具调研, 踩坑, 编程, AI 编程",
    favicon: "favicon.svg",
    logo: "logo.webp",
    coverImage: "cover.png",
    coverImageAlt: "Marx's Blog",
    url: "https://marxchou.com",
    domains: ["marxchou.com", "mcc.im"],
    startYear: "2020",
    beian: "萌ICP备20249889号",
    beianURL: "https://icp.gov.moe/?keyword=20249889",
};

/**
 * 图床服务
 */
export const imageService: ImageServiceConfig = {
    baseUrl: "https://pic-api.marxchou.com",
    randomPath: "/api/random",
    picPath: "/api/pic",
};

/**
 * Meta Twitter配置
 */
export const twitter: TwitterConfig = {
    type: "@marxchou",
    link: "@marxchou",
};

/**
 * 作者信息
 */
export const author: AuthorConfig = {
    type: "MarxChou",
    url: "https://marxchou.com",
    motto: "这里没有答案，但有同路人。",
    avatar: "logo.webp",
};

/**
 * 404页面配置
 */
export const notFoundPage: PageConfig = {
    title: "404 - Page Not Found",
    description: "The page you are looking for does not exist.",
};

/**
 * 标签页面配置
 */
export const tagsPage: PageConfig = {
    title: "Tags",
    description: "All Tags",
};

/**
 * 归档页面配置
 */
export const archivesPage: PageConfig = {
    title: "Archives",
    description: "All Archives",
};

/**
 * 重定向页面配置
 */
export const redirectPage: PageConfig = {
    title: "Redirect",
    description: "Redirect Website",
};
