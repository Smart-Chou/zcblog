// Hero 页面配置

/**
 * 社交链接配置
 */
export interface SocialLink {
    title: string;
    url: string;
    icon: "twitter" | "github" | "figma";
}

/**
 * 技术栈配置
 */
export interface TechItem {
    name: string;
    icon: string;
    color: string;
    category: "framework" | "tool";
}

/**
 * 导航链接配置
 */
export interface NavLink {
    label: string;
    url: string;
    show?: boolean;
}

/**
 * 设计原则配置
 */
export interface DesignPrinciple {
    number: string;
    title: string;
    description: string;
}

/**
 * 页脚链接配置
 */
export interface FooterLink {
    label: string;
    url: string;
    badge?: string;
    external?: boolean;
}

/**
 * 页脚链接配置
 */
export interface FooterSection {
    title: string;
    links: FooterLink[];
}

/**
 * Hero 页面配置
 */
export const heroConfig = {
    // 站点信息
    site: {
        name: "Marx",
        url: "https://marxchou.com",
    },

    // 作者信息
    author: {
        name: "Marx Chou",
        title: "Front-End Developer",
        motto: "A Noob Developer who loves intuitive, clean and modern UI design.",
    },

    // 导航链接
    navLinks: [
        { label: "Projects", url: "/projects", show: true },
        { label: "Blog", url: "/blog", show: true },
        { label: "T.I.L", url: "/today-i-learned", show: true },
        {
            label: "Skills & Tools",
            url: "/work/skills-and-tools",
            show: true,
            showInLarge: true,
        },
        {
            label: "Experience",
            url: "/work/experience",
            show: true,
            showInLarge: true,
        },
        { label: "Studio", url: "/work/studio", show: true, showInLarge: true },
        {
            label: "Contact",
            url: "/work/contact",
            show: true,
            showInLarge: true,
        },
    ],

    // 社交链接
    socialLinks: [
        {
            title: "Twitter",
            url: "https://twitter.com/marxchou",
            icon: "twitter" as const,
        },
        {
            title: "GitHub",
            url: "https://github.com/zcily",
            icon: "github" as const,
        },
    ],

    // CTA 按钮
    ctaButtons: [
        { label: "Get in Touch", url: "/work/contact", variant: "solid" },
        {
            label: "RESUME",
            url: "https://www.figma.com/community/file/1176377524040948926",
            variant: "ghost",
            external: true,
        },
    ],

    // 技术栈
    techStack: [
        {
            name: "TypeScript",
            icon: "typescript",
            color: "#3178C6",
            category: "framework" as const,
        },
        {
            name: "React",
            icon: "react",
            color: "#61DAFB",
            category: "framework" as const,
        },
        {
            name: "Tailwind CSS",
            icon: "tailwindcss",
            color: "#06B6D4",
            category: "framework" as const,
        },
        {
            name: "Framer Motion",
            icon: "framer",
            color: "#0055FF",
            category: "framework" as const,
        },
        {
            name: "Next.js",
            icon: "nextjs",
            color: "#000000",
            category: "framework" as const,
        },
        {
            name: "VS Code",
            icon: "vscode",
            color: "#007ACC",
            category: "tool" as const,
        },
        {
            name: "Figma",
            icon: "figma",
            color: "#F24E1E",
            category: "tool" as const,
        },
    ],

    // 设计原则
    designPrinciples: [
        {
            number: "1",
            title: "Typography",
            description: "Selecting the font type, font size, and font weight.",
        },
        {
            number: "2",
            title: "Spacing",
            description: "Positioning and adding spacing between elements.",
        },
        {
            number: "3",
            title: "Colors",
            description: "Choosing a color scheme with sufficient contrast.",
        },
        {
            number: "4",
            title: "Effects",
            description:
                "Add effects like borders, shadows, rounded corners, etc.",
        },
    ],

    // 设计原则详情
    designSections: [
        {
            title: "Clean & Intuitive",
            subtitle: "Eye Catching, Modern & Minimalist Design.",
            description:
                "Keep the User Interface clean with a modern touch without compromising the User Experience.",
            accentColor: "violet",
        },
        {
            title: "Detail Oriented",
            subtitle: "Keen Eye for Spotting Small Details.",
            description:
                "Awareness to ease of access, User Interface consistency, and improved User Experience.",
            accentColor: "violet",
        },
        {
            title: "Pretty & Optimized",
            subtitle: "Comprehensible and Optimized Code.",
            description:
                "Writing clean code is a top priority while keeping it as optimized as possible.",
            accentColor: "violet",
        },
    ],

    // 页脚链接
    footerSections: [
        {
            title: "Work",
            links: [
                { label: "Contact", url: "/work/contact" },
                { label: "Experience", url: "/work/experience" },
                { label: "Services", url: "#", badge: "soon" },
                { label: "Skills and Tools", url: "/work/skills-and-tools" },
                { label: "Studio", url: "/work/studio" },
            ],
        },
        {
            title: "Learn",
            links: [
                { label: "Docs", url: "/docs" },
                { label: "Personal Blog", url: "/blog" },
                { label: "T.I.L", url: "/today-i-learned", badge: "new" },
            ],
        },
        {
            title: "This Site",
            links: [
                {
                    label: "Design Concept",
                    url: "https://www.figma.com/community/file/1176392613303840973",
                    external: true,
                },
                {
                    label: "Source Code",
                    url: "https://github.com/zcily/marxchou.com",
                    external: true,
                },
                { label: "Credits", url: "/credits" },
            ],
        },
    ],

    // 版权年份
    copyright: {
        startYear: "2020",
        currentYear: new Date().getFullYear().toString(),
    },
};
