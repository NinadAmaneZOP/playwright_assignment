import { test, expect } from '@playwright/test';
import { openHome, searchFor, openFirstProduct, visibleText, WAIT } from './helpers/decathlon';

// HOME-001: Homepage loads and the main navigation is visible.
test('HOME-001 - homepage loads successfully', async ({ page }) => {
  const response = await openHome(page);
  expect(response, 'Expected the homepage navigation to return a response').not.toBeNull();
  expect(response!.status()).toBeLessThan(400);

  for (const label of ['All Sports', 'Men', 'Women', 'Kids']) {
    await expect(visibleText(page, label, true), `"${label}" nav item`).toBeVisible({ timeout: WAIT });
  }
});

// SEARCH-001: A valid keyword returns relevant results.
test('SEARCH-001 - search returns relevant backpack results', async ({ page }) => {
  await searchFor(page, 'backpack');
  const resultLink = page.getByRole('link', { name: /backpack/i }).filter({ visible: true }).first();
  await expect(resultLink).toBeVisible({ timeout: WAIT });
});

// SEARCH-002: An unknown keyword shows the empty state.
test('SEARCH-002 - search displays a no-results message for an unknown keyword', async ({ page }) => {
  await searchFor(page, 'ZXQ987NOITEM');
  await expect(
    visibleText(page, /no results|no products|no items|not found|couldn.?t find|try searching|try a different|sorry/i)
  ).toBeVisible({ timeout: WAIT });
});

// PRODD-007: Open a product detail page from the listing.
test('PRODD-007 - open a product detail page from the listing', async ({ page }) => {
  await openFirstProduct(page);
  await expect(page.getByRole('heading').filter({ visible: true }).first()).toBeVisible({ timeout: WAIT });
  await expect(visibleText(page, /₹\s?[\d,]+/)).toBeVisible({ timeout: WAIT });
  await expect(visibleText(page, /MRP/i)).toBeVisible({ timeout: WAIT });
});