/**
 * compute-sri.mjs
 * 为外部 CDN 依赖计算 SRI (Subresource Integrity) hash。
 * 用法: node scripts/compute-sri.mjs
 * 输出: 各 CDN 资源的 sha384 hash，可手动填入对应的脚本加载器。
 */

const RESOURCES = [
    // Chart.js
    { url: "https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js", label: "Chart.js" },
    // D3
    { url: "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js", label: "D3 v7" },
    // markmap
    {
        url: "https://cdn.jsdelivr.net/npm/markmap-lib@0.18/dist/browser/index.min.js",
        label: "markmap-lib",
    },
    {
        url: "https://cdn.jsdelivr.net/npm/markmap-view@0.18/dist/browser/index.min.js",
        label: "markmap-view",
    },
    // Reveal.js
    { url: "https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.min.js", label: "Reveal.js JS" },
    { url: "https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.min.css", label: "Reveal.js CSS" },
    // MathJax
    {
        url: "https://cdn.bootcdn.net/ajax/libs/mathjax/3.2.2/es5/tex-chtml.min.js",
        label: "MathJax",
    },
    // Mermaid
    { url: "https://cdn.bootcdn.net/ajax/libs/mermaid/10.9.0/mermaid.min.js", label: "Mermaid" },
    // KaTeX
    { url: "https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.9/katex.min.css", label: "KaTeX CSS" },
];

async function computeIntegrity(url, label) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.arrayBuffer();
        const hash = await crypto.subtle.digest("SHA-384", body);
        const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
        console.log(`  ${label}: sha384-${base64}`);
    } catch (e) {
        console.error(`  ${label}: FAILED — ${e.message}`);
    }
}

console.log("Computing SRI hashes...\n");
for (const { url, label } of RESOURCES) {
    await computeIntegrity(url, label);
}
console.log("\nDone. Add these hashes to the script loaders and static script tags.");
