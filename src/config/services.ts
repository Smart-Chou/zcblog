// 服务页面配置

/**
 * 定价模式
 */
export type PricingMode = "fixed" | "negotiable";

/**
 * 交付方式
 */
export type DeliveryMode = "consult" | "hands-on";

/**
 * 服务项配置
 */
export interface ServiceItem {
    id: string;
    title: string;
    icon: string; // iconify 图标名
    description: string;
    deliveryMode: DeliveryMode;
    deliveryLabel: string;
    pricing: PricingMode;
    priceLabel: string; // fixed 时显示价格（如 "¥500 起"），negotiable 时显示（如 "私聊议价"）
}

/**
 * 中文服务数据
 */
export const servicesZh: ServiceItem[] = [
    {
        id: "blog-setup",
        title: "博客搭建",
        icon: "tabler:brand-blogger",
        description:
            "帮你从零搭建个人博客，使用 Astro、Hugo、Hexo 等主流框架，包含主题定制、评论系统、SEO 优化、RSS 订阅等完整功能。无需懂代码，你只需提供内容即可。",
        deliveryMode: "hands-on",
        deliveryLabel: "代搭建",
        pricing: "fixed",
        priceLabel: "¥500 起",
    },
    {
        id: "service-deploy",
        title: "服务部署",
        icon: "tabler:server",
        description:
            "帮你部署各类自托管服务：Affine、Bitwarden、Frigate、RustDesk、Syncthing、Meilisearch 等。包含 Docker 配置、反向代理、SSL 证书、自动备份等全套方案。",
        deliveryMode: "hands-on",
        deliveryLabel: "代部署",
        pricing: "fixed",
        priceLabel: "¥300 起",
    },
    {
        id: "tech-consult",
        title: "技术咨询",
        icon: "tabler:message-chatbot",
        description:
            "一对一技术咨询服务。涵盖独立开发、VPS 运维、自动化部署、工具选型等方向。帮你理清思路、避开常见坑点，给出可落地的技术方案。",
        deliveryMode: "consult",
        deliveryLabel: "远程咨询",
        pricing: "negotiable",
        priceLabel: "私聊议价",
    },
];

/**
 * 英文服务数据
 */
/**
 * 联系方式配置
 */
export interface ContactInfo {
    wechat: string;
    telegram: string;
    telegramUrl: string;
    email: string;
}

/**
 * 中文联系方式
 */
export const contactZh: ContactInfo = {
    wechat: "MarxChou",
    telegram: "@MarxChou",
    telegramUrl: "https://t.me/MarxChou",
    email: "hi@marxchou.com",
};

/**
 * 英文联系方式
 */
export const contactEn: ContactInfo = {
    wechat: "MarxChou",
    telegram: "@MarxChou",
    telegramUrl: "https://t.me/MarxChou",
    email: "hi@marxchou.com",
};

export const servicesEn: ServiceItem[] = [
    {
        id: "blog-setup",
        title: "Blog Setup",
        icon: "tabler:brand-blogger",
        description:
            "Get your personal blog up and running from scratch. Using Astro, Hugo, Hexo, or other popular frameworks. Includes theme customization, comments, SEO, RSS — you just provide the content.",
        deliveryMode: "hands-on",
        deliveryLabel: "Done-for-you",
        pricing: "fixed",
        priceLabel: "From ¥500",
    },
    {
        id: "service-deploy",
        title: "Service Deployment",
        icon: "tabler:server",
        description:
            "Deploy self-hosted services: Affine, Bitwarden, Frigate, RustDesk, Syncthing, Meilisearch, and more. Includes Docker config, reverse proxy, SSL certs, and automated backups.",
        deliveryMode: "hands-on",
        deliveryLabel: "Done-for-you",
        pricing: "fixed",
        priceLabel: "From ¥300",
    },
    {
        id: "tech-consult",
        title: "Tech Consulting",
        icon: "tabler:message-chatbot",
        description:
            "One-on-one consulting on indie development, VPS management, automation, tool selection, and more. Get clear direction and actionable solutions tailored to your situation.",
        deliveryMode: "consult",
        deliveryLabel: "Remote Consult",
        pricing: "negotiable",
        priceLabel: "DM for pricing",
    },
];
