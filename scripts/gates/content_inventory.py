#!/usr/bin/env python3
"""内容实况盘点：扫 Markdown 存量内容，输出结构化事实（G1 输入）。

用法: python3 content_inventory.py <content-dir> [--json out.json]
不依赖第三方库（环境无 PyYAML），只解析常见 frontmatter 子集。
"""
import json
import os
import re
import sys
from collections import Counter, defaultdict
from datetime import date

CJK = re.compile(r"[\u4e00-\u9fff]")
IMG_MD = re.compile(r"!\[[^\]]*\]\(([^)\s]+)")
IMG_HTML = re.compile(r"<img[^>]+src=[\"']([^\"']+)[\"']")
KEY = re.compile(r"^([A-Za-z_][\w-]*):\s*(.*)$")


def parse_scalar(v):
    v = v.strip()
    if v == "":
        return None
    if v[0] in "\"'" and v[-1:] == v[0] and len(v) > 1:
        return v[1:-1]
    if v.startswith("[") and v.endswith("]"):
        inner = v[1:-1].strip()
        if not inner:
            return []
        return [parse_scalar(x) for x in inner.split(",")]
    low = v.lower()
    if low in ("true", "false"):
        return low == "true"
    if low in ("null", "~"):
        return None
    return v


def strip_code(md):
    """去掉围栏代码块与行内代码。代码示例里的 ![](url)、<img src="$url"> 不是真实引用，
    否则 A3 会报假阳性（实测 piclist / typoraImg 两篇的表格里有 5 处行内代码占位符，
    另有 2 处 <img src="https://img.yourdomain.com/..."> 在 ```html 块里）。"""
    md = re.sub(r"```[\s\S]*?```", "", md)
    md = re.sub(r"~~~[\s\S]*?~~~", "", md)
    md = re.sub(r"`[^`\n]*`", "", md)
    return md


def parse_frontmatter(text):
    if not text.startswith("---"):
        return None, text
    end = text.find("\n---", 3)
    if end == -1:
        return None, text
    block = text[3:end].lstrip("\n")
    body = text[end + 4:]
    data = {}
    cur = None
    cur_indent = 0
    for raw in block.splitlines():
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        indent = len(raw) - len(raw.lstrip())
        line = raw.strip()
        if line.startswith("- "):
            item = parse_scalar(line[2:])
            if cur is not None:
                if not isinstance(data.get(cur), list):
                    data[cur] = []
                data[cur].append(item)
            continue
        m = KEY.match(line)
        if not m:
            continue
        k, v = m.group(1), m.group(2)
        if v.strip() == "":
            cur, cur_indent = k, indent
            data[k] = None  # 可能是 list 或 nested map，稍后定型
        elif indent > 0 and cur is not None and isinstance(data.get(cur), dict):
            data[cur][k] = parse_scalar(v)
        elif indent > 0 and cur is not None and data.get(cur) is None:
            data[cur] = {k: parse_scalar(v)}
        else:
            data[k] = parse_scalar(v)
            cur, cur_indent = None, indent
    return data, body


def as_int(v, default=0):
    if isinstance(v, bool):
        return int(v)
    try:
        return int(str(v).strip())
    except (TypeError, ValueError):
        return default


