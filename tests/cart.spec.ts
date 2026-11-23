import { test, expect } from '@playwright/test';
import { openMenTshirtsListing, WAIT } from './helpers/decathlon';

test.use({ locale: 'en-IN' });

// CART-001: Add a product from the listing page.
test('CART-001 - adding a product from listing updates cart feedback', async ({ page }) => {
  await openMenTshirtsListing(page);

  const addToCart = page.getByRole('button', { name: /add to cart/i })
    .filter({ visible: true })
    .first();

  await expect(addToCart).toBeVisible({ timeout: WAIT });
  await addToCart.click();

  const cartFeedback = page.getByText(
    /added to cart|go to cart|view cart|cart/i
  ).filter({ visible: true }).first();

  await expect(cartFeedback).toBeVisible({ timeout: WAIT });
});
