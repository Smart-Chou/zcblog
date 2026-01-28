// 定义文章类型接口，匹配Astro内容集合的结构
interface Post {
    id: string;
    slug: string;
    collection: string;
    data: Record<string, any>;
    body: string;
    [key: string]: any;
}

// 定义返回结果接口
interface PostMeta {
    wordCount: number;
    readTime: string;
    modifiedTime: Date | string;
    excerpt: string;
}

// 导入模块化工具函数
import {
    readMetadata,
    findSecondDash,
    generateSummary,
    calculateStats,
} from "./post-meta";

// 缓存对象，用于存储已处理的文章元数据
const postMetaCache = new Map<string, PostMeta>();

/**
 * 获取文章元数据
 * @param post 文章对象
 * @returns 文章元数据
 */
export function getPostsWithMeta(post: Post): PostMeta {
    // 检查缓存
    if (postMetaCache.has(post.id)) {
        return postMetaCache.get(post.id)!;
    }

    // 构建文件路径，确保文件路径有效
    if (!post.id) {
        console.error("Invalid post ID");
        return {
            wordCount: 0,
            readTime: "N/A",
            modifiedTime: "N/A",
            excerpt: "N/A",
        };
    }

    // 读取文件元数据
    const { content, mtime } = readMetadata(post.id);

    if (!content || !mtime) {
        console.error(`Error accessing file for post: ${post.id}`);
        return {
            wordCount: 0,
            readTime: "N/A",
            modifiedTime: "N/A",
            excerpt: "N/A",
        };
    }

    // 计算阅读时间和字数
    const { wordCount, readTime } = calculateStats(content);

    // 查找第二个 '---'
    const secondDashIndex = findSecondDash(content);
    let contentForExcerpt = content;
    if (secondDashIndex !== -1) {
        contentForExcerpt = content.substring(secondDashIndex + 3).trim();
    }

    // 生成摘要
    const excerpt = generateSummary(contentForExcerpt);

    // 构建结果对象
    const result: PostMeta = {
        wordCount,
        readTime,
        modifiedTime: mtime,
        excerpt,
    };

    // 存储到缓存
    postMetaCache.set(post.id, result);

    return result;
}
