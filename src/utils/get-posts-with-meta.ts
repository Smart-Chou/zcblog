// 定义文章类型接口，匹配Astro内容集合的结构
interface Post {
    id: string;
    slug?: string;
    collection: string;
    data: Record<string, any>;
    body?: string;
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
import { readMetadata, findSecondDash, generateSummary, calculateStats } from "./post-meta";
import { getGitCommitDate } from "./git-date";

// 缓存对象，用于存储已处理的文章元数据
const postMetaCache = new Map<string, PostMeta>();

/**
 * 获取文章元数据
 * @param post 文章对象
 * @returns 文章元数据
 */
export function getPostsWithMeta(post: Post): PostMeta {
    const postId = post.slug || post.id;
    const frontmatterDescription = post.data?.description || "";

    // 检查缓存
    if (postMetaCache.has(postId)) {
        return postMetaCache.get(postId)!;
    }

    // 构建文件路径，确保文件路径有效
    if (!postId) {
        console.error("Invalid post ID");
        return {
            wordCount: 0,
            readTime: "N/A",
            modifiedTime: post.data?.upDate || new Date(),
            excerpt: frontmatterDescription || "N/A",
        };
    }

    // 优先使用 post.body（如果可用），避免文件系统读取
    let content: string | null = null;

    if (post.body) {
        content = post.body;
    } else {
        // 回退到文件系统读取
        const fileData = readMetadata(postId);
        content = fileData.content;
    }

    // 确定 modifiedTime，优先级：frontmatter upDate > git 提交时间 > 文件系统 mtime > 当前时间
    const frontmatterUpDate = post.data?.upDate as Date | null | undefined;
    const filePath = `src/content/article/${postId}.md`;
    const gitDate = getGitCommitDate(filePath);
    const fallbackMtime = gitDate ?? new Date();
    const mtime: Date | string = frontmatterUpDate ?? gitDate ?? fallbackMtime;

    if (!content) {
        console.error(`Error accessing content for post: ${post.id}`);
        return {
            wordCount: 0,
            readTime: "N/A",
            modifiedTime: mtime || post.data?.upDate || new Date(),
            excerpt: frontmatterDescription || "N/A",
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
    // 如果摘要为空或为N/A，使用frontmatter中的description
    const finalExcerpt = excerpt && excerpt !== "N/A" ? excerpt : frontmatterDescription || "N/A";

    // 构建结果对象
    const result: PostMeta = {
        wordCount,
        readTime,
        modifiedTime: mtime,
        excerpt: finalExcerpt,
    };

    // 存储到缓存
    postMetaCache.set(postId, result);

    return result;
}

/** Convenience wrapper: auto-fills slug from id and merges meta into the post object. */
export function enrichPost<T extends Post>(post: T): T & PostMeta & { slug: string } {
    const meta = getPostsWithMeta({ ...post, slug: post.id || post.slug });
    return { ...post, ...meta, slug: (post.id || post.slug)! };
}
