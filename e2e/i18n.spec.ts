import { test, expect } from "@playwright/test";

test("中文首页使用默认语言", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh");
});

test("英文首页有 lang=en", async ({ page }) => {
    await page.goto("/en/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("语言切换器存在", async ({ page }) => {
    await page.goto("/");
    const switcher = page.locator(".language-switcher-button");
    await expect(switcher).toBeVisible();
});

test("切换到英文后跳转到 /en/", async ({ page }) => {
    await page.goto("/");
    // 直接用 force click 绕过 CSS hover 限制
    const enLink = page.locator('.language-switcher-link[hreflang="en"]');
    await enLink.click({ force: true });
    await expect(page).toHaveURL(/\/en\//);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("英文页面切换到中文", async ({ page }) => {
    await page.goto("/en/");
    const zhLink = page.locator('.language-switcher-link[hreflang="zh"]');
    await zhLink.click({ force: true });
    await expect(page).not.toHaveURL(/\/en\//);
    await expect(page.locator("html")).toHaveAttribute("lang", "zh");
});
