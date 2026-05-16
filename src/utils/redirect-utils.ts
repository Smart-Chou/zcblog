/**
 * Shared redirect utilities used by both the Astro build-time integration
 * and the client-side redirect handler.
 */

export const REDIRECT_PAGE = "/redirect/?url=";

const EXTERNAL_LINK_SVG = `
    <path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path>
    <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon>
`;

/** URL-safe Base64 encoding (works in Node.js 18+ and all modern browsers) */
export function toUrlSafeBase64(str: string): string {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/** Check if an href is an external link (different host) */
export function isExternalUrl(
    href: string | null,
    currentHost: string,
): boolean {
    if (!href) return false;
    if (/^(\.|\/(?!\/)|#)/.test(href)) return false;
    try {
        return new URL(href, `https://${currentHost}`).host !== currentHost;
    } catch {
        return false;
    }
}

/** Append external-link SVG icon to a link element (shared by build-time and client-side) */
export function appendExternalLinkIcon(link: Element): void {
    const doc = link.ownerDocument;
    if (!doc) return;
    const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("fill", "currentColor");
    svg.innerHTML = EXTERNAL_LINK_SVG;
    link.appendChild(svg);
}
