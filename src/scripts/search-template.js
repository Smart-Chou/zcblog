/**
 * Pagefind Component UI — 自定义结果模板
 *
 * 结构：文章主标题 + 树形子结果（每个子结果含自有摘要）
 *
 *   📄 文章主标题          ← 点击跳转
 *     │
 *     ├─ 🌿 子标题 1       ← 点击跳转到锚点
 *     │     摘要文本
 *     └─ 🌿 子标题 2       ← 点击跳转到锚点
 *           摘要文本
 *
 * 样式定义在 src/styles/search-global.css（全局样式），
 * 因为模板 HTML 由 JS 动态生成，Astro scoped style 无法匹配。
 */

/** 避免 XSS：转义标题和 URL */
function esc(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function createResultTemplate(r) {
    var meta = r.meta || {};
    // Pagefind 部分 fragment 的 meta 为空，兜底从 anchors[0] 取标题
    var title =
        meta.title ||
        (r.anchors && r.anchors[0] && r.anchors[0].text) ||
        "";
    var url = r.url || meta.url || "";
    var subs = (r.sub_results || []).slice(0, 6);

    var h = "";

    h += '<li class="custom-result-item" data-url="' + esc(url) + '">';

    // ── 主标题行：图标 + 链接 ──
    h += '<div class="custom-header">';
    h += '  <span class="custom-icon">';
    h +=
        '    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" opacity="0.85">';
    h += '      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>';
    h +=
        '      <path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
    h +=
        '      <path d="M16 13H8M16 17H8M10 9H8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>';
    h += "    </svg>";
    h += "  </span>";
    h +=
        '  <a class="custom-link" href="' +
        esc(url) +
        '">' +
        esc(title) +
        "</a>";
    h += "</div>";

    // ── 子结果树 ──
    if (subs.length > 0) {
        h += '<div class="custom-tree">';
        for (var i = 0; i < subs.length; i++) {
            var s = subs[i];
            var isLast = i === subs.length - 1;

            h += '<div class="custom-sub">';
            h += '  <span class="custom-branch"></span>';
            h +=
                '  <a class="custom-sub-link" href="' +
                esc(s.url) +
                '">' +
                esc(s.title) +
                "</a>";
            if (s.excerpt) {
                h +=
                    '<p class="custom-sub-excerpt">' +
                    s.excerpt +
                    "</p>";
            }
            h += "</div>";
        }
        h += "</div>";
    }

    h += "</li>";
    return h;
}

/** 将自定义结果模板应用到当前的 <pagefind-results> 元素 */
export function applyResultTemplate() {
    var resultsEl = document.querySelector("pagefind-results");
    if (!resultsEl) return;
    resultsEl.resultTemplate = createResultTemplate;
}

// 点击事件委托：点击结果项的任意位置都可以跳转
function handleResultClick(e) {
    // 找到最近的 .custom-result-item
    var item = e.target.closest(".custom-result-item");
    if (!item) return;

    var url = item.getAttribute("data-url");
    if (!url) return;

    // 如果点击的是 <a> 标签，交给浏览器默认行为，不做额外处理
    if (e.target.closest("a")) return;

    // 否则用 data-url 导航
    window.location.href = url;
}

// 鼠标中键 / Ctrl+点击 → 新标签页打开
function handleResultAuxClick(e) {
    if (e.button !== 1) return; // 只处理中键
    var item = e.target.closest(".custom-result-item");
    if (!item) return;
    var url = item.getAttribute("data-url");
    if (!url) return;
    if (e.target.closest("a")) return;
    e.preventDefault();
    window.open(url, "_blank");
}

document.addEventListener("click", handleResultClick);
document.addEventListener("auxclick", handleResultAuxClick);

// 首次加载时自动应用（等待 Pagefind 自定义元素注册完成）
customElements.whenDefined("pagefind-modal").then(applyResultTemplate);
