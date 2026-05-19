import { test, expect } from "@playwright/test";

const PAGES = [
    { name: "首页", path: "/" },
    { name: "博客列表", path: "/blog/1/" },
    { name: "归档", path: "/archives/" },
    { name: "标签", path: "/tags/" },
    { name: "友链", path: "/friends/" },
    { name: "随笔", path: "/talks/" },
    { name: "相册", path: "/albums/" },
    { name: "番剧", path: "/bangumi/" },
    { name: "豆瓣", path: "/douban/" },
    { name: "打赏", path: "/donate/" },
    { name: "文章详情", path: "/article/bitwarden/" },
];

for (const { name, path } of PAGES) {
    test(`${name} (${path}) 正常渲染`, async ({ page }) => {
        const res = await page.goto(path);
        expect(res?.status()).toBe(200);
        await expect(page.locator("body")).not.toBeEmpty();
    });
}

test("404 页面正常渲染", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist/");
    expect(res?.status()).toBe(404);
    await expect(page.locator("body")).not.toBeEmpty();
});

test("RSS 正常返回", async ({ request }) => {
    const res = await request.get("/rss.xml");
    expect(res.status()).toBe(200);
    const contentType = res.headers()["content-type"];
    expect(contentType).toMatch(/xml/);
});
