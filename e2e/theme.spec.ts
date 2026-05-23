import { test, expect } from "@playwright/test";

test("主题按钮存在", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#theme-btn")).toBeVisible();
});

test("点击主题按钮切换暗色模式", async ({ page }) => {
    await page.goto("/");
    const btn = page.locator("#theme-btn");
    const isDark = (await page.locator("html").getAttribute("data-theme")) === "dark";
    await btn.click();
    if (isDark) {
        await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
    } else {
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    }
});

test("连续点击两次回到原始状态", async ({ page }) => {
    await page.goto("/");
    const isDarkBefore = (await page.locator("html").getAttribute("data-theme")) === "dark";
    const btn = page.locator("#theme-btn");
    await btn.click();
    await btn.click();
    const isDarkAfter = (await page.locator("html").getAttribute("data-theme")) === "dark";
    expect(isDarkAfter).toBe(isDarkBefore);
});

test("主题偏好持久化到 localStorage", async ({ page }) => {
    await page.goto("/");
    const btn = page.locator("#theme-btn");
    const isDarkBefore = (await page.locator("html").getAttribute("data-theme")) === "dark";
    await btn.click();
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    const isDarkAfter = (await page.locator("html").getAttribute("data-theme")) === "dark";
    expect(isDarkAfter).not.toBe(isDarkBefore);
});

test("英文页面主题切换正常", async ({ page }) => {
    await page.goto("/en/");
    const btn = page.locator("#theme-btn");
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", /dark|light/);
});
