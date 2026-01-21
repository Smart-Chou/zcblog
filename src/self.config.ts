// 在这个文件中放置全局数据。
// 您可以在整个网站中使用 `import` 关键字从任何地方导入此数据。
// icon/Icon 从 https://icon-sets.iconify.design/ 生成

// 类型定义

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
  enable: boolean; // 是否启用
  host: string; // MeiliSearch Host
  apiKey: string; // MeiliSearch API Key
  indexUid: string; // MeiliSearch Index UID
  hotKeys: string[]; // 搜索热词
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
 * 页面配置
 */
export interface PageConfig {
  title: string; // 页面标题
  description: string; // 页面描述
}

// 配置项定义

/**
 * 网站基本信息
 */
export const site: SiteConfig = {
  title: "Spencer's Blog",
  subtitle: 'Spencer Woo',
  description: 'Astro builds fast content sites, powerful web applications, dynamic server APIs, and everything in-between.',
  keywords: 'Astro, Theme, Yi',
  favicon: 'favicon.svg',
  logo: 'logo.svg',
  coverImage: 'cover.png',
  coverImageAlt: "Spencer's Blog",
  url: 'https://marxchou.com',
  startYear: '2017',
  beian: '萌ICP备20249889号',
  beianURL: 'https://icp.gov.moe/?keyword=20249889',
}

/**
 * 作者信息
 */
export const author: AuthorConfig = {
  type: 'Spencer Woo',
  url: 'https://marxchou.com',
  motto: '阿巴阿巴 o((>ω< ))o',
  avatar: 'author.jpg',
};

/**
 * Twitter配置
 */
export const twitter: TwitterConfig = {
  type: '@marxchou',
  link: '@marxchou',
}

/**
 * 网站功能配置
 */
export const config: FeaturesConfig = {
  lang: 'zh-CN',
  PageSize: 9,
  codeFoldingStartLines: 16,
  ga: false,
  redirect: true,
  redirectIncludeClass: ['post__content'],
  redirectExcludeClass: ['modal-mask'],
}

/**
 * 首页视图配置
 */
export const pageView: ViewConfig = {
  backtotop: false,
  author: true,
}

/**
 * 文章页视图配置
 */
export const postView: ViewConfig = {
  backtotop: true,
  author: true,
}

/**
 * 捐赠配置
 */
export const donate: DonateConfig = {
  enable: true,
  tip: '赞赏金额将全部用于开源项目维护，以及服务器、域名及各类云服务的开销',
  wechatQRCode: '/assets/image/WeChatQR.jpg',
  alipayQRCode: '/assets/image/AliPayQR.jpg',
  paypalUrl: 'https://paypal.me/xxxxxxxxxx',
}

/**
 * 评论系统配置
 */
export const waline: WalineConfig = {
  enable: true,
  serverUrl: 'https://waline.marxchou.com',
  lang: 'zh-CN',
  pageSize: 16,
  reaction: [],
  search: false,
  whiteList: ['/message/', '/friends/'],
}

/**
 * 搜索功能配置
 */
export const search: SearchConfig = {
  enable: true,
  host: 'https://meilisearch.marxchou.com',
  apiKey: import.meta.env.MEILISEARCH_API_KEY || 'c03b8635fea890e7d8bad71c0056031d7daea5e4c2cb32c29b753f517f3f0b5a',
  indexUid: 'marxchou',
  hotKeys: ['/'],
}

/**
 * 统计配置
 */
export const umami: UmamiConfig = {
  enable: true,
  umamiBaseUrl: 'https://umami.marxchou.com',
  umamiId: import.meta.env.UMAMI_ID || '73b29141-fccf-4d54-9c2f-f7d0d146f86b',
}

/**
 * 导航栏配置
 */
export const categories: CategoryItem[] = [
  {
    url: '//mcc.im',
    title: '🚀 Portfolio',
    style: undefined,
    target: '_blank',
    svg: 'tabler:user-filled',
  },
  {
    url: '//memos.marxchou.com',
    title: '🥳 Feed',
    style: 'color: orange',
    target: '_blank',
    svg: 'tabler:brand-wechat',
  },
  {
    url: '/friends/',
    title: '🧑🏿‍🚒 Friends',
    style: 'color: #06a878',
    target: '_self',
    svg: 'tabler:message-chatbot-filled',
  },
  {
    url: '/archives/',
    title: '📂 Archives',
    style: 'color: var(--title-color)',
    target: '_self',
    svg: 'tabler:archive-filled',
  },
  {
    url: '/tags/',
    title: '🏷️ tags',
    style: undefined,
    target: '_self',
    svg: 'tabler:tags',
  },
]

