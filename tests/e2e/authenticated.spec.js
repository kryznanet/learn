import { test, expect } from '@playwright/test';

const email = process.env.KRYZNA_E2E_EMAIL;
const password = process.env.KRYZNA_E2E_PASSWORD;

test.describe('Kryzna Learn authenticated editor', () => {
  test.skip(!email || !password, 'Set KRYZNA_E2E_EMAIL and KRYZNA_E2E_PASSWORD to enable authenticated E2E.');

  async function login(page) {
    await page.goto('/admin/login.html');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.locator('#login-form button[type="submit"]').click();

    await page.waitForURL(/\/admin\/index\.html|\/content\/index\.html|\/admin\/dashboard\.html/, {
      timeout: 15_000
    });
  }

  test('super admin can reach the editor', async ({ page }) => {
    await login(page);

    await page.goto('/content/editor.html');
    await expect(page.locator('#form')).toBeVisible();
    await expect(page.locator('#konten')).toBeEditable();
  });

  test('super admin can open material version history and sees restore controls', async ({ page }) => {
    await login(page);

    await page.goto('/content/materials.html');
    const material = page.locator('article.card').filter({ hasText: 'Test 12' }).first();
    await expect(material).toBeVisible();

    await material.getByRole('link', { name: 'Riwayat Versi' }).click();
    await expect(page).toHaveURL(/\/content\/versions\.html\?id=/);
    await expect(page.locator('#heading')).toContainText('Riwayat Versi: Test 12');
    await expect(page.getByRole('button', { name: 'Pulihkan' }).first()).toBeVisible();
  });
});
