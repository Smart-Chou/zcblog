/**
 * 分享功能客户端增强（对应 PostShare.astro）
 * - 微信二维码弹层开关（外点 / Esc 关闭）
 * - 复制链接（Clipboard API，失败降级 execCommand）
 * - 系统分享（navigator.share；仅触摸设备显示按钮）
 * - 微信内置浏览器：微信入口改为"点右上角"提示；隐藏系统分享
 * - Umami 埋点（share 事件）
 * View Transitions 兼容：document 级事件委托 + 模块级一次注册
 */

const isWeChatBrowser = /MicroMessenger/i.test(navigator.userAgent);

type UmamiTracker = { track: (name: string, data?: Record<string, unknown>) => void };

/**
 * 上报 share 事件（Umami）。
 * 坑：全站 umami 以 Partytown 方式加载（type="text/partytown"），脚本运行在 Web Worker 中，
 * 主线程不存在 window.umami。因此优先用 tracker；缺失时按官方 tracker 同款 payload 直接 POST /api/send。
 * 域名守卫与 tracker 的 data-domains 行为一致（dev/localhost 静默跳过）。
 */
function track(platform: string) {
    const umami = (window as unknown as { umami?: UmamiTracker }).umami;
    if (umami?.track) {
        umami.track("share", { platform });
        return;
    }
    const el = document.querySelector<HTMLScriptElement>("script[data-website-id]");
    const website = el?.dataset.websiteId;
    if (!el || !website) return;
    const domains = (el.dataset.domains ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    if (domains.length > 0 && !domains.includes(location.hostname)) return;
    const payload = {
        website,
        screen: `${screen.width}x${screen.height}`,
        language: navigator.language,
        title: document.title,
        hostname: location.hostname,
        url: location.href,
        referrer: document.referrer.startsWith(location.origin) ? "" : document.referrer,
        name: "share",
        data: { platform },
    };
    void fetch(`${new URL(el.src).origin}/api/send`, {
        keepalive: true,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "event", payload }),
        credentials: "omit",
    }).catch(() => {});
}

function closeWrap(wrap: Element) {
    wrap.classList.remove("open");
    wrap.querySelector("[data-share-action='wechat']")?.setAttribute("aria-expanded", "false");
    wrap.querySelector(".share-pop")?.setAttribute("aria-hidden", "true");
}

function closeAllPops() {
    document.querySelectorAll(".share-wechat-wrap.open").forEach(closeWrap);
}

async function copyText(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        /* 走降级路径 */
    }
    try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        textarea.remove();
        return ok;
    } catch {
        return false;
    }
}

function copyFeedback(button: Element) {
    button.classList.add("copied");
    window.setTimeout(() => button.classList.remove("copied"), 1400);
}

function handleAction(actionEl: Element, root: HTMLElement) {
    const action = actionEl.getAttribute("data-share-action");
    if (action === "wechat") {
        const wrap = actionEl.closest(".share-wechat-wrap");
        if (!wrap) return;
        document.querySelectorAll(".share-wechat-wrap.open").forEach((other) => {
            if (other !== wrap) closeWrap(other);
        });
        const open = wrap.classList.toggle("open");
        actionEl.setAttribute("aria-expanded", String(open));
        wrap.querySelector(".share-pop")?.setAttribute("aria-hidden", String(!open));
        if (open) track("wechat");
        return;
    }
    if (action === "copy") {
        void copyText(root.dataset.shareUrl || location.href).then((ok) => {
            if (ok) {
                copyFeedback(actionEl);
                track("copy");
            }
        });
        return;
    }
    if (action === "native") {
        const url = root.dataset.shareUrl || location.href;
        const title = root.dataset.shareTitle || document.title;
        if (typeof navigator.share === "function") {
            navigator.share({ title, url }).catch(() => {});
        }
        track("native");
    }
}

function onDocumentClick(event: Event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const root = target.closest<HTMLElement>("[data-post-share]");
    const actionEl = root && target.closest("[data-share-action]");
    if (root && actionEl) {
        handleAction(actionEl, root);
        if (actionEl.getAttribute("data-share-action") === "wechat") return;
    }

    const platformEl = root && target.closest("[data-share-platform]");
    if (platformEl) {
        track(platformEl.getAttribute("data-share-platform") || "unknown");
    }

    // 点击弹层之外任何位置 → 收起
    document.querySelectorAll(".share-wechat-wrap.open").forEach((wrap) => {
        if (!wrap.contains(target)) closeWrap(wrap);
    });
}

function onDocumentKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") closeAllPops();
}

/** 每页初始化：系统分享按钮/微信入口显隐、微信内 UA 特判 */
function initShareUi() {
    const canNativeShare = typeof navigator.share === "function";
    const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;

    document.querySelectorAll<HTMLElement>("[data-post-share]").forEach((root) => {
        const wechatWrap = root.querySelector<HTMLElement>(".share-wechat-wrap");
        const nativeBtn = root.querySelector<HTMLElement>(".share-icon--native");

        if (isWeChatBrowser) {
            // 微信内：保留微信入口（触发"点右上角"提示），隐藏系统分享
            wechatWrap?.setAttribute("data-in-wechat", "1");
            wechatWrap?.classList.remove("share-hidden");
            nativeBtn?.classList.remove("share-visible");
            return;
        }
        if (canNativeShare && coarsePointer) {
            wechatWrap?.classList.add("share-hidden");
            nativeBtn?.classList.add("share-visible");
        } else {
            wechatWrap?.classList.remove("share-hidden");
            nativeBtn?.classList.remove("share-visible");
        }
    });
}

// 挂 window 级守卫：脚本可能被内联并在导航后重新执行，避免重复绑定
const shareGlobal = window as unknown as { __zcblogShareBound?: boolean };
if (!shareGlobal.__zcblogShareBound) {
    shareGlobal.__zcblogShareBound = true;
    document.addEventListener("astro:page-load", initShareUi);
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onDocumentKeydown);
}
if (document.readyState !== "loading") {
    initShareUi();
} else {
    document.addEventListener("DOMContentLoaded", initShareUi);
}
