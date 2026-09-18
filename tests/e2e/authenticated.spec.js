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

  test('super admin can autosave a new editor draft locally without persisting it', async ({ page }) => {
    await login(page);

    await page.goto('/content/editor.html');
    await expect(page.locator('#form')).toBeVisible();
    await page.waitForFunction(() => window.__kryznaEditorReady === true);

    await page.locator('#judul').fill('E2E Draft Recovery Probe');
    await page.locator('#deskripsi').fill('Draft lokal untuk verifikasi Browser E2E.');
    await page.locator('#konten').fill('Isi draft E2E yang tidak dikirim ke database.');

    await expect
      .poll(async () => page.locator('#msg').textContent(), { timeout: 5_000 })
      .toContain('Draft tersimpan otomatis');

    const draft = await page.evaluate(() => {
      const userId = window.__kryznaE2EUserId || null;
      const keys = Object.keys(localStorage);
      const key = keys.find((item) => item.startsWith('kryzna-learn:draft:') && item.endsWith(':new'));
      return key ? JSON.parse(localStorage.getItem(key)) : null;
    });

    expect(draft?.judul).toBe('E2E Draft Recovery Probe');
    expect(draft?.deskripsi).toBe('Draft lokal untuk verifikasi Browser E2E.');
    expect(draft?.konten).toContain('Isi draft E2E yang tidak dikirim ke database.');
    expect(draft?.savedAt).toBeTruthy();

    await page.reload();
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Ditemukan draft lokal');
      await dialog.accept();
    });

    await expect(page.locator('#judul')).toHaveValue('E2E Draft Recovery Probe');
    await expect(page.locator('#deskripsi')).toHaveValue('Draft lokal untuk verifikasi Browser E2E.');
    await expect(page.locator('#konten')).toContainText('Isi draft E2E yang tidak dikirim ke database.');

    await page.evaluate(() => {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('kryzna-learn:draft:'))
        .forEach((key) => localStorage.removeItem(key));
    });
  });

  test('super admin can recover a draft for an existing material without persisting it', async ({ page }) => {
    await login(page);

    await page.goto('/content/materials.html');
    const material = page.locator('article.card').filter({ hasText: 'Test 12' }).first();
    await expect(material).toBeVisible();

    await material.getByRole('link', { name: 'Tulis / Edit' }).click();
    await expect(page.locator('#form')).toBeVisible();
    await page.waitForFunction(() => window.__kryznaEditorReady === true);

    const materialId = await page.locator('#id').inputValue();
    expect(materialId).not.toBe('');

    await page.locator('#judul').fill('E2E Existing Material Draft Probe');
    await page.locator('#deskripsi').fill('Draft existing material untuk recovery.');
    await page.locator('#konten').fill('Isi draft existing material yang tidak dikirim ke database.');

    await expect
      .poll(async () => page.locator('#msg').textContent(), { timeout: 5_000 })
      .toContain('Draft tersimpan otomatis');

    const draftKey = await page.evaluate((id) => {
      const prefix = 'kryzna-learn:draft:';
      return Object.keys(localStorage).find(
        (key) => key.startsWith(prefix) && key.endsWith(':' + id)
      ) || null;
    }, materialId);

    expect(draftKey).toBeTruthy();

    await page.reload();
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Ditemukan draft lokal');
      await dialog.accept();
    });

    await expect(page.locator('#judul')).toHaveValue('E2E Existing Material Draft Probe');
    await expect(page.locator('#deskripsi')).toHaveValue('Draft existing material untuk recovery.');
    await expect(page.locator('#konten')).toContainText('Isi draft existing material yang tidak dikirim ke database.');

    await page.evaluate(() => {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('kryzna-learn:draft:'))
        .forEach((key) => localStorage.removeItem(key));
    });
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
