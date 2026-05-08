/**
 * 链接重定向集成 — 构建时处理 HTML 中的外部链接，添加重定向页面和外部链接图标。
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import { minify } from "html-minifier";
import { JSDOM } from "jsdom";
import type { AstroIntegration } from "astro";
import { config, site } from "../self.config.ts";
import {
    REDIRECT_PAGE,
    EXTERNAL_LINK_SVG,
    toUrlSafeBase64,
    isExternalUrl,
} from "../utils/redirect-utils.ts";

const hasClassInTree = (element: Element, classList: string[]): boolean => {
    let current: Element | null = element;
    while (current) {
        if (classList.some((c) => current!.classList.contains(c))) return true;
        current = current.parentElement;
    }
    return false;
};

const redirectIntegration = (): AstroIntegration => ({
    name: "redirectAttributeByLink",
    hooks: {
        "astro:build:done": async ({ dir, logger }) => {
            if (!config.redirect) return;

            const destDir = fileURLToPath(dir);
            const outDirPath = path.relative(process.cwd(), destDir);
            const files = await fg(`${outDirPath}/**/*.html`);

            const {
                redirectIncludeClass: includeClass,
                redirectExcludeClass: excludeClass,
            } = config;
            const siteHost = new URL(site.url).host;

            await Promise.all(
                files.map(async (file) => {
                    logger.info(`Processing file: ${file}`);
                    let html = await fs.readFile(file, "utf-8");
                    const dom = new JSDOM(html);
                    const document = dom.window.document;

                    const links = Array.from(
                        document.getElementsByTagName("a"),
                    ) as Element[];
                    for (const link of links) {
                        if (hasClassInTree(link, excludeClass)) continue;
                        if (!hasClassInTree(link, includeClass)) continue;

                        const href = link.getAttribute("href");
                        if (!href || href.includes(REDIRECT_PAGE)) continue;
                        if (!isExternalUrl(href, siteHost)) continue;

                        link.setAttribute("original-href", href);
                        link.setAttribute(
                            "href",
                            `${REDIRECT_PAGE}${toUrlSafeBase64(href)}`,
                        );
                        link.setAttribute("target", "_blank");
                        link.setAttribute("rel", "noopener noreferrer");

                        const svg = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg",
                        );
                        svg.setAttribute("width", "16");
                        svg.setAttribute("height", "16");
                        svg.setAttribute("viewBox", "0 0 100 100");
                        svg.setAttribute("fill", "currentColor");
                        svg.innerHTML = EXTERNAL_LINK_SVG;
                        link.appendChild(svg);
                    }

                    html = dom.serialize();
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
