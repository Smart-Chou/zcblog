import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import { minify } from "html-minifier";
import { JSDOM } from "jsdom";
import type { AstroIntegration } from "astro";
import { config } from "../self.config.ts";

const redirectIntegration = (): AstroIntegration => ({
    name: "redirectAttributeByLink",
    hooks: {
        "astro:build:done": async ({ dir, logger }) => {
            // Get all HTML files from the output directory
            const destDir = fileURLToPath(dir);
            const outDirPath = path.relative(process.cwd(), destDir);
            const files = await fg(`${outDirPath}/**/*.html`);
            await Promise.all(
                files.map(async (file) => {
                    logger.info(`Processing file: ${file}`);
                    let html = await fs.readFile(file, "utf-8");
                    const dom = new JSDOM(html);
                    const document = dom.window.document;
                    try {
                        // 是否启用跳转功能
                        const enable = config.redirect;
                        if (!enable) return;
                        // 中转页地址
                        const redirectPage = "/redirect/?url=";
                        // 包含的 className
                        const includeClass = config.redirectIncludeClass;
                        // 排除的 className
                        const excludeClass = config.redirectExcludeClass;
                        // 判断元素或其父元素是否包含指定类名
                        const hasIncludeClass = (element) => {
                            while (element) {
                                if (
                                    includeClass.some((className) =>
                                        element.classList.contains(className),
                                    )
                                ) {
                                    return true;
                                }
                                element = element.parentElement;
                            }
                            return false;
                        };
                        // 判断元素或其父元素是否排除指定类名
                        const hasExcludeClass = (element) => {
                            while (element) {
                                if (
                                    excludeClass.some((className) =>
                                        element.classList.contains(className),
                                    )
                                ) {
                                    return true;
                                }
                                element = element.parentElement;
                            }
                            return false;
                        };
                        // 获取所有链接
                        const allLinks = [
                            ...document.getElementsByTagName("a"),
                        ];
                        if (allLinks.length === 0) return;
                        allLinks.forEach((link) => {
                            // 检查链接是否排除指定类名
                            if (hasExcludeClass(link)) return;
                            // 检查链接是否包含 target="_blank" 属性或指定的类名
                            // 检查链接是否为相对路径
                            const linkHref = link.getAttribute("href");
                            // 检查链接是否为相对路径或根路径
                            const isRelativeOrRootPath =
                                linkHref && /^(\.|\/(?!\/))/.test(linkHref);
                            if (isRelativeOrRootPath) return;
                            // 检查链接是否包含 target="_blank" 属性或指定的类名
                            if (
                                link.getAttribute("target") === "_blank" ||
                                hasIncludeClass(link)
                            ) {
                                // 存在链接且非中转页
                                if (
                                    linkHref &&
                                    !linkHref.includes(redirectPage)
                                ) {
                                    // Base64 编码 href
                                    const encodedHref = btoa(linkHref);
                                    const redirectLink = `${redirectPage}${encodedHref}`;
                                    // 保存原始链接
                                    link.setAttribute(
                                        "original-href",
                                        linkHref,
                                    );
                                    // 覆盖 href
                                    link.setAttribute("href", redirectLink);
                                    // 增加 target="_blank" 属性
                                    link.setAttribute("target", "_blank");
                                    // 增加 rel="noopener noreferrer" 属性
                                    link.setAttribute(
                                        "rel",
                                        "noopener noreferrer",
                                    );
                                    // 创建并插入 SVG 图标
                                    if (hasIncludeClass(link)) {
                                        const svgIcon =
                                            document.createElementNS(
                                                "http://www.w3.org/2000/svg",
                                                "svg",
                                            );
                                        svgIcon.setAttribute("width", "16");
                                        svgIcon.setAttribute("height", "16");
                                        svgIcon.setAttribute(
                                            "viewBox",
                                            "0 0 24 24",
                                        );
                                        svgIcon.setAttribute(
                                            "fill",
                                            "currentColor",
                                        );
                                        svgIcon.innerHTML = `
                                        <path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path>
                                        `;
                                        svgIcon.innerHTML += `
                                            <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon>
                                        `;
                                        link.appendChild(svgIcon);
                                    }
                                }
                            }
                        });
                    } catch (error) {
                        logger.error(`处理链接时出错： ${error.message}`);
                    }
                    html = dom.serialize();
                    // Minify the HTML
                    html = minify(html, {
                        removeComments: true,
                        preserveLineBreaks: true,
                        collapseWhitespace: true,
                    });
                    await fs.writeFile(file, html);
                }),
            );
        },
    },
});

export default redirectIntegration;
