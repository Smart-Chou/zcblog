import { config } from "~/self.config";

/**
 * 初始化外部链接重定向逻辑。
 * 遍历页面中所有 <a> 标签，将符合条件的外部链接重写为中转页地址（Base64 编码），
 * 并为包含指定类名的链接追加外部链接图标。
 */
function initRedirectHandler() {
    try {
        if (!config.redirect) return;

        const redirectPage = "/redirect/?url=";
        const includeClass = config.redirectIncludeClass;
        const excludeClass = config.redirectExcludeClass;

        const hasIncludeClass = (element: HTMLElement): boolean => {
            while (element) {
                if (includeClass.some((cls) => element.classList.contains(cls)))
                    return true;
                element = element.parentElement as HTMLElement;
            }
            return false;
        };

        const hasExcludeClass = (element: HTMLElement): boolean => {
            while (element) {
                if (excludeClass.some((cls) => element.classList.contains(cls)))
                    return true;
                element = element.parentElement as HTMLElement;
            }
            return false;
        };

        const allLinks = [...document.getElementsByTagName("a")];
        if (allLinks.length === 0) return;

        // 检查是否为外部链接（非同域）
        const isExternalLink = (href: string): boolean => {
            if (!href) return false;

            // 排除相对路径和根路径
            if (/^(\.|\/(?!\/))/.test(href)) {
                return false;
            }

            try {
                // 解析链接URL和当前页面URL
                const linkUrl = new URL(href, window.location.href);
                const currentUrl = new URL(window.location.href);

                // 比较主机名（包含端口）
                return linkUrl.host !== currentUrl.host;
            } catch (e) {
                // 如果URL解析失败（如mailto:、tel:等），视为非外部链接
                return false;
            }
        };

        allLinks.forEach((link) => {
            if (hasExcludeClass(link)) return;

            // 仅处理包含在redirectIncludeClass中的链接
            if (!hasIncludeClass(link)) return;

            const linkHref = link.getAttribute("href");
            if (!linkHref) return;

            // 仅处理外部链接
            if (!isExternalLink(linkHref)) return;

            // 避免重复处理（已包含重定向页面的链接）
            if (linkHref.includes(redirectPage)) return;

            // 使用 TextEncoder 将 Unicode URL（含中文）安全转为 Base64
            const bytes = new TextEncoder().encode(linkHref);
            const encodedHref = btoa(String.fromCharCode(...bytes));
            const urlSafeEncodedHref = encodedHref
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=/g, "");

            link.setAttribute("original-href", linkHref);
            link.setAttribute("href", `${redirectPage}${urlSafeEncodedHref}`);
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");

            // 为包含指定类名的链接添加外部链接图标
            const svgIcon = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg",
            );
            svgIcon.setAttribute("width", "16");
            svgIcon.setAttribute("height", "16");
            svgIcon.setAttribute("viewBox", "0 0 100 100");
            svgIcon.setAttribute("fill", "currentColor");
            const path = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path",
            );
            path.setAttribute("fill", "currentColor");
            path.setAttribute(
                "d",
                "M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z",
            );
            svgIcon.appendChild(path);

            const polygon = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "polygon",
            );
            polygon.setAttribute("fill", "currentColor");
            polygon.setAttribute(
                "points",
                "45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9",
            );
            svgIcon.appendChild(polygon);
            link.appendChild(svgIcon);
        });
    } catch (error) {
        console.error("处理链接时出错：", error);
    }
}

document.addEventListener("astro:page-load", initRedirectHandler);
