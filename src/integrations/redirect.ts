/**
 * 链接重定向集成
 *
 * 此集成用于处理网站中的外部链接，为其添加重定向功能和外部链接图标。
 * 主要功能包括：
 * 1. 为外部链接添加重定向页面，保护用户隐私
 * 2. 为新窗口打开的链接添加外部链接图标
 * 3. 处理 HTML 文件中的所有链接
 *
 * 配置选项：
 * - redirect: 是否启用重定向功能（在 self.config.ts 中配置）
 * - redirectIncludeClass: 需要处理的链接容器类名（在 self.config.ts 中配置）
 * - redirectExcludeClass: 排除处理的链接容器类名（在 self.config.ts 中配置）
 *
 * 使用方法：
 * 在 astro.config.mjs 中导入并添加此集成
 *
 * @example
 * // astro.config.mjs
 * import redirectAttributeByLink from './src/integrations/redirect.ts';
 *
 * export default defineConfig({
 *   integrations: [
 *     redirectAttributeByLink()
 *   ]
 * });
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import { minify } from "html-minifier";
import { JSDOM } from "jsdom";
import type { AstroIntegration } from "astro";
import { config } from "../self.config.ts";

// 辅助函数：检查元素或其父元素是否包含指定类名
const hasIncludeClass = (element: Element, includeClass: string[]): boolean => {
    let currentElement: Element | null = element;
    while (currentElement !== null) {
        if (
            includeClass.some(
                (className) =>
                    currentElement !== null &&
                    currentElement.classList.contains(className),
            )
        ) {
            return true;
        }
        currentElement = currentElement.parentElement;
    }
    return false;
};

// 辅助函数：检查元素或其父元素是否排除指定类名
const hasExcludeClass = (element: Element, excludeClass: string[]): boolean => {
    let currentElement: Element | null = element;
    while (currentElement !== null) {
        if (
            excludeClass.some(
                (className) =>
                    currentElement !== null &&
                    currentElement.classList.contains(className),
            )
        ) {
            return true;
        }
        currentElement = currentElement.parentElement;
    }
    return false;
};

// 辅助函数：检查链接是否为相对路径、根路径或纯锚点链接
const isRelativeOrRootPath = (href: string | null): boolean => {
    return href !== null && (/^(\.|\/(?!\/))/.test(href) || href.startsWith('#'));
};

// 辅助函数：为链接添加外部链接图标
const addExternalLinkIcon = (link: Element, document: Document): void => {
    const svgIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
    );
    svgIcon.setAttribute("width", "16");
    svgIcon.setAttribute("height", "16");
    svgIcon.setAttribute("viewBox", "0 0 100 100");
    svgIcon.setAttribute("fill", "currentColor");
    svgIcon.innerHTML = `
        <path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path>
    `;
    svgIcon.innerHTML += `
        <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon>
    `;
    link.appendChild(svgIcon);
};

// 辅助函数：处理单个链接
const processLink = (link: Element, document: Document): void => {
    const redirectPage = "/redirect/?url=";
    const includeClass = config.redirectIncludeClass;
    const excludeClass = config.redirectExcludeClass;

    // 检查链接是否排除指定类名
    if (hasExcludeClass(link, excludeClass)) return;

    const linkHref = link.getAttribute("href");

    // 检查链接是否需要处理
    if (
        link.getAttribute("target") === "_blank" ||
        hasIncludeClass(link, includeClass)
    ) {
        // 检查链接是否为相对路径或根路径
        if (isRelativeOrRootPath(linkHref)) return;
        // 存在链接且非中转页
        if (linkHref && !linkHref.includes(redirectPage)) {
            // Base64 编码 href
            const encodedHref = Buffer.from(linkHref).toString("base64");
            // 处理 Base64 编码中的特殊字符，确保 URL 安全
            const urlSafeEncodedHref = encodedHref
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=/g, "");
            const redirectLink = `${redirectPage}${urlSafeEncodedHref}`;

            // 保存原始链接
            link.setAttribute("original-href", linkHref);
            // 覆盖 href
            link.setAttribute("href", redirectLink);
            // 增加 target="_blank" 属性
            link.setAttribute("target", "_blank");
            // 增加 rel="noopener noreferrer" 属性
            link.setAttribute("rel", "noopener noreferrer");
            // 创建并插入 SVG 图标
            if (hasIncludeClass(link, includeClass)) {
                addExternalLinkIcon(link, document);
            }
        }
    }
};

// 辅助函数：处理单个 HTML 文件
const processHtmlFile = async (file: string, logger: any): Promise<void> => {
    logger.info(`Processing file: ${file}`);
    let html = await fs.readFile(file, "utf-8");
    const dom = new JSDOM(html);
    const document = dom.window.document;

    try {
        // 是否启用跳转功能
        const enable = config.redirect;
        if (!enable) return;

        // 获取所有链接
        const allLinks = Array.from(
            document.getElementsByTagName("a"),
        ) as Element[];
        if (allLinks.length === 0) return;

        // 处理每个链接
        allLinks.forEach((link) => {
            processLink(link, document);
        });
    } catch (error) {
        logger.error(`处理链接时出错： ${(error as Error).message}`);
    }

    html = dom.serialize();

    // Minify the HTML
    html = minify(html, {
        removeComments: true,
        preserveLineBreaks: true,
        collapseWhitespace: true,
    });

    await fs.writeFile(file, html);
};

const redirectIntegration = (): AstroIntegration => ({
    name: "redirectAttributeByLink",
    hooks: {
        "astro:build:done": async ({ dir, logger }) => {
            // Get all HTML files from the output directory
            const destDir = fileURLToPath(dir);
            const outDirPath = path.relative(process.cwd(), destDir);
            const files = await fg(`${outDirPath}/**/*.html`);

            // Process all files in parallel
            await Promise.all(
                files.map(async (file) => {
                    await processHtmlFile(file, logger);
                }),
            );
        },
    },
});

export default redirectIntegration;
