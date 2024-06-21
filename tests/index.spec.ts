import { test, expect } from '@playwright/test';

test('meta is correct', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Spencer Woo - Spencer's Blog");
});
