/**
 * 本地开发服务器：用 Node http 包装 Worker 的 fetch 处理器，KV 落盘到 dev-kv.json。
 * 不需要 Cloudflare 账号，也不会上线任何东西。
 *
 *   node workers/paid-gateway/dev-server.mjs
 *   # → http://127.0.0.1:8788/api/pay/health
 *
 * Astro dev 直接跨端口访问这里（CSP/CORS 已放行 8788）；生产环境走同源 /api/pay。
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import app from "./src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const kvFile = path.join(__dirname, "dev-kv.json");
const port = Number(process.env.PAID_DEV_PORT || 8788);

// 读取仓库根目录 .env（Node 20.12+ 自带 process.loadEnvFile）
try {
    process.loadEnvFile(path.join(repoRoot, ".env"));
} catch {
    /* 没有 .env 时忽略 */
}

if (!process.env.PAID_MASTER_KEY) {
    console.error("缺少 PAID_MASTER_KEY（放在仓库根目录 .env）");
    process.exit(1);
}

class FileKV {
    constructor(file) {
        this.file = file;
        this.map = new Map();
        if (fs.existsSync(file)) {
            try {
                const raw = JSON.parse(fs.readFileSync(file, "utf8"));
                for (const [k, v] of Object.entries(raw)) this.map.set(k, v);
            } catch {
                console.warn("dev-kv.json 解析失败，忽略");
            }
        }
    }
    async get(key) {
        return this.map.has(key) ? this.map.get(key) : null;
    }
    async put(key, value) {
        this.map.set(key, value);
        this.save();
    }
    async delete(key) {
        this.map.delete(key);
        this.save();
    }
    save() {
        fs.writeFileSync(this.file, JSON.stringify(Object.fromEntries(this.map), null, 2) + "\n");
    }
}

const env = {
    PAID_KV: new FileKV(kvFile),
    PAID_MASTER_KEY: process.env.PAID_MASTER_KEY,
    // 本地不校验 Origin（Vite 代理会带 localhost Origin）
};

const server = http.createServer(async (req, res) => {
    try {
        // 本地跨端口联调（Astro dev 在 4321，Worker 在 8788；8787 被工作台占用）
        const allowedOrigins = new Set(["http://127.0.0.1:4321", "http://localhost:4321"]);
        const origin = req.headers.origin;
        if (origin && allowedOrigins.has(origin)) {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");
            res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
            res.setHeader("Vary", "Origin");
        }
        if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return;
        }

        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const body = chunks.length ? Buffer.concat(chunks) : undefined;

        const request = new Request(`http://127.0.0.1:${port}${req.url}`, {
            method: req.method,
            headers: new Headers(req.headers),
            body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
        });

        const response = await app.fetch(request, env);
        const headers = Object.fromEntries(response.headers);
        const cookies = response.headers.getSetCookie?.() || [];
        if (cookies.length) headers["set-cookie"] = cookies;

        res.writeHead(response.status, headers);
        res.end(Buffer.from(await response.arrayBuffer()));
    } catch (err) {
        console.error("[dev-server]", err);
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(String(err?.stack || err));
    }
});

server.listen(port, "127.0.0.1", () => {
    console.log(`paid-gateway dev server → http://127.0.0.1:${port}/api/pay/health`);
    console.log(`KV 文件：${path.relative(repoRoot, kvFile)}`);
});
