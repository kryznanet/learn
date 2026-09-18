import { test, expect } from '@playwright/test';

test.describe('Kryzna Learn public pages', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Kryzna Learn/i);
  });

  test('admin login page exposes email and password fields', async ({ page }) => {
    await page.goto('/admin/login.html');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#login-form button[type="submit"]')).toBeVisible();
  });
});
