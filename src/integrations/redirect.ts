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
                                            <path fill="currentColor" d="M12.75 17.5a.75.75 0 0 0 0-1.5H6.5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6.25a.75.75 0 0 0 0-1.5H6.5A3.5 3.5 0 0 0 3 6v8a3.5 3.5 0 0 0 3.5 3.5zm.991-11.301a.75.75 0 0 1 1.06.042l3 3.25a.75.75 0 0 1 0 1.018l-3 3.25A.75.75 0 1 1 13.7 12.74l1.838-1.991H7.75a.75.75 0 0 1 0-1.5h7.787l-1.838-1.991a.75.75 0 0 1 .042-1.06"/>
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
