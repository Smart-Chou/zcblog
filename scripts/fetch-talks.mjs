import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLINKO_API = "https://memos.marxchou.com/api/v1/note/list";
const BLINKO_BASE = "https://memos.marxchou.com";
const TOKEN = process.env.BLINKO_API_TOKEN;
const OUTPUT = resolve(__dirname, "../src/data/talks.json");

function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

function relativeTime(iso) {
  const now = new Date();
  const diff = now - new Date(iso);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 30) return `${days} 天前`;
  if (months < 12) return `${months} 个月前`;
  return `${years} 年前`;
}

async function main() {
  if (!TOKEN) {
    console.error("❌ 未设置 BLINKO_API_TOKEN 环境变量");
    process.exit(1);
  }

  let data;
  try {
    const res = await fetch(BLINKO_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        isShare: true,
        isRecycle: false,
        isArchived: false,
        orderBy: "desc",
        size: 50,
        page: 1,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.warn(`⚠ 无法获取 Blinko API: ${err.message}，保留旧数据`);
    process.exit(0);
  }

  const notes = Array.isArray(data) ? data : [];

  const publicNotes = notes.filter(
    (n) => n.isShare && !n.sharePassword && (!n.shareExpiryDate || new Date(n.shareExpiryDate) > new Date())
  );

  if (publicNotes.length === 0) {
    console.warn("⚠ 无有效公开笔记，保留旧数据");
    process.exit(0);
  }

  const items = publicNotes.map((n) => {
    const iso = n.updatedAt || n.createdAt;
    const link = `${BLINKO_BASE}/share/${n.shareEncryptedUrl || n.id}`;

    const images = (n.attachments || [])
      .filter((a) => a.mimeType?.startsWith("image/") || a.url || a.path)
      .map((a) => {
        const raw = a.url || a.path || "";
        if (raw.startsWith("http://") || raw.startsWith("https://")) {
          return raw.replace(/^http:/, "https:");
        }
        return BLINKO_BASE + (raw.startsWith("/") ? "" : "/") + raw;
      });

    return {
      datetime: formatDate(iso),
      display: relativeTime(iso),
      url: link,
      content: n.content,
      ...(images.length > 0 && { images }),
    };
  });

  items.sort((a, b) => (b.datetime > a.datetime ? 1 : -1));

  const dir = dirname(OUTPUT);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(OUTPUT, JSON.stringify(items, null, 2) + "\n", "utf-8");
  console.log(`✅ talks.json 已更新 (${items.length} 条)`);
}

main();
