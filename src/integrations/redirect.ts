/**
 * 链接重定向集成 — 构建时处理 HTML 中的外部链接，添加重定向页面和外部链接图标。
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import { minify } from "html-minifier-terser";
import { JSDOM } from "jsdom";
import type { AstroIntegration } from "astro";
import { config, site } from "~/config";
import {
    REDIRECT_PAGE,
    toUrlSafeBase64,
    isExternalUrl,
    appendExternalLinkIcon,
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

            const total = files.length;
            let skipped = 0;

            await Promise.all(
                files.map(async (file) => {
                    try {
                        let html = await fs.readFile(file, "utf-8");

                        // Fast pre-check: skip JSDOM if no matching links present
                        const hasCandidateLink = includeClass.some((cls) =>
                            html.includes(cls),
                        );
                        if (!hasCandidateLink) {
                            skipped++;
                            return;
                        }

                        const dom = new JSDOM(html);
                        const document = dom.window.document;

                        const links = Array.from(
                            document.getElementsByTagName("a"),
                        ) as Element[];
                        let modified = false;
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

                            appendExternalLinkIcon(link as unknown as Element);
                            modified = true;
                        }

                        if (!modified) {
                            skipped++;
                            return;
                        }

                        html = dom.serialize();
                        html = await minify(html, {
                            removeComments: true,
                            preserveLineBreaks: true,
                            collapseWhitespace: true,
                        });
                        await fs.writeFile(file, html);
                    } catch (err: any) {
                        if (err.code === "ENOENT") {
                            logger.warn(`Skipping missing file: ${file}`);
                        } else {
                            throw err;
                        }
                    }
                }),
            );

            logger.info(
                `Processed ${total} files (${skipped} skipped) for external link redirects`,
            );
        },
    },
});

export default redirectIntegration;
