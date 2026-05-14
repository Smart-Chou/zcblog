/**
 * Eagerly imports all local images in src/assets/images/
 * for use with Astro's <Image /> component.
 */
import type { ImageMetadata } from "astro";

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
    "/src/assets/images/*.{jpg,jpeg,webp,png,gif}",
    { eager: true },
);

// 同时扫描 src/assets/ 根目录的图片（如 author.jpg）
const rootImageModules = import.meta.glob<{ default: ImageMetadata }>(
    "/src/assets/*.{jpg,jpeg,webp,png,gif}",
    { eager: true },
);

/** Maps filename → ImageMetadata (e.g. "34.jpg" → ImageMetadata) */
const imageMap = new Map<string, ImageMetadata>();

for (const [key, mod] of Object.entries(imageModules)) {
    const filename = key.split("/").pop();
    if (filename) {
        imageMap.set(filename, mod.default);
    }
}

for (const [key, mod] of Object.entries(rootImageModules)) {
    const filename = key.split("/").pop();
    if (filename) {
        imageMap.set(filename, mod.default);
    }
}

/**
 * Resolve a public image path (e.g. "/images/34.jpg") to ImageMetadata
 * for use with <Image src={...} />.
 */
export function getLocalImage(imagePath: string): ImageMetadata | undefined {
    const filename = imagePath.split("/").pop();
    if (!filename) return undefined;
    return imageMap.get(filename);
}
