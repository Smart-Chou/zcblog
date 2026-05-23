import { imageService } from "~/config";

const DEFAULT_IMAGE_URL = `${imageService.baseUrl}${imageService.randomPath}`;

function generateRandomString(length: number = 10): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function getRandomImageUrl(): string {
    return `${DEFAULT_IMAGE_URL}?${generateRandomString()}`;
}
