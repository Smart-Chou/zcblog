import { test, expect } from "@playwright/test";

// 注：搜索 UI 已迁移到 Pagefind Component UI（pagefind-modal-* Web Components）。
// 2026-10 审计更新选择器：旧版 button[data-open-modal] / dialog / .pagefind-ui__result 均已失效。

test("搜索按钮存在于页面", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("pagefind-modal-trigger")).toBeVisible();
});

test("点击按钮打开搜索弹窗", async ({ page }) => {
    await page.goto("/");
    const dialog = page.locator("pagefind-modal dialog");
    await expect(dialog).toBeHidden();
    await page.locator("pagefind-modal-trigger").click();
    await expect(dialog).toBeVisible();
});

test("Escape 关闭搜索弹窗", async ({ page }) => {
    await page.goto("/");
    await page.locator("pagefind-modal-trigger").click();
    const dialog = page.locator("pagefind-modal dialog");
    await expect(dialog).toBeVisible();
    // 先点输入框让它聚焦，再按 Escape
    await page.locator("pagefind-modal input").first().click();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
});

test("搜索弹窗中有输入框", async ({ page }) => {
    await page.goto("/");
    await page.locator("pagefind-modal-trigger").click();
    const input = page.locator("pagefind-modal input").first();
    await expect(input).toBeVisible({ timeout: 10000 });
});

test("输入搜索词后有结果", async ({ page }) => {
    await page.goto("/");
    await page.locator("pagefind-modal-trigger").click();
    const input = page.locator("pagefind-modal input").first();
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.fill("bitwarden");
    const results = page.locator(".custom-result-item");
    await expect(results.first()).toBeVisible({ timeout: 15000 });
});
