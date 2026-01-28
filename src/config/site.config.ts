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
    startYear: string; // 网站开始年份
    beian: string; // 中国政策 / 萌 ICP
    beianURL: string; // ICP备案链接
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
 * Twitter配置
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
    title: "Spencer's Blog",
    subtitle: "Spencer Woo",
    description:
        "Astro builds fast content sites, powerful web applications, dynamic server APIs, and everything in-between.",
    keywords: "Astro, Theme, Yi",
    favicon: "favicon.svg",
    logo: "logo.svg",
    coverImage: "cover.png",
    coverImageAlt: "Spencer's Blog",
    url: "https://marxchou.com",
    startYear: "2017",
    beian: "萌ICP备20249889号",
    beianURL: "https://icp.gov.moe/?keyword=20249889",
};

/**
 * 作者信息
 */
export const author: AuthorConfig = {
    type: "Spencer Woo",
    url: "https://marxchou.com",
    motto: "阿巴阿巴 o((>ω< ))o",
    avatar: "author.jpg",
};

/**
 * Twitter配置
 */
export const twitter: TwitterConfig = {
    type: "@marxchou",
    link: "@marxchou",
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
