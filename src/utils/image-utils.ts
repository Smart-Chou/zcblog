import { imageService, site } from "~/config";

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

/**
 * 构建 Cloudflare Image Transformations 地址（纯函数，便于测试）。
 * 需站点域名所在 zone 已开启 Image Transformations；仅处理 http(s) 绝对地址，
 * 已带 /cdn-cgi/image/ 的地址原样返回，避免重复嵌套。
 */
export function buildTransformUrl(
    url: string,
    width: number,
    baseUrl: string,
    quality?: number,
): string {
    if (!url || !width || !/^https?:\/\//.test(url)) return url;
    if (url.includes("/cdn-cgi/image/")) return url;
    const base = baseUrl.replace(/\/+$/, "");
    const options = [`width=${width}`, "fit=scale-down", "format=auto"];
    if (quality) options.push(`quality=${quality}`);
    return `${base}/cdn-cgi/image/${options.join(",")}/${url}`;
}

/**
 * 图片展示地址：图床开启边缘缩略图（imageService.transform）时按宽度套用
 * /cdn-cgi/image/；未启用或不适用（相对路径/占位图）时原样返回。
 */
export function getDisplayImageUrl(url: string, width: number): string {
    if (!imageService.transform?.enable) return url;
    return buildTransformUrl(url, width, site.url, imageService.transform.quality);
}

/** 随机配图 URL（未配置图床时回退到本地占位图；可选宽度用于边缘缩略图） */
export function getRandomImageUrl(width?: number): string {
    if (!hasImageService) return PLACEHOLDER_IMAGE;
    const url = `${imageService.baseUrl}${imageService.randomPath}?${generateRandomString()}`;
    return width ? getDisplayImageUrl(url, width) : url;
}

/** 图床指定图片 URL（未配置图床或已是完整 URL 时原样使用；可选宽度用于边缘缩略图） */
export function getPicImageUrl(path: string, width?: number): string {
    if (!path) return PLACEHOLDER_IMAGE;
    const url =
        !hasImageService || /^https?:\/\//.test(path)
            ? path
            : `${imageService.baseUrl}${imageService.picPath}${path}`;
    return width ? getDisplayImageUrl(url, width) : url;
}
