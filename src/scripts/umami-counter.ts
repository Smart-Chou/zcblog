/**
 * 页脚 Umami 计数：访问时实时追平（渐进增强，对应 Footer.astro）
 * - 构建期已渲染静态数字（src/data/site-stats.json），本脚本仅在其之上追平
 * - 数据链路全部为公开信息：/api/share/{slug} → token，再携
 *   x-umami-share-token / x-umami-share-context 调 stats 接口
 * - 失败静默（保留构建期数字）；每次会话只成功写入一次（会话内缓存复用）
 * - View Transitions 兼容：每次 astro:page-load 用缓存值重涂；首次带网络刷新
 */

function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}m`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return String(num);
}

let inflight = false;

async function refresh(): Promise<void> {
    const el = document.querySelector<HTMLElement>("[data-umami-counter]");
    if (!el) return;

    const base = el.dataset.umamiBase?.replace(/\/+$/, "");
    const slug = el.dataset.umamiShare;
    const website = el.dataset.umamiWebsite;
    const suffix = el.dataset.umamiSuffix || "views";
    if (!base || !slug || !website) return;

    // 会话缓存：成功后本会话内直接复用，避免每次导航重复请求
    const cacheKey = `zcblog:umami-views:${slug}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
        el.textContent = `${cached} ${suffix}`;
        return;
    }
    if (inflight) return;
    inflight = true;

    try {
        const shareRes = await fetch(`${base}/api/share/${slug}`);
        if (!shareRes.ok) return;
        const share = (await shareRes.json()) as { token?: string; shareId?: string };
        if (!share.token || !share.shareId) return;

        const statsRes = await fetch(
            `${base}/api/websites/${website}/stats?startAt=0&endAt=${Date.now()}`,
            {
                headers: {
                    "x-umami-share-token": share.token,
                    "x-umami-share-context": share.shareId,
                },
            },
        );
        if (!statsRes.ok) return;
        const stats = (await statsRes.json()) as { pageviews?: number };
        if (typeof stats.pageviews !== "number" || stats.pageviews <= 0) return;

        sessionStorage.setItem(cacheKey, String(stats.pageviews));
        const el2 = document.querySelector<HTMLElement>("[data-umami-counter]");
        if (el2) el2.textContent = `${formatNumber(stats.pageviews)} ${suffix}`;
    } catch {
        /* 静默：保留构建期数字 */
    } finally {
        inflight = false;
    }
}

// 模块级只绑定一次（View Transitions 下脚本可能被重复求值）
const umamiGlobal = window as unknown as { __zcblogUmamiCounterBound?: boolean };
if (!umamiGlobal.__zcblogUmamiCounterBound) {
    umamiGlobal.__zcblogUmamiCounterBound = true;
    document.addEventListener("astro:page-load", () => void refresh());
}
if (document.readyState !== "loading") {
    void refresh();
} else {
    document.addEventListener("DOMContentLoaded", () => void refresh());
}
