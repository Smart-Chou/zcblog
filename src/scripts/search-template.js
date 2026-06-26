/**
 * Pagefind 搜索结果 — 自定义模板 + 点击增强
 *
 * 主结果（meta/excerpt/url）沿用官方 buildTemplateData，保证
 * 大标题和第一个二级标题之间的 excerpt 行为与官方一致。
 *
 * 子结果：取原始 r.sub_results，仅做最小修复：
 *   1. 过滤 root（URL === pageUrl，官方 getDisplaySubResults 已做）
 *   2. 按 anchor 文档位置排序（替代 thinSubResults 的 locations.length）
 *   3. 去重 URL（防御 thinSubResults filter+includes 非唯一 bug）
 *   4. maxSubResults 截断
 *
 * 点击：整行可点（包括空白区域），中键新标签页打开。
 */

function esc(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function createResultTemplate(r, resultsEl) {
    // ── 主结果：走官方 buildTemplateData ──
    var opts = {
        showSubResults: false, // 主结果 excerpt 走官方逻辑
        maxSubResults: 0,
        linkTarget: resultsEl.linkTarget,
        showImages: resultsEl.showImages,
    };
    var data = resultsEl.buildTemplateData
        ? resultsEl.buildTemplateData.call(resultsEl, r, opts)
        : null;

    var meta = (data && data.meta) || r.meta || {};
    var title = meta.title || (r.anchors && r.anchors[0] && r.anchors[0].text) || "";
    var url = (data && data.url) || r.url || meta.url || "";
    var mainExcerpt = (data && data.excerpt) || r.excerpt || "";

    // ── 子结果：用原始 r.sub_results，不做 thinSubResults ──
    // thinSubResults 按 locations.length 排序对中文不稳定；
    // 其 filter+includes 实现可能导致同一 URL 出现多次。
    // 这里直接取原始数据，按文档顺序排、去重、截断。
    var pageUrl = url;
    var rawSubs = Array.isArray(r.sub_results) ? r.sub_results.filter(function (s) {
        return s.url !== pageUrl;
    }) : [];

    // anchor → byte offset，用于文档顺序排序
    var anchorPos = {};
    if (Array.isArray(r.anchors)) {
        for (var ai = 0; ai < r.anchors.length; ai++) {
            var a = r.anchors[ai];
            anchorPos[a.id] = a.location || ai;
        }
    }
    function getAnchorId(subUrl) {
        var hash = subUrl.lastIndexOf("#");
        return hash >= 0 ? subUrl.slice(hash + 1) : "";
    }
    rawSubs.sort(function (a, b) {
        var aId = getAnchorId(a.url);
        var bId = getAnchorId(b.url);
        var aPos = anchorPos[aId] != null ? anchorPos[aId] : Infinity;
        var bPos = anchorPos[bId] != null ? anchorPos[bId] : Infinity;
        return aPos - bPos;
    });

    // 去重 URL
    var seenUrls = {};
    var deduped = [];
    for (var di = 0; di < rawSubs.length; di++) {
        var s = rawSubs[di];
        if (!seenUrls[s.url]) {
            seenUrls[s.url] = true;
            deduped.push(s);
        }
    }

    var maxSubs = resultsEl.maxSubResults || 5;
    var subs = deduped.slice(0, maxSubs);

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
    h += '  <a class="custom-link" href="' + esc(url) + '">' + esc(title) + "</a>";
    h += "</div>";

    // ── 主摘要 + 子结果树（wrapper 保证竖线不断）──
    var hasExcerpt = !!mainExcerpt;
    if (hasExcerpt || subs.length > 0) {
        h += '<div class="custom-tree-body">';

        // 主摘要（来自官方 buildTemplateData）
        if (hasExcerpt) {
            h += '<p class="custom-excerpt">' + mainExcerpt + "</p>";
        }

        // 子结果树
        if (subs.length > 0) {
            h += '<div class="custom-tree">';
            for (var i = 0; i < subs.length; i++) {
                var s = subs[i];
                h += '<div class="custom-sub" data-url="' + esc(s.url) + '">';
                h += '  <span class="custom-branch"></span>';
                h +=
                    '  <a class="custom-sub-link" href="' +
                    esc(s.url) +
                    '">' +
                    esc(s.title) +
                    "</a>";
                if (s.excerpt) {
                    h += '<p class="custom-sub-excerpt">' + s.excerpt + "</p>";
                }
                h += "</div>";
            }
            h += "</div>";
        }

        h += "</div>";
    }

    h += "</li>";
    return h;
}

/** 将模板应用到当前的 <pagefind-results> 元素 */
function applyResultTemplate() {
    var resultsEl = document.querySelector("pagefind-results");
    if (!resultsEl) return;
    resultsEl.resultTemplate = function (r) {
        return createResultTemplate(r, resultsEl);
    };
}

// 首次加载时应用
customElements.whenDefined("pagefind-modal").then(applyResultTemplate);

// ── 点击事件委托 ──

function handleResultClick(e) {
    if (e.target.closest("a")) return;

    var sub = e.target.closest(".custom-sub");
    if (sub) {
        var subUrl = sub.getAttribute("data-url");
        if (subUrl) window.location.href = subUrl;
        return;
    }

    var item = e.target.closest(".custom-result-item");
    if (!item) return;
    var url = item.getAttribute("data-url");
    if (url) window.location.href = url;
}

function handleResultAuxClick(e) {
    if (e.button !== 1) return;
    if (e.target.closest("a")) return;

    var sub = e.target.closest(".custom-sub");
    var item = e.target.closest(".custom-result-item");
    var url = (sub && sub.getAttribute("data-url")) || (item && item.getAttribute("data-url"));
    if (url) {
        e.preventDefault();
        window.open(url, "_blank");
    }
}

document.addEventListener("click", handleResultClick);
document.addEventListener("auxclick", handleResultAuxClick);

export { applyResultTemplate };
