// UI相关配置

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
 * 友链配置项
 */
export interface FriendItem {
    id: string; // friends ID
    link: string; // 链接
    avatar: string; // 头像
    style: string; // 背景颜色样式
}

/**
 * 友链页面配置
 */
export interface FriendsPageConfig {
    title: string; // 标题
    note: string; // 描述
    list: FriendItem[]; // 友链列表
}

/**
 * 页脚配置项
 */
export interface FooterItem {
    title: string; // 标题
    text: string; // 描述
    color: string; // 背景颜色样式
    logo: string; // simple-icons 图标
    logoColor: string; // 图标颜色样式
    labelColor: string; // 标签背景颜色
    url: string; // 链接
}

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
        svg: "simple-icons:ghostery",
    },
    {
        url: "//twitter.com/realSpencerWoo",
        title: "🔗 @realSpencerWoo",
        style: "color: #1da1f2",
        svg: "logos:twitter",
    },
    {
        url: "//t.me/realSpencerWoo",
        title: "🔗 @realSpencerWoo",
        style: "color: #179cde",
        svg: "logos:telegram",
    },
    {
        url: "//github.com/spencerwooo",
        title: "🔗 @spencerwooo",
        style: "color: var(--title-color)",
        svg: "simple-icons:github",
    },
];

/**
 * 友链页面配置
 */
export const friendsPage: FriendsPageConfig = {
    title: "Friends & Guestbook",
    note: "I don't accept friend link requests from someone I don't know.",
    list: [
        {
            id: "@Felinae",
            link: "https://code.felinae98.cn/",
            avatar: "https://avatars.githubusercontent.com/u/23295345",
            style: "color: #fff; background-color: #473922",
        },
        {
            id: "@agnoCJY",
            link: "https://jychuuu.com/",
            avatar: "https://avatars.githubusercontent.com/u/46088026",
            style: "color: #fff; background-color: #191919",
        },
        {
            id: "@TenkeySeven",
            link: "https://blog.tenkeyseven.com/",
            avatar: "https://avatars.githubusercontent.com/u/33371927",
            style: "color: #fff; background-color: #b59672",
        },
        {
            id: "@Silvester",
            link: "https://silvester.wang/",
            avatar: "https://avatars.githubusercontent.com/u/34436920",
            style: "color: #fff; background-color: #595058",
        },
        {
            id: "@ash0ne",
            link: "https://blog.ash0ne.com/",
            avatar: "https://avatars.githubusercontent.com/u/28522665",
            style: "color: #fff; background-color: #9f8cd1",
        },
        {
            id: "@FKY",
            link: "http://blog.fkynjyq.com/",
            avatar: "https://avatars.githubusercontent.com/u/16451516",
            style: "color: #fff; background-color: #005240",
        },
        {
            id: "@idealclover",
            link: "https://idealclover.top/",
            avatar: "https://avatars.githubusercontent.com/u/24428416",
            style: "color: #fff; background-color: #487747",
        },
        {
            id: "@kastnerorz",
            link: "https://github.com/kastnerorz",
            avatar: "https://avatars.githubusercontent.com/u/26199342",
            style: "color: #fff; background-color: #26498e",
        },
        {
            id: "@Patrick Wu",
            link: "https://patrickwu.space/",
            avatar: "https://avatars.githubusercontent.com/u/15316889",
            style: "color: #fff; background-color: #61a3cf",
        },
    ],
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
