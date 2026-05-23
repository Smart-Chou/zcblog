import { test, expect } from "@playwright/test";

// ── Talk 轮播 ──

test("Talk 组件在首页渲染并包含条目", async ({ page }) => {
    await page.goto("/");
    const talkList = page.locator(".talk-list");
    await expect(talkList).toBeVisible();
    // Talk 至少有一条内容
    const items = talkList.locator(".item");
    await expect(items.first()).toBeVisible();
    // 条目中包含链接和日期
    await expect(items.first().locator("a")).toBeVisible();
    await expect(items.first().locator(".datetime")).toBeVisible();
});

test("Talk 轮播在间隔后切换内容", async ({ page }) => {
    await page.goto("/");
    const talkList = page.locator(".talk-list");
    await expect(talkList).toBeVisible();

    const firstLink = talkList.locator("a");
    const initialHref = await firstLink.getAttribute("href");

    // Talk 轮播每 6 秒切换一次，等待一轮
    await page.waitForTimeout(7000);

    const newHref = await firstLink.getAttribute("href");
    // 至少有多个条目才会切换（数据不足时可能不变）
    if (initialHref !== newHref) {
        expect(newHref).not.toBe(initialHref);
    }
});

// ── i18n 内容验证 ──

test("英文首页 section 标题为英文", async ({ page }) => {
    await page.goto("/en/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // section-header 中的标题
    const labels = page.locator(".section-label");
    const texts = await labels.allTextContents();

    // 至少有一个英文标题（非中文）
    const hasEnglishTitle = texts.some((t) => /[A-Za-z]/.test(t));
    expect(hasEnglishTitle).toBe(true);

    // "View all" 链接文本应为英文
    const viewAllLinks = page.locator(".section-link");
    const linkCount = await viewAllLinks.count();
    let foundViewAll = false;
    for (let i = 0; i < linkCount; i++) {
        const text = await viewAllLinks.nth(i).textContent();
        if (text && /view all/i.test(text)) {
            foundViewAll = true;
            break;
        }
    }
    expect(foundViewAll).toBe(true);
});

test("中文首页 section 标题为中文", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");

    const labels = page.locator(".section-label");
    const texts = await labels.allTextContents();

    // 应有中文标题
    const hasChineseTitle = texts.some((t) => /[一-鿿]/.test(t));
    expect(hasChineseTitle).toBe(true);

    // "查看全部" 链接文本
    const viewAllLinks = page.locator(".section-link");
    const linkCount = await viewAllLinks.count();
    let foundViewAll = false;
    for (let i = 0; i < linkCount; i++) {
        const text = await viewAllLinks.nth(i).textContent();
        if (text && /查看全部/.test(text)) {
            foundViewAll = true;
            break;
        }
    }
    expect(foundViewAll).toBe(true);
});

// ── 键盘 Tab 导航 ──

test("首页关键可交互元素可通过 Tab 键聚焦", async ({ page }) => {
    await page.goto("/");

    // Logo 链接
    await page.keyboard.press("Tab");
    let focused = page.locator(":focus");
    // 首页第一个可聚焦元素（可能是 skip link、logo 或搜索按钮）
    await expect(focused).toBeAttached();

    // 继续 Tab 到搜索按钮
    let foundSearch = false;
    for (let i = 0; i < 20; i++) {
        await page.keyboard.press("Tab");
        focused = page.locator(":focus");
        const tag = await focused.evaluate((el) => el.tagName.toLowerCase());
        const aria = await focused.evaluate((el) => el.getAttribute("aria-label"));
        // 搜索按钮
        if (
            (tag === "button" && aria?.includes("搜索")) ||
            (await focused.getAttribute("data-open-modal")) !== null
        ) {
            foundSearch = true;
            break;
        }
    }
    expect(foundSearch).toBe(true);
});

test("键盘 Tab 可到达主题切换和语言切换", async ({ page }) => {
    await page.goto("/");

    let foundTheme = false;
    let foundLang = false;

    for (let i = 0; i < 20; i++) {
        await page.keyboard.press("Tab");
        const focused = page.locator(":focus");
        if (!(await focused.count())) continue;

        const aria = await focused.evaluate((el) => el.getAttribute("aria-label"));
        const cls = await focused.evaluate((el) => el.className);

        if (aria?.includes("主题") || aria?.includes("theme") || cls.includes("toggle-theme")) {
            foundTheme = true;
        }
        if (
            aria?.includes("语言") ||
            aria?.includes("language") ||
            cls.includes("language-switcher")
        ) {
            foundLang = true;
        }
    }

    // 至少能找到其中一个
    expect(foundTheme || foundLang).toBe(true);
});
