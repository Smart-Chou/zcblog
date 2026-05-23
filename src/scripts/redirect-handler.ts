import { config } from "~/config";
import {
    REDIRECT_PAGE,
    toUrlSafeBase64,
    isExternalUrl,
    appendExternalLinkIcon,
} from "~/utils/redirect-utils";

function initRedirectHandler() {
    try {
        if (!config.redirect) return;

        const { redirectIncludeClass: includeClass, redirectExcludeClass: excludeClass } = config;

        const hasClassInTree = (element: HTMLElement): boolean => {
            let current: HTMLElement | null = element;
            while (current) {
                if (includeClass.some((c) => current!.classList.contains(c))) return true;
                current = current.parentElement;
            }
            return false;
        };

        const isExcluded = (element: HTMLElement): boolean => {
            let current: HTMLElement | null = element;
            while (current) {
                if (excludeClass.some((c) => current!.classList.contains(c))) return true;
                current = current.parentElement;
            }
            return false;
        };

        const currentHost = window.location.host;
        const links = [...document.getElementsByTagName("a")];
        if (links.length === 0) return;

        for (const link of links) {
            if (isExcluded(link)) continue;
            if (!hasClassInTree(link)) continue;

            const href = link.getAttribute("href");
            if (!href || href.includes(REDIRECT_PAGE)) continue;
            if (!isExternalUrl(href, currentHost)) continue;

            link.setAttribute("original-href", href);
            link.setAttribute("href", `${REDIRECT_PAGE}${toUrlSafeBase64(href)}`);
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");

            appendExternalLinkIcon(link);
        }
    } catch (error) {
        console.error("处理链接时出错：", error);
    }
}

document.addEventListener("astro:page-load", initRedirectHandler);
