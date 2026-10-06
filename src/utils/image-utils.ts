import { imageService } from "~/config";

/** 未配置图床时的本地占位图（主题使用者可自行替换 public/cover.png） */
export const PLACEHOLDER_IMAGE = "/cover.png";

/** 是否配置了外部图床服务 */
export const hasImageService = Boolean(imageService.baseUrl);

function generateRandomString(length: number = 10): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/** 随机配图 URL（未配置图床时回退到本地占位图） */
export function getRandomImageUrl(): string {
    if (!hasImageService) return PLACEHOLDER_IMAGE;
    return `${imageService.baseUrl}${imageService.randomPath}?${generateRandomString()}`;
}

/** 图床指定图片 URL（未配置图床或已是完整 URL 时原样使用） */
export function getPicImageUrl(path: string): string {
    if (!path) return PLACEHOLDER_IMAGE;
    if (!hasImageService || /^https?:\/\//.test(path)) return path;
    return `${imageService.baseUrl}${imageService.picPath}${path}`;
}
