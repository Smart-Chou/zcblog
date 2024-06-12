// 在这个文件中放置全局数据。
// 您可以在整个网站中使用 `import` 关键字从任何地方导入此数据。
// icon/Icon 从 https://icon-sets.iconify.design/ 生成

/**
 * title {string} 网站标题
 * subtitle {string} 网站副标题
 * description {string} 网站描述
 * keywords {string} 网站关键字
 * favicon {string} 网站图标URL
 * logo {string} 网站logo
 * author {string} 作者
 * motto {string} 个人资料中使用的口头禅
 * avatar {string} 个人资料中使用的头像
 * coverImage {string} 网站封面
 * coverImageAlt {string} 网站封面Alt
 * url {string} 网站链接
 * startYear {string} 网站开始年份
 * PageSize {number} 文章页面上的文章数
 * beian {string} 中国政策 / 萌 ICP
 * beianURL {string} URL
 */
export const site = {
  title: "Spencer's Blog",
  subtitle: 'Spencer Woo',
  description:
    'Astro builds fast content sites, powerful web applications, dynamic server APIs, and everything in-between.',
  keywords: 'Astro, Theme, Yi',
  favicon: 'favicon.svg',
  logo: 'logo.svg',
  author: 'Spencer Woo',
  motto: '阿巴阿巴 o((>ω< ))o',
  avatar: 'author.jpg',
  coverImage: 'cover.png',
  coverImageAlt: "Spencer's Blog",
  url: '//marxchou.com',
  startYear: '2017',
  PageSize: 9,
  beian: '豫ICP备20006179号',
  beianURL: 'https://beian.miit.gov.cn',
}

/**
 * lang {string} 默认网站语言，en | zh-CN
 * codeFoldingStartLines {number} 代码折叠起始行数
 * ga {string|false} 如果您想与Google Analytics进行集成，只需在此处输入您的GA-ID即可。
 * umami {string|false} 如果您想与Umami进行集成，只需在此处输入您的Umami网站ID即可。
 */
export const config = {
  lang: 'en',
  codeFoldingStartLines: 16,
  ga: 'UA-123-456',
  umami: '73b29141-fccf-4d54-9c2f-f7d0d146f86b',
}

/**
 * 导航栏
 * url {string} 链接
 * title {string} ID
 * style {string} 颜色样式
 * svg {string} icon
 */
export const categories = [
  {
    url: '//mch.icu',
    title: '🚀 Portfolio',
    style: undefined,
    svg: 'tabler:user-filled',
  },
  {
    url: '/feed/',
    title: '🥳 Feed',
    style: 'color: orange',
    svg: 'tabler:brand-wechat',
  },
  {
    url: '/archives/',
    title: '📂 Archives',
    style: 'color: var(--title-color)',
    svg: 'tabler:archive-filled',
  },
  {
    url: '/friends/',
    title: '🧑🏿‍🚒 Friends',
    style: 'color: #06a878',
    svg: 'tabler:message-chatbot-filled',
  },
  {
    url: '/tags/',
    title: '🏷️ tags',
    style: undefined,
    svg: 'tabler:tags',
  },
]

/**
 * 个人社交链接地址
 * url {string} 链接
 * title {string} ID
 * style {string} 颜色样式
 * svg {string} icon
 */
export const socialLinks = [
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
 * 捐赠
 * enable {boolean} 是否启用捐赠功能
 * tip {string} 捐赠提示
 * wechatQRCode: 微信二维码图片地址, 图片地址应该放在 public 目录下
 * alipayQRCode: 支付宝二维码图片地址, 图片地址应该放在 public 目录下
 * paypalUrl {string} PayPal 捐赠地址
 */
export const donate = {
  enable: true,
  tip: 'Thanks for the coffee !!!☕',
  wechatQRCode: '/WeChatQR.jpg',
  alipayQRCode: '/AliPayQR.jpg',
  paypalUrl: 'https://paypal.me/xxxxxxxxxx',
}

/**
 * 友链页面
 * title {string} 标题
 * note {string} 描述
 * id {string} friends ID
 * link {string} 链接
 * avatar {string} 头像
 * style {string} 背景颜色样式
 */
export const friendsPage = {
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
 * Waline评论功能配置
 * enable {boolean} 是否启用
 * serverUrl {string} 评论服务器地址
 * lang {string} 评论语言
 * pageSize {number} 评论分页大小
 * reaction {boolean} 是否开启表情
 * search {boolean} 是否开启搜索
 * whiteList {string[]} 白名单 总是开启
 */
export const comment = {
  enable: true,
  serverUrl: 'https://waline.marxchou.com',
  lang: 'zh-CN',
  pageSize: 16,
  reaction: true,
  search: false,
  whiteList: ['/message/', '/friends/'],
}

/**
 * 页脚列表
 * title {string} 标题
 * text {string} 描述
 * icon {string} 图标
 * url {string} 链接
 */
export const footerList = [
  {
    title: 'Umami',
    text: 'Analytics by',
    icon: 'simple-icons:umami',
    url: '//umami.is',
  },
  {
    title: 'Astro',
    text: 'Runs on',
    icon: 'simple-icons:astro',
    url: '//astro.build',
  },
  {
    title: 'Vercel',
    text: 'Deployed on',
    icon: 'simple-icons:vercel',
    url: '//vercel.com',
  },
]

/**
 * MeiliSearch Host / Cloud
 * enable {boolean} 是否启用
 * host {string} MeiliSearch Host
 * apiKey {string} MeiliSearch API Key
 * indexUid {string} MeiliSearch Index UID
 * hotKeys {string[]} 搜索热词
 **/
export const search = {
  enable: true,
  host: 'https://meilisearch.marxchou.com',
  apiKey: '883ea017368299f1ed7f13dbe6ab79f148a1d7da877b29dc04020c8d96d27bf3',
  indexUid: 'marxchou',
  hotKeys: ['/', 's'],
}

// 404 Page
export const notFoundPage = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}

// Tags Page
export const tagsPage = {
  title: 'Tags',
  description: 'All Tags',
}

// Archives Page
export const archivesPage = {
  title: 'Archives',
  description: 'All Archives',
}

// feed Page
export const feedPage = {
  title: 'Feed',
  description: 'Feed',
}
