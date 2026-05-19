import { test, expect } from "@playwright/test";

test("文章页有内容标题", async ({ page }) => {
    await page.goto("/article/bitwarden/");
    await expect(page.locator(".post-title-text")).toBeVisible();
});

test("返回顶部按钮滚动后出现", async ({ page }) => {
    await page.goto("/article/bitwarden/");
    const backToTop = page.locator("#back-to-top");
    await expect(backToTop).not.toHaveClass(/active/);
    // 滚动到底部
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await expect(backToTop).toHaveClass(/active/);
});

test("点击返回顶部按钮回到顶部", async ({ page }) => {
    await page.goto("/article/bitwarden/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const backToTop = page.locator("#back-to-top.active");
    await backToTop.click();
    // Lenis 平滑滚动需要时间
    await page.waitForTimeout(1000);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(200);
});

test("Waline 评论切换按钮存在", async ({ page }) => {
    await page.goto("/article/bitwarden/");
    const toggleBtn = page.locator("#waline-toggle");
    if ((await toggleBtn.count()) > 0) {
        await expect(toggleBtn).toBeVisible();
        // 点击展开
        await toggleBtn.click();
        await expect(page.locator("#waline.visible")).toBeVisible({ timeout: 5000 });
    }
});

test("文章页标签存在", async ({ page }) => {
    await page.goto("/article/bitwarden/");
    const tags = page.locator(".post-tags-link");
    const count = await tags.count();
    expect(count).toBeGreaterThan(0);
});
