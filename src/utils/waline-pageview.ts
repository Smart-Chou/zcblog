import { pageviewCount } from "@waline/client/pageview";
import { waline } from "~/self.config";

export function initWalinePageview() {
    const serverURL = waline.serverUrl;
    if (!serverURL) {
        console.warn("Waline server URL is not configured");
        return;
    }

    try {
        pageviewCount({
            serverURL,
            path: window.location.pathname,
            selector: ".waline-pageview-count",
            update: true,
        });
    } catch (error) {
        console.error("Failed to initialize Waline:", error);
    }
}

if (typeof document !== "undefined") {
    document.addEventListener("astro:page-load", initWalinePageview);
}
