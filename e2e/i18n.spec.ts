import { test, expect } from "@playwright/test";

test("中文首页使用默认语言", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
});

test("英文首页有 lang=en", async ({ page }) => {
    await page.goto("/en/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("语言切换器存在", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".language-switcher-button")).toBeVisible();
});

test("切换到英文后跳转到 /en/", async ({ page }) => {
    await page.goto("/");
    // hover 展开下拉
    await page.locator(".language-switcher").hover();
    const enLink = page.locator('.language-switcher-link[hreflang="en"]');
    await expect(enLink).toBeVisible();
    await enLink.click();
    await expect(page).toHaveURL(/\/en\//);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("英文页面切换到中文", async ({ page }) => {
    await page.goto("/en/");
    await page.locator(".language-switcher").hover();
    const zhLink = page.locator('.language-switcher-link[hreflang="zh"]');
    await expect(zhLink).toBeVisible();
    await zhLink.click();
    await expect(page).toHaveURL("http://localhost:4321/");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
});
