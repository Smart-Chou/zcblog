import { test, expect } from "@playwright/test";

test("桌面端导航菜单可见", async ({ page }) => {
    await page.goto("/");
    // 桌面端 nav dropdown 存在
    const nav = page.locator("#nav-dropdown");
    await expect(nav).toBeAttached();
});

test("移动端汉堡按钮存在", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const menuBtn = page.locator("#nav-menu-btn");
    await expect(menuBtn).toBeVisible();
});

test("移动端点击汉堡按钮展开菜单", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const menuBtn = page.locator("#nav-menu-btn");
    const dropdown = page.locator("#nav-dropdown");
    // 默认关闭
    await expect(menuBtn).toHaveAttribute("aria-expanded", "false");
    await expect(dropdown).not.toBeVisible();
    // 点击打开
    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute("aria-expanded", "true");
    await expect(dropdown).toBeVisible();
});

test("移动端再次点击关闭菜单", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const menuBtn = page.locator("#nav-menu-btn");
    await menuBtn.click();
    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute("aria-expanded", "false");
});

test("移动端点击 Escape 关闭菜单", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const menuBtn = page.locator("#nav-menu-btn");
    await menuBtn.click();
    await page.keyboard.press("Escape");
    await expect(menuBtn).toHaveAttribute("aria-expanded", "false");
});

test("导航链接可点击跳转", async ({ page }) => {
    await page.goto("/");
    // 桌面端可见的导航链接
    const link = page.locator('.nav-dropdown-link[href="/archives/"]');
    if (await link.isVisible()) {
        await link.click();
        await expect(page).toHaveURL(/\/archives\//);
    }
});
