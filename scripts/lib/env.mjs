/**
 * 加载 .env 文件（不存在时静默跳过）。
 * 供所有 fetch 脚本共用。
 */
export function loadEnvFile() {
    try {
        process.loadEnvFile();
    } catch {
        /* .env 不存在时忽略（如 CI 环境） */
    }
}
