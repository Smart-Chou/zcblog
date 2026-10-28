# zcblog-paid — 付费阅读网关（本地版）

Cloudflare Worker：校验爱发电激活码 → 建立 90 天会话 → 按需下发文章密钥。
静态页只放密文；密钥由 `PAID_MASTER_KEY + slug` 用 HMAC 派生，不落库、不进 HTML。

## 本地跑

```bash
# 1. 生成主密钥（只需一次，写入仓库根目录 .env）
node -e "console.log('PAID_MASTER_KEY='+require('crypto').randomBytes(32).toString('base64url'))"

# 2. 生成测试码并导入本地 KV
pnpm paid:codes --count 3 --slugs paid-demo-local --max 2 --batch devtest
pnpm paid:import --file paid-keys/devtest.csv

# 3. 起两个进程（两个终端）
pnpm paid:dev          # Worker dev server :8788
pnpm dev               # Astro dev :4321

# 4. 打开
open http://localhost:4321/article/paid-demo-local/
# 激活码在 paid-keys/devtest.paste.txt
```

`pnpm paid:test` 跑 Worker 单测（不需要 Cloudflare 账号）。

## 部署（本地执行，不走 GitHub Actions）

```bash
cd workers/paid-gateway
npx wrangler login
npx wrangler kv namespace create PAID_KV     # 把返回的 id 填进 wrangler.toml
npx wrangler secret put PAID_MASTER_KEY      # 与 .env 里的值一致
npx wrangler deploy
```

部署后 `/api/pay/*` 由 Worker 接管，其余请求继续回源 GitHub Pages。站点本身需要另外
构建并发布（付费文依赖 `PAID_MASTER_KEY`，CI/本地构建都要有）。

## 上线前检查

- `curl -i https://marxchou.com/api/pay/health` → 200
- 无 Cookie 请求 `/api/pay/key?slug=...` → 401
- `cf-cache-status` 为 DYNAMIC（`Cache-Control: no-store`）
- 若开了 Bot Fight Mode / Managed Challenge，给 `/api/pay/*` 加 WAF Skip
- 爱发电商品描述写清：付款后到私信查收激活码；一码最多 3 台设备

## 运营命令

```bash
pnpm paid:admin list
pnpm paid:admin revoke --hash <64位hash>
pnpm paid:admin export --out paid-keys/export.json
```

吊销后，已有会话下一次取密钥即失效（403）。

## 边界

- 码被转发无法根除；限设备 + 可吊销是提高成本，不是 DRM。
- 付费文里的图片仍会输出到 `dist/_astro/`（URL 不可枚举，但拿到就能访问）；敏感图不要放。
- 付费正文不进 RSS / Pagefind / 列表摘要（已处理）。
- PWA 的 `/api/` 规则是 `NetworkOnly`，密钥不会被 Service Worker 缓存。
