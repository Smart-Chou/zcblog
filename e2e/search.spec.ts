import { test, expect } from "@playwright/test";

test("搜索按钮存在于页面", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("button[data-open-modal]")).toBeVisible();
});

test("点击按钮打开搜索弹窗", async ({ page }) => {
    await page.goto("/");
    const dialog = page.locator("dialog");
    await expect(dialog).not.toBeVisible();
    await page.locator("button[data-open-modal]").click();
    await expect(dialog).toBeVisible();
});

test("Escape 关闭搜索弹窗", async ({ page }) => {
    await page.goto("/");
    await page.locator("button[data-open-modal]").click();
    const dialog = page.locator("dialog");
    await expect(dialog).toBeVisible();
    // 先点输入框让它聚焦，再按 Escape
    await page.locator("dialog input").first().click();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
});

test("搜索弹窗中有输入框", async ({ page }) => {
    await page.goto("/");
    await page.locator("button[data-open-modal]").click();
    const input = page.locator("dialog input").first();
    await expect(input).toBeVisible({ timeout: 10000 });
});

test("输入搜索词后有结果", async ({ page }) => {
    await page.goto("/");
    await page.locator("button[data-open-modal]").click();
    const input = page.locator("dialog input").first();
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill("bitwarden");
    const results = page.locator(".pagefind-ui__result");
    await expect(results.first()).toBeVisible({ timeout: 15000 });
});
