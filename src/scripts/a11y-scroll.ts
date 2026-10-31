/**
 * 可滚动区域可聚焦（axe 规则 scrollable-region-focusable）
 *
 * 代码块和宽表格在窄屏上是横向可滚动的，但键盘用户没法滚——
 * 只有当内容真的溢出时才加 tabindex="0"，避免给所有 pre 塞一个 Tab 停靠点。
 */
function markScrollable(): void {
    document.querySelectorAll<HTMLElement>("pre, table").forEach((el) => {
        if (el.hasAttribute("tabindex")) return;
        const scrollable = el.scrollWidth > el.clientWidth + 1;
        if (scrollable) {
            el.setAttribute("tabindex", "0");
            // 滚动容器可聚焦后需要可访问名称，否则读屏只念「分组」
            if (!el.hasAttribute("aria-label") && !el.hasAttribute("role")) {
                el.setAttribute("role", "region");
                el.setAttribute(
                    "aria-label",
                    el.tagName === "TABLE" ? "表格（可横向滚动）" : "代码（可横向滚动）",
                );
            }
        }
    });
}

markScrollable();
document.addEventListener("astro:page-load", markScrollable);
window.addEventListener("resize", markScrollable, { passive: true });
