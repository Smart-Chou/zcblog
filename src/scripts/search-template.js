/**
 * Pagefind Component UI — 自定义结果模板
 * 文件图标 + 树形主干 + 枝干 + 节点圆点
 *
 * 样式定义在 src/styles/search-global.css（全局样式），
 * 因为模板 HTML 由 JS 动态生成，Astro scoped style 无法匹配。
 *
 * 结构概览:
 *   .custom-result-item
 *     .custom-header → 图标 + 标题（图标有 ::after 连接线向下）
 *     .custom-tree-body → 主干竖线 + 摘要 + 子结果（含树枝和节点圆点）
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
    var title = (r.meta && r.meta.title) || "";
    var url = r.url || (r.meta && r.meta.url) || "";
    var excerpt = r.excerpt || "";
    var subs = (r.sub_results || []).slice(0, 6); // 最多 6 条

    var h = "";

    h += '<li class="custom-result-item">';

    // ── 标题行：图标 + 链接 ──
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
    h += '  <a class="custom-link" href="' + esc(url) + '">' + esc(title) + "</a>";
    h += "</div>";

    // ── 树形主体（摘要 + 子结果，::before 为主干竖线）──
    if (excerpt || subs.length > 0) {
        h += '<div class="custom-tree-body">';

        if (excerpt) {
            h += '<p class="custom-excerpt">' + excerpt + "</p>";
        }

        for (var i = 0; i < subs.length; i++) {
            var s = subs[i];

            h += '<div class="custom-sub">';
            h += '  <span class="custom-branch"></span>';
            h += '  <a class="custom-sub-link" href="' + esc(s.url) + '">' + esc(s.title) + "</a>";
            if (s.excerpt) {
                h += '  <p class="custom-sub-excerpt">' + s.excerpt + "</p>";
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

// 首次加载时自动应用（等待 Pagefind 自定义元素注册完成）
customElements.whenDefined("pagefind-modal").then(applyResultTemplate);
