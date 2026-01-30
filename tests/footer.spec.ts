import { test, expect } from '@playwright/test';

test('Footer has working navigation links', async ({ page }) => {
  await page.goto('/');

  const links = {
    Home: '/',
    Agenda: '/agenda',
    Proeflessen: '/proefles',
    Nieuws: '/nieuws',
    "Foto's": '/fotos',
    Over: '/over',
    Contact: '/contact',
  };

  for (const [linkText, linkHref] of Object.entries(links)) {
    const link = page
      .getByRole('contentinfo')
      .getByRole('link', { name: linkText });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(linkHref));
    await page.goto('/'); // Navigate back to home for the next link test
  }
});

test('Footer renders on 404 page', async ({ page }) => {
  await page.goto('/404-page'); // Start from a different page

  // Expect 404 code on non-existent page
  await expect(page).toHaveURL(/\/404-page/);
  page.on('response', async (response) => {
    if (response.url().includes('/404-page')) {
      expect(response.status()).toBe(404);
      await expect(page.getByRole('contentinfo')).toBeVisible();
    }
  });
});

test('Footer displays three sections', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('contentinfo')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Snel naar' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Contact' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Volg ons op' }),
  ).toBeVisible();
});

test('Footer copyright information is displayed', async ({ page }) => {
  await page.goto('/');
  const currentYear = new Date().getFullYear();

  await expect(page.getByText(`Copyright © ${currentYear}`)).toBeVisible();
});
