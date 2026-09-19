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

  test('learning path filters show every published material category', async ({ page }) => {
    await page.goto('/');

    const grid = page.locator('#grid');
    await expect(grid.locator('article.card').first()).toBeVisible();
    await expect(page.locator('#count')).toHaveText('58 materi');

    const expectedCategories = [
      ['Dasar', 'Materi · Dasar', '22 materi'],
      ['Intermediate', 'Materi · Menengah', '20 materi'],
      ['Advanced', 'Materi · Lanjutan', '12 materi'],
      ['Tutorial', 'Tutorial', '4 materi']
    ];

    for (const [category, label, count] of expectedCategories) {
      const filter = page.locator('#filters .chip', { hasText: label });
      await expect(filter).toBeVisible();
      await filter.click();

      await expect(filter).toHaveClass(/active/);
      await expect(page.locator('#count')).toHaveText(count);

      const cards = grid.locator('article.card');
      await expect(cards).toHaveCount(Number(count.split(' ')[0]));
      await expect(cards.locator('.badge')).toHaveCount(Number(count.split(' ')[0]));

      for (const badge of await cards.locator('.badge').all()) {
        await expect(badge).toHaveText(label);
      }

      await expect(page.locator('[data-path-cat="' + category + '"]')).toBeVisible();
    }

    const allFilter = page.locator('#filters .chip', { hasText: 'Semua' });
    await allFilter.click();
    await expect(allFilter).toHaveClass(/active/);
    await expect(page.locator('#count')).toHaveText('58 materi');
    await expect(grid.locator('article.card')).toHaveCount(58);
  });

  test('learning path links activate the matching category filter', async ({ page }) => {
    await page.goto('/');

    for (const [label, category, count] of [
      ['Materi · Dasar', 'Dasar', '22 materi'],
      ['Materi · Menengah', 'Intermediate', '20 materi'],
      ['Materi · Lanjutan', 'Advanced', '12 materi'],
      ['Tutorial', 'Tutorial', '4 materi']
    ]) {
      const path = page.locator('[data-path-cat="' + category + '"]');
      await expect(path).toBeVisible();
      await path.click();

      await expect(page.locator('#filters .chip.active')).toHaveText(label);
      await expect(page.locator('#count')).toHaveText(count);
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
    await expect(page.locator('#head')).toBeVisible();
    await expect(page.locator('#head h1')).not.toHaveText('');
    await expect(page.locator('.content')).toBeVisible();
  });
});
