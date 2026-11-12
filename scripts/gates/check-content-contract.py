#!/usr/bin/env python3
"""内容契约门禁（A2b）：内容仓的 frontmatter 键，生产 schema 是否认识。

为什么需要这道门禁
------------------
2026-11-09 内容仓给 6 篇文章加了 `series` / `seriesOrder`，而生产仓 schema 是
`.strict()` 且没声明这两个键 → 定时部署连炸 4 天，站点内容冻结，无人发现。

当时不是没有检查，而是检查都查在别处：
  - `zcblog-v2` 的 CI 用 `e2e/fixtures/pages-visual/` 的固定内容构建，从不碰真实内容仓；
  - 生产仓只有 A2（遗留键）与 A3（相对图），两者都拿「已知答案」比对，
    不回答「有没有从没见过的键」；
  - 真实内容只在 deploy.yml 里被 `cp` 进来，而唯一的守门人是 `astro build` 自己，
    它要等依赖装完、跑满 90 秒才报第一个错，且一次只报一个键。

本门禁把这件事提前到「cp 之后、装依赖之前」，一次列出**全部**未知键并给出两条修法。

判据
----
允许的键 = schema 声明的键 ∪ normalize-frontmatter.mjs 会消费掉的键。
归一化集合从脚本里读，不在这里抄一份，避免两处漂移（抄的那份一定会忘更新）。

用法
----
    python3 scripts/gates/check-content-contract.py <内容目录> [--schema <content.config.ts>]

退出码: 0 = 全部认识；1 = 有未知键（部署应中断）；2 = 门禁自身故障（前置文件缺失/解析失败）
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content_inventory import parse_frontmatter  # noqa: E402

DEFAULT_SCHEMA = "src/content.config.ts"
DEFAULT_NORMALIZER = "scripts/normalize-frontmatter.mjs"


def die(msg):
    """门禁自身故障：报错并以退出码 2 结束。

    与「有未知键」（退出码 1）分开，是为了让 CI 能区分
    「内容真有问题」和「门禁自己坏了」——前者该修内容，后者该修门禁，
    混成一个码会让下次排查从错误的方向开始。
    """
    print(msg, file=sys.stderr)
    raise SystemExit(2)


def read(path):
    with open(path, encoding="utf-8", errors="replace") as f:
        return f.read()


def strip_js_comments(src):
    """把 // 与 /* */ 注释替换成等长空白，保持偏移不变。

    不剥注释的话，`title: ...,` 与下一条 `/** 说明 */ description:` 之间的
    注释尾部是 `/`，键前字符判据失效 → schema 真键被漏掉一半（实测只认出 5/14）。
    """
    out = []
    i, n = 0, len(src)
    while i < n:
        if src.startswith("//", i):
            j = src.find("\n", i)
            j = n if j == -1 else j
            out.append(" " * (j - i))
            i = j
        elif src.startswith("/*", i):
            j = src.find("*/", i + 2)
            j = n if j == -1 else j + 2
            out.append(" " * (j - i))
            i = j
        else:
            out.append(src[i])
            i += 1
    return "".join(out)


def schema_keys(path):
    """取 article collection schema 的**顶层** frontmatter 键。

    实现方式：先定位 `schema:` 那一行之后的第一个 `xxx: z.` 键（即 `title`），
    把它的缩进当作基准；之后只收「缩进与基准完全相同」的键，遇到缩进更小的行
    （`.strict(),` / `})`）就结束。

    为什么不数花括号：schema 里 `image: z.object({ url, alt })` 是嵌套对象，
    数括号会把内层的 `url` / `alt` 当成 frontmatter 键（实测就是这么错的）；
    为什么不用正则找 `z.object(`：`image` 的内层对象也是一个 `z.object(`，
    首个匹配可能落在内层。缩进基准对这两者都免疫，且 prettier 不改变同级缩进。
    """
    if not os.path.exists(path):
        die(f"[A2b] 找不到 schema: {path}")

    src = strip_js_comments(read(path))
    m = re.search(r"export\s+const\s+article\s*=\s*defineCollection\s*\(", src)
    if not m:
        die("[A2b] 在 schema 里找不到 `article = defineCollection(`，门禁需同步更新")

    lines = src[m.end():].split("\n")
    STRUCTURAL = {"loader", "schema"}  # collection 的结构性键，不是 frontmatter 字段
    base = None
    keys = []
    for line in lines:
        km = re.match(r"^(\s+)([A-Za-z_][A-Za-z0-9_]*):\s*\S", line)
        if not km:
            # 缩进小于基准的收尾行（`.strict(),` / `})` / `});`）→ article schema 结束
            if base is not None and line.strip() and (
                len(line) - len(line.lstrip())
            ) < base:
                break
            continue
        indent, key = len(km.group(1)), km.group(2)
        if key in STRUCTURAL and base is None:
            continue
        if base is None:
            base = indent  # 第一个非结构性键（title）的缩进当基准
            keys.append(key)
        elif indent == base:
            keys.append(key)
        elif indent < base:
            break
    if not keys:
        die("[A2b] schema 键提取结果为空，门禁需同步更新")
    return set(keys)


def normalized_keys(path):
    """normalize 脚本会删掉/消费的键。

    FEATURE_KEYS 直接读常量；`category` 是脚本里硬编码删的，单独认。
    两处都从源文件读，脚本改了这里自动跟上。
    """
    if not os.path.exists(path):
        die(f"[A2b] 找不到归一化脚本: {path}")

    src = read(path)
    m = re.search(r"FEATURE_KEYS\s*=\s*\[([^\]]*)\]", src)
    if not m:
        die("[A2b] normalize-frontmatter.mjs 里找不到 FEATURE_KEYS，门禁需同步更新")

    feats = set(re.findall(r"[\"']([A-Za-z0-9_-]+)[\"']", m.group(1)))
    extra = set()
    if re.search(r"\^category:", src):
        extra.add("category")
    return feats | extra


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        print(__doc__)
        raise SystemExit(2)
    root = os.path.expanduser(args[0])
    if not os.path.isdir(root):
        die(f"[A2b] 内容目录不存在: {root}")

    schema_path = DEFAULT_SCHEMA
    if "--schema" in sys.argv:
        schema_path = sys.argv[sys.argv.index("--schema") + 1]

    declared = schema_keys(schema_path)
    normalized = normalized_keys(DEFAULT_NORMALIZER)
    allowed = declared | normalized

    unknown = {}      # key -> [file, ...]
    scanned = 0
    for name in sorted(os.listdir(root)):
        if not name.endswith((".md", ".mdx")):
            continue
        p = os.path.join(root, name)
        if not os.path.isfile(p):
            continue
        fm, _body = parse_frontmatter(read(p))
        if not fm:
            continue  # 无 frontmatter 的素材/空文件不算文章
        scanned += 1
        for k in fm:
            if k not in allowed:
                unknown.setdefault(k, []).append(name)

    print(f"内容目录: {root}")
    print(f"schema 声明: {len(declared)} 键 | 归一化消费: {len(normalized)} 键 → 允许 {len(allowed)} 键")
    print(f"扫描文章: {scanned}")

    if not unknown:
        print("\n✅ 全部 frontmatter 键均被 schema 或归一化脚本认识")
        return 0

    print(f"\n❌ 发现 {len(unknown)} 个未知键（构建会在 astro build 阶段炸掉）:\n")
    for k in sorted(unknown, key=lambda x: -len(unknown[x])):
        files = unknown[k]
        sample = ", ".join(files[:3]) + (" …" if len(files) > 3 else "")
        print(f"  {k:<16} {len(files):>3} 篇   {sample}")

    print(
        "\n修法（二选一，别用 .passthrough() 蒙过去）:\n"
        "  A. 这个键有语义 → 加进 src/content.config.ts 的 article schema，按加法写成 .optional()\n"
        "  B. 这个键是 v1 遗留、v2 不再需要 → 加进 scripts/normalize-frontmatter.mjs 的消费列表\n"
        "\n判据：v2 有对应概念就选 A（内容先带上字段、主题后跟上）；v2 没有这个概念才选 B。\n"
        "两边都不动 = 每天定时部署继续红。"
    )
    return 1


if __name__ == "__main__":
    sys.exit(main())
