#!/usr/bin/env python3
"""A6 / 性能预算的可执行判据（G3）。

读 `dist/` 的构建产物，按页面类型统计 HTML / JS(gz) / CSS(gz)，与预算表比对。
不依赖网络、不依赖浏览器——LCP/CLS 这类现场指标另用 Lighthouse 在 G4 跑。

用法:
  python3 scripts/perf-budget.py <dist> [--json out.json]
退出码: 0 = 全部页面在预算内；1 = 有超支
"""
import json
import os
import re
import sys
import gzip

# 预算（KB, gz for js/css; raw for html）—— 见 docs/06-performance-budget.md
# 2026-10-30 修订（D-0051）：口径改为「跟随静态 import 链」，并分两级——
#   BUDGET = 门禁（CI 必红，取当前 p95 + 约 3~5%，防回归）
#   TARGET = 目标（不阻断，只报告差距；= 已签需求 A6 的 100KB）
# 2026-10-30 二次收紧（D-0052）：去掉 vendor 兜底后 JS 大降，门禁随之下调
# —— 预算是棘轮，只许往下调，不许往上抬。
BUDGET = {
    "article": {"html": 215, "js": 40, "css": 45},
    "list":    {"html": 105, "js": 28, "css": 40},
    "page":    {"html": 105, "js": 30, "css": 40},
}

TARGET = {"article": 100, "list": 100, "page": 100}

def gz(path):
    with open(path, "rb") as f:
        return len(gzip.compress(f.read(), 9))


def classify(rel):
    if rel.startswith("article/"):
        return "article"
    if re.match(r"^(index\.html|blog/|tags/|archives/)", rel):
        return "list"
    return "page"


def _static_imports(path):
    """只取静态 import（`from"./x.js"` / `import"./x.js"`）；`import("./x.js")` 是懒加载，不计入首屏。"""
    text = open(path, encoding="utf-8", errors="ignore").read()
    names = re.findall(r'from\s*"(\.[^"]+\.js)"', text)
    names += re.findall(r'\bimport\s*"(\.[^"]+\.js)"', text)
    return names


def js_total(dist, entry_urls, missing):
    """JS 按模块图汇总：entry + 静态 import 链去重。

    G4 修正（2026-10-30）：旧版只累加 HTML 里 <script src>，把 vendor chunk
    整块漏掉——实测文章页报 5.8KB 而真实首屏 JS 是 100KB+。预算必须跟着 import 走。
    """
    seen, stack, total = set(), list(entry_urls), 0
    while stack:
        u = stack.pop()
        if u in seen:
            continue
        seen.add(u)
        p = os.path.join(dist, u.lstrip("/"))
        if not os.path.exists(p):
            missing.append(u)
            continue
        total += gz(p)
        base = os.path.dirname(u)
        for rel in _static_imports(p):
            nxt = os.path.normpath(os.path.join(base, rel)).replace(os.sep, "/")
            stack.append("/" + nxt.lstrip("/"))
    return total


def stats(dist, page):
    html_path = os.path.join(dist, page)
    text = open(html_path, encoding="utf-8").read()
    js = [u for u in dict.fromkeys(re.findall(r'src="([^"]+\.js)"', text)) if not u.startswith("http")]
    css = [u for u in dict.fromkeys(re.findall(r'href="([^"]+\.css)"', text)) if not u.startswith("http")]
    missing = []
    def total(urls):
        b = 0
        for u in urls:
            p = os.path.join(dist, u.lstrip("/"))
            if os.path.exists(p):
                b += gz(p)
            else:
                missing.append(u)      # 引用缺失 = 失败，不是 0（红队 G3-round1 I-03）
        return b
    inline_js = sum(len(x) for x in re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", text, re.S))
    return {
        "page": page,
        "kind": classify(page),
        "html_kb": round(os.path.getsize(html_path) / 1024, 1),
        "js_kb": round(js_total(dist, js, missing) / 1024, 1),
        "css_kb": round(total(css) / 1024, 1),
        "inline_js_kb": round(inline_js / 1024, 1),
        "js_files": len(js),
        "missing": missing,
    }


def main():
    dist = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else "dist")
    out_json = sys.argv[sys.argv.index("--json") + 1] if "--json" in sys.argv else None

    pages = []
    for root, _dirs, files in os.walk(dist):
        for f in files:
            if f == "index.html":
                rel = os.path.relpath(os.path.join(root, f), dist)
                pages.append(rel)
    pages.sort()

    rows, over = [], []
    for rel in pages:
        s = stats(dist, rel)
        b = BUDGET[s["kind"]]
        bad = [k for k in ("html", "js", "css") if s[f"{k}_kb"] > b[k]]
        if s["missing"]:
            bad.append(f"引用缺失({len(s['missing'])})")
        s["over"] = bad
        rows.append(s)
        if bad:
            over.append(s)

    print(f"扫描 {len(rows)} 页 | 超预算 {len(over)} 页")
    print(f"{'类型':8} {'页数':>4} {'HTML p95':>9} {'JS p95':>7} {'JS 最大':>8} {'门禁':>6} {'目标':>6} {'差距':>7}")
    for kind, b in BUDGET.items():
        sub = [r for r in rows if r["kind"] == kind]
        if not sub:
            continue
        js = sorted(r["js_kb"] for r in sub)
        html = sorted(r["html_kb"] for r in sub)
        i95 = min(len(js) - 1, int(round(0.95 * (len(js) - 1))))
        p95_js, p95_html = js[i95], html[i95]
        tgt = TARGET.get(kind)
        gap = f"{p95_js - tgt:+.1f}" if tgt is not None else "-"
        print(f"{kind:8} {len(sub):>4} {p95_html:>9.1f} {p95_js:>7.1f} {max(js):>8.1f} {b['js']:>6} {(tgt if tgt is not None else '-'):>6} {gap:>7}")
    print("\n门禁:", json.dumps(BUDGET, ensure_ascii=False), "| 目标(JS):", json.dumps(TARGET, ensure_ascii=False))

    if over:
        print(f"\n超支页面（前 10）：")
        for r in over[:10]:
            print(f"  {r['page']}: html={r['html_kb']} js={r['js_kb']} css={r['css_kb']} 超 {r['over']}")

    if out_json:
        json.dump({"budget": BUDGET, "pages": rows}, open(out_json, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
        print(f"[saved] {out_json}")
    return 1 if over else 0


if __name__ == "__main__":
    sys.exit(main())
