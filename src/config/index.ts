// 统一导出所有配置，保持向后兼容

// 导入各个配置文件
import * as siteConfig from "./site.config";
import * as featureConfig from "./feature.config";
import * as uiConfig from "./ui.config";

// 重新导出所有配置
export * from "./site.config";
export * from "./feature.config";
export * from "./ui.config";

// 保持与原self.config.ts相同的导出结构
export const { site, author, notFoundPage, tagsPage, archivesPage, redirectPage, imageService } =
    siteConfig;

export const { config, pageView, postView, donate, waline, search, umami, notice, watermark } =
    featureConfig;

export const { categories, socialLinks, friendsPage, footerList } = uiConfig;
