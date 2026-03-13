// 导入dayjs库进行日期格式化
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import { config } from "../self.config";

dayjs.locale(config.lang);
dayjs.extend(advancedFormat);
dayjs.extend(utc);

// 定义文章类型接口
interface Post {
    data: {
        tags?: string[];
        [key: string]: any;
    };
    [key: string]: any;
}

// 定义标签云项接口
interface TagCloudItem {
    tag: string;
    count: number;
}

// 缓存对象
const cache = new Map<string, any>();

/**
 * 格式化日期
 * @param dateStr 日期字符串或Date对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateStr: string | Date): string {
    // 参数校验和容错处理
    if (!dateStr) {
        return "";
    }

    try {
        const dateFormat = "YYYY-MM-DD";
        return dayjs(dateStr).utc().format(dateFormat);
    } catch (error) {
        console.error("日期格式化错误:", error);
        return "";
    }
}

/**
 * 生成标签云
 * @param posts 文章数组
 * @returns 标签云数组
 */
export function generateTagCloud(posts: Post[]): TagCloudItem[] {
    // 参数校验和容错处理
    if (!Array.isArray(posts)) {
        return [];
    }

    // 生成缓存键
    const cacheKey = `tagcloud_${JSON.stringify(posts.map((p) => p.id || p.slug))}`;

    // 检查缓存
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    const tagMap: Record<string, number> = {};

    // 优化性能：使用forEach代替嵌套循环，添加提前终止逻辑
    posts.forEach((post) => {
        // 检查文章是否有标签
        if (!post?.data?.tags || !Array.isArray(post.data.tags)) {
            return;
        }

        post.data.tags.forEach((tag) => {
            // 检查标签是否有效
            if (typeof tag !== "string" || !tag.trim()) {
                return;
            }

            tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
    });

    // 转换为标签云数组
    const result = Object.entries(tagMap).map(([tag, count]) => ({
        tag,
        count,
    }));

    // 存储到缓存
    cache.set(cacheKey, result);

    return result;
}

const DEFAULT_IMAGE_SERVICE_URL = "https://pic.mcc.im/images";

/**
 * 生成指定长度的随机字符串
 * @param length 字符串长度，默认为10
 * @returns 随机字符串
 */
export function generateRandomString(length: number = 10): string {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * 获取带有随机参数的图片URL
 * 用于避免浏览器缓存，确保每次请求获取不同的图片
 * @returns 带有随机参数的图片URL
 */
export function getRandomImageUrl(): string {
    return `${DEFAULT_IMAGE_SERVICE_URL}?${generateRandomString()}`;
}

// 导出 PhotoSwipe 工具函数
export * from "./photoswipe";