/**
 * 社交链接配置
 */
export const socialLinks: SocialLinkItem[] = [
  {
    url: '//qq.com/realSpencerWoo',
    title: '🔗 @realSpencerWoo',
    style: 'color: #12b7f5',
    svg: 'simple-icons:tencentqq',
  },
  {
    url: '//twitter.com/realSpencerWoo',
    title: '🔗 @realSpencerWoo',
    style: 'color: #1da1f2',
    svg: 'logos:twitter',
  },
  {
    url: '//t.me/realSpencerWoo',
    title: '🔗 @realSpencerWoo',
    style: 'color: #179cde',
    svg: 'logos:telegram',
  },
  {
    url: '//github.com/spencerwooo',
    title: '🔗 @spencerwooo',
    style: 'color: var(--title-color)',
    svg: 'simple-icons:github',
  },
  {
    url: '//youtube.com/realSpencerWoo',
    title: '🔗 @realSpencerWoo',
    style: 'color: #ff0000',
    svg: 'logos:youtube-icon'
  }
]

/**
 * 友链页面配置
 */
export const friendsPage: FriendsPageConfig = {
  title: 'Friends & Guestbook',
  note: "I don't accept friend link requests from someone I don't know.",
  list: [
    {
      id: '@Felinae',
      link: 'https://code.felinae98.cn/',
      avatar: 'https://avatars.githubusercontent.com/u/23295345',
      style: 'color: #fff; background-color: #473922',
    },
    {
      id: '@agnoCJY',
      link: 'https://jychuuu.com/',
      avatar: 'https://avatars.githubusercontent.com/u/46088026',
      style: 'color: #fff; background-color: #191919',
    },
    {
      id: '@TenkeySeven',
      link: 'https://blog.tenkeyseven.com/',
      avatar: 'https://avatars.githubusercontent.com/u/33371927',
      style: 'color: #fff; background-color: #b59672',
    },
    {
      id: '@Silvester',
      link: 'https://silvester.wang/',
      avatar: 'https://avatars.githubusercontent.com/u/34436920',
      style: 'color: #fff; background-color: #595058',
    },
    {
      id: '@ash0ne',
      link: 'https://blog.ash0ne.com/',
      avatar: 'https://avatars.githubusercontent.com/u/28522665',
      style: 'color: #fff; background-color: #9f8cd1',
    },
    {
      id: '@FKY',
      link: 'http://blog.fkynjyq.com/',
      avatar: 'https://avatars.githubusercontent.com/u/16451516',
      style: 'color: #fff; background-color: #005240',
    },
    {
      id: '@idealclover',
      link: 'https://idealclover.top/',
      avatar: 'https://avatars.githubusercontent.com/u/24428416',
      style: 'color: #fff; background-color: #487747',
    },
    {
      id: '@kastnerorz',
      link: 'https://github.com/kastnerorz',
      avatar: 'https://avatars.githubusercontent.com/u/26199342',
      style: 'color: #fff; background-color: #26498e',
    },
    {
      id: '@Patrick Wu',
      link: 'https://patrickwu.space/',
      avatar: 'https://avatars.githubusercontent.com/u/15316889',
      style: 'color: #fff; background-color: #61a3cf',
    },
  ],
}

/**
 * 页脚配置
 */
export const footerList: FooterItem[] = [
  {
    title: 'Astro',
    text: 'Generator',
    color: 'Lime',
    logo: 'astro',
    logoColor: 'red',
    labelColor: 'pink',
    url: '//astro.build',
  },
  {
    title: 'Vercel',
    text: 'Deploy',
    color: 'Lime',
    logo: 'vercel',
    logoColor: 'white',
    labelColor: 'cyan',
    url: '//vercel.com',
  },
]

/**
 * 404页面配置
 */
export const notFoundPage: PageConfig = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}

/**
 * 标签页面配置
 */
export const tagsPage: PageConfig = {
  title: 'Tags',
  description: 'All Tags',
}

/**
 * 归档页面配置
 */
export const archivesPage: PageConfig = {
  title: 'Archives',
  description: 'All Archives',
}

/**
 * 重定向页面配置
 */
export const redirectPage: PageConfig = {
  title: 'Redirect',
  description: 'Redirect Website',
}