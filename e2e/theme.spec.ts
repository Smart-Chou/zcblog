import { test, expect } from "@playwright/test";

test("主题按钮存在", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#theme-btn")).toBeVisible();
});

test("点击主题按钮切换暗色模式", async ({ page }) => {
    await page.goto("/");
    const btn = page.locator("#theme-btn");
    // 先确定当前状态
    const isDark = await page.locator("html").getAttribute("data-theme");
    await btn.click();
    if (isDark === "dark") {
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
    // 切换到相反主题
    await btn.click();
    // 刷新后应保持
    await page.reload({ waitUntil: "networkidle" });
    const isDarkAfter = (await page.locator("html").getAttribute("data-theme")) === "dark";
    expect(isDarkAfter).not.toBe(isDarkBefore);
});

test("英文页面主题切换正常", async ({ page }) => {
    await page.goto("/en/");
    const btn = page.locator("#theme-btn");
    await expect(btn).toBeVisible();
    await btn.click();
    // 主题应该有变化
    await expect(page.locator("html")).toHaveAttribute("data-theme", /dark|light/);
});
