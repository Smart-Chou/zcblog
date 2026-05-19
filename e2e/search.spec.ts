import { test, expect } from "@playwright/test";

test("搜索按钮存在于页面", async ({ page }) => {
    await page.goto("/");
    const searchBtn = page.locator("button[data-open-modal]");
    await expect(searchBtn).toBeVisible();
});

test("Ctrl+K 打开搜索弹窗", async ({ page }) => {
    await page.goto("/");
    const dialog = page.locator("dialog");
    await expect(dialog).not.toBeVisible();
    await page.keyboard.press("Control+K");
    await expect(dialog).toBeVisible();
});

test("点击关闭按钮关闭搜索弹窗", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+K");
    const dialog = page.locator("dialog");
    await expect(dialog).toBeVisible();
    await page.locator("button[data-close-modal]").click();
    await expect(dialog).not.toBeVisible();
});

test("Escape 关闭搜索弹窗", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+K");
    const dialog = page.locator("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
});

test("搜索弹窗中有输入框", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+K");
    // Pagefind UI 渲染在 dialog 内
    const input = page.locator("dialog input");
    await expect(input.first()).toBeVisible({ timeout: 10000 });
});

test("输入搜索词后有结果", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+K");
    // Pagefind 搜索框
    const input = page.locator("dialog input").first();
    await input.fill("bitwarden");
    // 等待搜索结果出现
    const results = page.locator(".pagefind-ui__result");
    await expect(results.first()).toBeVisible({ timeout: 15000 });
});
