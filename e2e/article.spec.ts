import { test, expect } from "@playwright/test";

test("文章页有内容标题", async ({ page }) => {
    await page.goto("/article/bitwarden/");
    await expect(page.locator(".post-title-text")).toBeVisible();
});

test("返回顶部按钮滚动后出现", async ({ page }) => {
    await page.goto("/article/bitwarden/");
    const backToTop = page.locator("#back-to-top");
    await expect(backToTop).not.toHaveClass(/active/);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await expect(backToTop).toHaveClass(/active/);
});

test("点击返回顶部按钮后页面向上滚动", async ({ page }) => {
    await page.goto("/article/bitwarden/");
    // 滚动到底部
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const scrollBefore = await page.evaluate(() => window.scrollY);
    expect(scrollBefore).toBeGreaterThan(300);
    // 点击回到顶部
    await page.locator("#back-to-top.active").click();
    // 等 Lenis 平滑滚动完成
    await page.waitForTimeout(3000);
    const scrollAfter = await page.evaluate(() => window.scrollY);
    // 确保向上滚动了
    expect(scrollAfter).toBeLessThan(scrollBefore);
});

test("Waline 评论切换按钮", async ({ page }) => {
    await page.goto("/article/bitwarden/");
    const toggleBtn = page.locator("#waline-toggle");
    if ((await toggleBtn.count()) === 0) {
        test.skip();
    }
    await expect(toggleBtn).toBeVisible();
});

test("文章页标签存在", async ({ page }) => {
    await page.goto("/article/bitwarden/");
    const tags = page.locator(".post-tags-link");
    const count = await tags.count();
    expect(count).toBeGreaterThan(0);
});
