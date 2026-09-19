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

  test('learning path filters show the published material categories', async ({ page }) => {
    await page.goto('/');

    const grid = page.locator('#grid');
    await expect(grid.locator('article.card').first()).toBeVisible();
    await expect(page.locator('#count')).toHaveText('58 materi');

    const expectedCategories = [
      ['Dasar', 'Materi · Dasar'],
      ['Intermediate', 'Materi · Menengah'],
      ['Advanced', 'Materi · Lanjutan'],
      ['Tutorial', 'Tutorial']
    ];

    for (const [category, label] of expectedCategories) {
      const filter = page.locator('#filters .chip', { hasText: label });
      await expect(filter).toBeVisible();
      await filter.click();

      await expect(filter).toHaveClass(/active/);
      const cards = grid.locator('article.card');
      await expect(cards.first()).toBeVisible();
      await expect(page.locator('#count')).not.toHaveText('0 materi');
      await expect(cards.locator('.badge').first()).toHaveText(label);

      if (category === 'Tutorial') {
        await expect(page.locator('#count')).toHaveText('4 materi');
      }
    }

    const allFilter = page.locator('#filters .chip', { hasText: 'Semua' });
    await allFilter.click();
    await expect(allFilter).toHaveClass(/active/);
    await expect(page.locator('#count')).toHaveText('58 materi');
  });

  test('learning path links activate the matching category filter', async ({ page }) => {
    await page.goto('/');

    for (const [label, category] of [
      ['Materi · Dasar', 'Dasar'],
      ['Materi · Menengah', 'Intermediate'],
      ['Materi · Lanjutan', 'Advanced'],
      ['Tutorial', 'Tutorial']
    ]) {
      await page.locator('[data-path-cat="' + category + '"]').click();
      await expect(page.locator('#filters .chip.active')).toHaveText(label);
      await expect(page.locator('#grid article.card').first()).toBeVisible();
    }
  });

  test('material cards link to the public detail page', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('#grid article.card').first();
    await expect(firstCard).toBeVisible();

    const href = await firstCard.getByRole('link', { name: 'Baca materi →' }).getAttribute('href');
    expect(href).toMatch(/^materi\/view\.html\?slug=.+/);

    await firstCard.getByRole('link', { name: 'Baca materi →' }).click();
    await expect(page).toHaveURL(/\/materi\/view\.html\?slug=.+/);
  });
});
