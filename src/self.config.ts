// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

/**
 * title {string} website title
 * favicon {string} website favicon url
 * description {string} website description
 * author {string} author
 * avatar {string} Avatar used in the profile
 * motto {string} used in the profile
 * url {string} Website link
 * recentBlogSize {number} Number of recent articles displayed in the sidebar
 * archivePageSize {number} Number of articles on archive pages
 * postPageSize {number} Number of articles on blog pages
 * feedPageSize {number} Number of articles on feed pages
 * beian {string} Chinese policy
 */
export const site = {
  title: "Spencer's Blog",
  subtitle: 'Spencer Woo',
  description: 'Astro builds fast content sites, powerful web applications, dynamic server APIs, and everything in-between.',
  keywords: 'Astro, Theme, Yi',
  favicon: 'favicon.svg',
  logo: 'logo.svg',
  author: 'Spencer Woo',
  avatar: 'author.jpg',
  coverImage: 'cover.png',
  coverImageAlt: 'SpencerWoo',
  url: '//marxchou.com',
  startYear: '2017' // Blog start year
  // motto: 'Actions speak louder than words.',
  // recentBlogSize: 5,
  // archivePageSize: 25,
  // postPageSize: 10,
  // feedPageSize: 20,
  // beian: '',
}

export const notFoundPage = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export const tagsPage = {
  title: 'Tags',
  description: 'All Tags',
}

export const archivesPage = {
  title: 'Archives',
  description: 'All Archives',
}

/**
 * busuanzi {boolean} link: https://busuanzi.ibruce.info/
 * lang {string} Default website language
 * codeFoldingStartLines {number}
 * ga {string|false}
 */
export const config = {
  busuanzi: false,
  lang: 'en', // en | zh-cn
  codeFoldingStartLines: 16, // Need to re-run the project to take effect
  ga: false, // If you want to integrate with Google Analytics, just enter your GA-ID here.
}

/**
 * Navigator
 * name {string}
 * iconClass {string} icon style
 * href {string}  link url
 * target {string} optional "_self|_blank" open in current window / open in new window
 */
export const categories = [
  {
    url: '//mch.icu',
    title: '🚀 Portfolio',
    style: undefined,
    svg: 'tabler:user-filled',
  },
  {
    url: '/archives/',
    title: '📂 Archives',
    style: 'color: var(--title-color)',
    svg: 'tabler:archive-filled',
  },
  {
    url: '/tags/',
    title: '🏷️ tags',
    style: undefined,
    svg: 'tabler:tags',
  },
  {
    url: '/friends/',
    title: '🧑🏿‍🚒 Friends',
    style: 'color: #06a878',
    svg: 'tabler:message-chatbot-filled',
  },
]

/**
 * Personal link address
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
]

/**
 * donate
 * enable {boolean}
 * tip {string}
 * wechatQRCode: Image addresses should be placed in the public directory.
 * alipayQRCode: Image addresses should be placed in the public directory.
 * paypalUrl {string}
 */
export const donate = {
  enable: false,
  tip: 'Thanks for the coffee !!!☕',
  wechatQRCode: '/WeChatQR.png',
  alipayQRCode: '/AliPayQR.png',
  paypalUrl: 'https://paypal.me/xxxxxxxxxx',
}

/**
 * Friendship Links Page
 * name {string}
 * url {string}
 * avatar {string}
 * description {string}
 */
export const friendsPage = {
  title: 'Friends & Guestbook',
  description:
    "Friends & Guestbook - I don't accept friend link requests from someone I don't know.",
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
 * Comment Feature
 * enable {boolean}
 * type {string} required waline | giscus
 * serverUrl {string} server link
 * lang {string} link: https://waline.js.org/guide/features/i18n.html
 * pageSize {number} number of comments per page. default 10
 * wordLimit {number} Comment word s limit. When a single number is filled in, it 's the maximum number of comment words. No limit when set to 0
 * count {number} recent comment numbers
 * pageview {boolean} display the number of page views and comments of the article
 * reaction {string | string[]} Add emoji interaction function to the article
 * requiredMeta {string[]}  Set required fields, default anonymous
 * whiteList {string[]} set some pages not to display reaction
 */
export const comment = {
  enable: true,
  type: 'giscus', // waline | giscus,
  //waline config
  serverUrl: 'https://xxxxx.xxxxx.app',
  // waline config
  lang: 'en',
  pageSize: 20,
  wordLimit: '',
  count: 5,
  pageview: true,
  reaction: true,
  requiredMeta: ['nick', 'mail'],
  whiteList: ['/message/', '/friends/'],

  // giscus config
  giscusConfig: {
    'data-repo': 'cirry/astro-yi',
    'data-repo-id': 'R_kgDOJNr3Jw',
    'data-category': 'Announcements',
    'data-category-id': 'DIC_kwDOJNr3J84CftB-',
    'data-mapping': 'pathname',
    'data-strict': '0',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'bottom',
    'data-theme': 'light',
    'data-lang': 'zh-CN',
    crossorigin: 'anonymous',
  },
}

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