def bucket(n, edges):
    for e in edges:
        if n < e:
            return f"<{e}"
    return f">={edges[-1]}"


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        raise SystemExit(1)
    root = os.path.expanduser(sys.argv[1])
    out_json = None
    if "--json" in sys.argv:
        out_json = sys.argv[sys.argv.index("--json") + 1]

    files = []
    for dirpath, _dirs, names in os.walk(root):
        if "/.git" in dirpath or "node_modules" in dirpath:
            continue
        for n in names:
            if n.endswith((".md", ".mdx")) and not n.startswith("."):
                files.append(os.path.join(dirpath, n))
    files.sort()

    rows = []
    key_usage = Counter()
    tag_all = Counter()
    years = Counter()
    img_forms = Counter()
    body_img_forms = Counter()
    remote_hosts = Counter()
    missing = defaultdict(list)
    warnings = []

    for p in files:
        rel = os.path.relpath(p, root)
        text = open(p, encoding="utf-8", errors="replace").read()
        fm, body = parse_frontmatter(text)
        if fm is None:
            warnings.append(f"无 frontmatter: {rel}")
            fm = {}
        for k in fm:
            key_usage[k] += 1
        tags = fm.get("tags")
        if isinstance(tags, str):
            tags = [tags]
            warnings.append(f"tags 为字符串而非列表: {rel}")
        tags = tags or []
        for t in tags:
            if t:
                tag_all[str(t).strip()] += 1
        # 封面 / 正文图 / 正文统计只对「真实文章」（有 pubDate）计数，
        # 否则素材文件与副本会污染口径（曾把 60 篇无封面算成 63 篇）。
        pub = str(fm.get("pubDate") or fm.get("published") or "")
        m = re.match(r"(\d{4})-(\d{2})", pub)
        if m:
            years[m.group(1)] += 1
        else:
            missing["pubDate"].append(rel)

        img = fm.get("image")
        if isinstance(img, dict):
            url = img.get("url")
        else:
            url = img
        if m:
            if not url:
                img_forms["(无封面)"] += 1
            elif str(url).startswith(("http://", "https://")):
                img_forms["远程 URL"] += 1
            elif str(url).startswith("/"):
                img_forms["根路径 /"] += 1
            elif "../" in str(url):
                img_forms["相对 ../../assets"] += 1
            else:
                img_forms["其它相对路径"] += 1

        for field in ("title", "description", "tags", "image", "upDate", "draft", "lang", "paid", "sticky", "toc"):
            if fm.get(field) in (None, "", [], {}):
                missing[field].append(rel)

        refs = IMG_MD.findall(strip_code(body)) + IMG_HTML.findall(strip_code(body))
        if m:
            for r in refs:
                if r.startswith(("http://", "https://")):
                    body_img_forms["远程 URL"] += 1
                    remote_hosts[re.sub(r"^https?://([^/]+).*", r"\1", r)] += 1
                elif r.startswith("../../assets") or r.startswith("assets/"):
                    body_img_forms["相对 assets"] += 1
                elif r.startswith("/"):
                    body_img_forms["根路径 /"] += 1
                else:
                    body_img_forms["其它相对"] += 1

        cjk = len(CJK.findall(body))
        latin = len(re.findall(r"[A-Za-z0-9][A-Za-z0-9'\-]*", body))
        rows.append({
            "file": rel,
            "title": fm.get("title"),
            "title_len": len(str(fm.get("title") or "")),
            "desc_len": len(str(fm.get("description") or "")),
            "pubDate": pub,
            "has_update": bool(fm.get("upDate")),
            "tags": len(tags),
            "cjk": cjk,
            "latin": latin,
            "words": cjk + latin,
            "body_images": len(refs),
            "draft": fm.get("draft") is True,
            "paid": fm.get("paid") is not None,
            "sticky": as_int(fm.get("sticky")),
            "lang": fm.get("lang") or "zh(默认)",
        })

    titles = Counter(str(r["title"]) for r in rows if r["title"])
    dup_titles = {t: c for t, c in titles.items() if c > 1}
    dup_basenames = {b: c for b, c in Counter(os.path.basename(r["file"]) for r in rows).items() if c > 1}
    stacks = Counter(tuple(sorted({t.strip() for t in (parse_frontmatter(open(p, encoding="utf-8").read())[0] or {}).get("tags") or []})) for p in files)
    _ = stacks

    tag_counts = sorted(tag_all.items(), key=lambda x: -x[1])
    singles = [t for t, c in tag_counts if c == 1]
    words = sorted(r["words"] for r in rows)
    n = len(rows)

    summary = {
        "files": n,
        "dir": root,
        "years": dict(sorted(years.items())),
        "date_range": [min((r["pubDate"] for r in rows if r["pubDate"]), default=""),
                       max((r["pubDate"] for r in rows if r["pubDate"]), default="")],
        "frontmatter_key_usage": dict(key_usage.most_common()),
        "missing": {k: len(v) for k, v in sorted(missing.items(), key=lambda x: -len(x[1]))},
        "missing_samples": {k: v[:5] for k, v in missing.items() if v},
        "tags": {
            "distinct": len(tag_all),
            "top20": tag_counts[:20],
            "singletons": len(singles),
            "singleton_samples": sorted(singles)[:30],
            "per_post": {
                "avg": round(sum(r["tags"] for r in rows) / n, 2) if n else 0,
                "max": max((r["tags"] for r in rows), default=0),
                "buckets": dict(Counter(bucket(r["tags"], [1, 2, 3, 4, 6, 9]) for r in rows)),
            },
        },
        "cover_forms": dict(img_forms),
        "body_image_forms": dict(body_img_forms),
        "body_images_total": sum(r["body_images"] for r in rows),
        "words": {
            "total": sum(r["words"] for r in rows),
            "median": words[n // 2] if n else 0,
            "p90": words[int(n * 0.9) - 1] if n else 0,
            "max": words[-1] if n else 0,
            "min": words[0] if n else 0,
            "buckets": dict(Counter(bucket(r["words"], [800, 1500, 3000, 6000]) for r in rows)),
        },
        "flags": {
            "draft": sum(1 for r in rows if r["draft"]),
            "paid": sum(1 for r in rows if r["paid"]),
            "sticky": sum(1 for r in rows if r["sticky"]),
            "with_update": sum(1 for r in rows if r["has_update"]),
            "lang_en": sum(1 for r in rows if r["lang"] == "en"),
        },
        "seo": {
            "title_over_60": sum(1 for r in rows if r["title_len"] > 60),
            "desc_missing": sum(1 for r in rows if r["desc_len"] == 0),
            "desc_under_60": sum(1 for r in rows if 0 < r["desc_len"] < 60),
            "desc_over_160": sum(1 for r in rows if r["desc_len"] > 160),
            "desc_avg": round(sum(r["desc_len"] for r in rows) / n, 1) if n else 0,
        },
        "dup_titles": dup_titles,
        "dup_basenames": dup_basenames,
        "empty_body": sum(1 for r in rows if r["words"] == 0),
        "with_pubdate": sum(1 for r in rows if r["pubDate"]),
        "remote_hosts": dict(remote_hosts.most_common(10)),
        "warnings": warnings[:20],
    }

    print(json.dumps(summary, ensure_ascii=False, indent=2))
    if out_json:
        os.makedirs(os.path.dirname(out_json) or ".", exist_ok=True)
        json.dump({"summary": summary, "rows": rows}, open(out_json, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"\n[saved] {out_json}", file=sys.stderr)


if __name__ == "__main__":
    main()
