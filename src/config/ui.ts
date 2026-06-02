// UI相关配置

/**
 * 主导航链接
 */
export interface NavLink {
    label: string;
    href: string;
}

/**
 * 导航栏配置项
 */
export interface CategoryItem {
    url: string; // 链接
    title: string; // 标题
    style?: string; // 颜色样式
    target: string; // 目标
    svg: string; // icon
}

/**
 * 社交链接配置项
 */
export interface SocialLinkItem {
    url: string; // 链接
    title: string; // 标题
    style: string; // 颜色样式
    svg: string; // icon
}

/**
 * 友链页面配置
 */
export interface FriendsPageConfig {
    title: string; // 标题
    note: string; // 描述
}

/**
 * 页脚配置项
 */
export interface FooterItem {
    title: string; // 标题
    text: string; // 描述
    color: string; // 背景颜色样式
    logo: string; // iconify-json icons 图标
    logoColor: string; // 图标颜色样式
    labelColor: string; // 标签背景颜色
    url: string; // 链接
}

/**
 * 主导航链接
 */
export const navLinks: NavLink[] = [
    { label: "首页", href: "/" },
    { label: "博客", href: "/blog/1/" },
    { label: "友人", href: "/friends/" },
    { label: "归档", href: "/archives/" },
    { label: "标签", href: "/tags/" },
    { label: "番剧", href: "/bangumi/" },
    { label: "相册", href: "/albums/" },
    { label: "随笔", href: "/talks/" },
];

/**
 * 导航栏配置
 */
export const categories: CategoryItem[] = [
    {
        url: "//memos.marxchou.com",
        title: "🥳 Feed",
        style: "color: orange",
        target: "_blank",
        svg: "tabler:brain",
    },
    {
        url: "/albums/",
        title: "📷 Albums",
        style: "color: #3498db",
        target: "_self",
        svg: "tabler:photo",
    },
    {
        url: "/friends/",
        title: "🧑🏿‍🚒 Friends",
        style: "color: #06a878",
        target: "_self",
        svg: "tabler:message-chatbot-filled",
    },
    {
        url: "/archives/",
        title: "📂 Archives",
        style: "color: var(--title-color)",
        target: "_self",
        svg: "tabler:archive-filled",
    },
    {
        url: "/tags/",
        title: "🏷️ tags",
        style: undefined,
        target: "_self",
        svg: "tabler:tags",
    },
];

/**
 * 社交链接配置
 */
export const socialLinks: SocialLinkItem[] = [
    {
        url: "//mcc.im",
        title: "🚀 Portfolio",
        style: "color: var(--title-color)",
        svg: "mingcute:world-2-fill",
    },
    {
        url: "//x.com/MIFSH912",
        title: "🔗 @MIFSH912",
        style: "color: #1da1f2",
        svg: "logos:twitter",
    },
    {
        url: "//t.me/MarxChou",
        title: "🔗 @MarxChou",
        style: "color: #179cde",
        svg: "logos:telegram",
    },
    {
        url: "//github.com/Smart-Chou",
        title: "🔗 @Smart-Chou",
        style: "color: var(--title-color)",
        svg: "logos:github-icon",
    },
];

/**
 * 友链页面配置
 */
export const friendsPage: FriendsPageConfig = {
    title: "Friends",
    note: "欢迎申请友链，在评论区留下你的博客信息即可。",
};

/**
 * 页脚配置
 */
export const footerList: FooterItem[] = [
    {
        title: "Astro",
        text: "Generator",
        color: "Lime",
        logo: "astro",
        logoColor: "red",
        labelColor: "pink",
        url: "//astro.build",
    },
    {
        title: "Vercel",
        text: "Deploy",
        color: "Lime",
        logo: "vercel",
        logoColor: "white",
        labelColor: "cyan",
        url: "//vercel.com",
    },
];
