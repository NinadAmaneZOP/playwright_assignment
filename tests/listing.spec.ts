import { test, expect } from '@playwright/test';
import { openMenTshirtsListing, productLinks, WAIT } from './helpers/decathlon';

// PLP-001: Product cards show useful product information.
test('PLP-001 - product listing displays product cards and prices', async ({ page }) => {
  await openMenTshirtsListing(page);

  // Several links can point to one product (image + title), so count loosely.
  await expect.poll(() => productLinks(page).count(), { timeout: WAIT }).toBeGreaterThanOrEqual(3);

  const prices = page.getByText(/₹\s?[\d,]+/).filter({ visible: true });
  await expect.poll(() => prices.count(), { timeout: WAIT }).toBeGreaterThanOrEqual(3);

  const images = page.locator('a[href*="/p/"] img').filter({ visible: true });
  await expect.poll(() => images.count(), { timeout: WAIT }).toBeGreaterThanOrEqual(3);
});