import { pageviewCount } from "@waline/client/pageview";
import { waline } from "~/config";

export function initWalinePageview(): void {
    if (!waline.enable) return;

    const serverURL = waline.serverUrl;
    if (!serverURL) {
        console.warn("Waline server URL is not configured");
        return;
    }

    try {
        pageviewCount({
            serverURL,
            selector: ".waline-pageview-count",
            update: true,
        });
    } catch (error) {
        console.error("Failed to initialize Waline pageview:", error);
    }
}

// 不在这里自动跑：由 ~/scripts/pageview（BaseLayout 常驻模块）按需动态 import 并调用，
// 否则 SPA 换页时模块不会重新执行，计数永远停在 0（D-0090）。
