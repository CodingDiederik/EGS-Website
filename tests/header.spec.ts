import { test, expect } from '@playwright/test';

test('Header displays navigation links', async ({ page }) => {
  await page.goto('/');

  // Check for the presence of navigation links in the header
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
      .getByLabel('Main navigation')
      .getByRole('link', { name: linkText });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(linkHref));
    await page.goto('/'); // Navigate back to home for the next link test
  }
});

test('Header renders on 404 page', async ({ page }) => {
  await page.goto('/404-page'); // Start from a different page

  // Expect 404 code on non-existent page
  await expect(page).toHaveURL(/\/404-page/);
  page.on('response', (response) => {
    if (response.url().includes('/404-page')) {
      expect(response.status()).toBe(404);
    }
  });
});

test('Header navigation links work', async ({ page }) => {
  await page.goto('/');

  // Test the agenda link
  await expect(
    page.getByLabel('Main navigation').getByRole('link', { name: 'Agenda' }),
  ).toBeVisible();
  await page
    .getByLabel('Main navigation')
    .getByRole('link', { name: 'Agenda' })
    .click();
});

test('Header button back to main site works', async ({ page }) => {
  await page.goto('/');

  // Check the button that navigates back to the main site
  await expect(
    page.getByRole('listitem').filter({ hasText: 'Terug naar de hoofdsite' }),
  ).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Terug naar de hoofdsite' })
    .click();
});
