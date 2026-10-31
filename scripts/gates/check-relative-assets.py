#!/usr/bin/env python3
"""A3 判据：找出内容仓里所有「相对路径」图片引用。

为什么不能只用 grep：相对路径有三种形态，任一漏掉就会假绿
  1. Markdown  ![](../../assets/x.png)
  2. HTML      <img src="photo.jpg">
  3. frontmatter  image:\n  url: ../../assets/x.png

判定：引用不是 http(s):// 也不是以 / 开头（站点绝对）→ 命中。
用法: python3 scripts/check-relative-assets.py <content-dir>
      python3 scripts/check-relative-assets.py <content-dir> --verify <code-repo>   # 解析每条能否找到文件
      python3 scripts/check-relative-assets.py <content-dir> --expect 22            # 同时断言处数
退出码: 0 = 符合判据；1 = 有命中/有解析失败/处数不符
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content_inventory import IMG_HTML, IMG_MD, parse_frontmatter, strip_code  # noqa: E402

FM_URL = re.compile(r"^\s+url:\s*(.+?)\s*$", re.M)


def is_relative(ref):
    r = str(ref).strip().strip("\"'")
    if not r:  # 空串 = 无封面，不是相对引用
        return False
    return not (r.startswith(("http://", "https://", "/", "#", "data:")))


def main():
    root = os.path.expanduser(sys.argv[1])
    code_repo = None
    if "--verify" in sys.argv:
        code_repo = os.path.expanduser(sys.argv[sys.argv.index("--verify") + 1])
    content_repo = None
    if "--verify-content" in sys.argv:
        content_repo = os.path.expanduser(sys.argv[sys.argv.index("--verify-content") + 1])
    expect = None
    if "--expect" in sys.argv:
        expect = int(sys.argv[sys.argv.index("--expect") + 1])
    hits = []
    for dp, _dirs, ns in os.walk(root):
        if "/.git" in dp:
            continue
        for n in sorted(ns):
            if not n.endswith((".md", ".mdx")):
                continue
            p = os.path.join(dp, n)
            rel = os.path.relpath(p, root)
            text = open(p, encoding="utf-8", errors="replace").read()
            fm, body = parse_frontmatter(text)
            body = strip_code(body)
            refs = [("md", r) for r in IMG_MD.findall(body)]
            refs += [("html", r) for r in IMG_HTML.findall(body)]
            if fm and fm.get("image"):
                block = re.search(r"^image:\s*$([\s\S]*?)(?=^\S|\Z)", text, re.M)
                if block:
                    refs += [("fm", m) for m in FM_URL.findall(block.group(1))]
            for kind, r in refs:
                if is_relative(r):
                    hits.append((rel, kind, r))

    for rel, kind, r in hits:
        print(f"{rel}\t[{kind}]\t{r}")
    print(f"\n相对引用: {len(hits)} 处")

    bad = 0
    if code_repo:
        # 相对路径从 src/content/article/ 解析（A3 的「全部能被构建解析」）
        base = os.path.join(code_repo, "src", "content", "article")
        print("\n解析结果（代码仓 src/assets）：")
        for rel, kind, r in hits:
            target = os.path.normpath(os.path.join(base, str(r).strip().strip("\"'")))
            ok = os.path.exists(target)
            if not ok:
                bad += 1
                print(f"  MISS  {rel}\t{r}\t→ {target}")
        print(f"  可解析 {len(hits) - bad}/{len(hits)}，缺失 {bad}")

    if content_repo:
        # 内容仓布局：文章在根，资产在 ./assets/。引用里的 ../../assets/X 去掉两级后落到 assets/X
        print("\n解析结果（内容仓 assets/）：")
        for rel, kind, r in hits:
            ref = str(r).strip().strip("\"'")
            while ref.startswith("../"):
                ref = ref[3:]
            target = os.path.normpath(os.path.join(content_repo, ref))
            ok = os.path.exists(target)
            if not ok:
                bad += 1
                print(f"  MISS  {rel}\t{r}\t→ {target}")
        print(f"  可解析 {len(hits) - bad}/{len(hits)}，缺失 {bad}")

    if expect is not None and len(hits) != expect:
        print(f"处数不符：实测 {len(hits)}，期望 {expect}")
        return 1
    return 1 if (bad or (expect is None and hits)) else 0


if __name__ == "__main__":
    sys.exit(main())
