import { test, expect } from '@playwright/test';

const email = process.env.KRYZNA_E2E_EMAIL;
const password = process.env.KRYZNA_E2E_PASSWORD;

test.describe('Kryzna Learn authenticated editor', () => {
  test.skip(!email || !password, 'Set KRYZNA_E2E_EMAIL and KRYZNA_E2E_PASSWORD to enable authenticated E2E.');

  test('super admin can reach the editor', async ({ page }) => {
    await page.goto('/admin/login.html');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.locator('#login-form button[type="submit"]').click();

    await page.waitForURL(/\/admin\/index\.html|\/content\/index\.html|\/admin\/dashboard\.html/, {
      timeout: 15_000
    });

    await page.goto('/content/editor.html');
    await expect(page.locator('#form')).toBeVisible();
    await expect(page.locator('#konten')).toBeEditable();
  });
});
