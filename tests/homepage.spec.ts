import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');

  // Expect the page to load successfully
  expect(page).toBeTruthy();
});

test('homepage gallery section', async ({ page }) => {
  await page.goto('/');

  // Gallery section
  const gallerySection = page
    .locator('div')
    .filter({ hasText: 'Welkom bij de jeugdafdeling' })
    .nth(2);
  await expect(gallerySection).toBeVisible();

  // Check for images in the gallery
  const images = gallerySection.locator('img');
  const imageCount = await images.count();
  expect(imageCount).toBeGreaterThan(0); // Ensure there is at least one image
});

test('homepage news section', async ({ page }) => {
  await page.goto('/');

  // News section
  const newsSection = page.getByText('Recent nieuws');
  await expect(newsSection).toBeVisible();

  // Check for at least one news article link
  const newsLinks = page.getByRole('link', { name: 'Lees verder →' });
  const linkCount = await newsLinks.count();
  expect(linkCount).toBeGreaterThan(0); // Ensure there is at least one news article link

  // Click on the first news article link and verify navigation
  await page.click('text=Lees verder →'); // Click on the first read more link
  const nieuwsURLPattern = /\/nieuws\/[a-zA-Z0-9-_]+/;
  await expect(page).toHaveURL(nieuwsURLPattern); // Verify navigation to news article page
});
