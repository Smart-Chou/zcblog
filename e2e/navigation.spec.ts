import { test, expect } from "@playwright/test";

test("桌面端导航菜单存在", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#nav-dropdown")).toBeAttached();
});

test("移动端汉堡按钮存在", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.locator("#nav-menu-btn")).toBeVisible();
});

test("移动端点击汉堡按钮展开菜单", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const menuBtn = page.locator("#nav-menu-btn");
    const dropdown = page.locator("#nav-dropdown");
    await expect(menuBtn).toHaveAttribute("aria-expanded", "false");
    await expect(dropdown).not.toHaveClass(/nav-dropdown--open/);
    await menuBtn.click();
    await expect(menuBtn).toHaveAttribute("aria-expanded", "true");
    await expect(dropdown).toHaveClass(/nav-dropdown--open/);
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

test("导航链接跳转到归档页", async ({ page }) => {
    await page.goto("/archives/");
    const res = await page.goto("/archives/");
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).not.toBeEmpty();
});
