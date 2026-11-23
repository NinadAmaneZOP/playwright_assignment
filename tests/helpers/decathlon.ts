import { expect, type Page } from '@playwright/test';

export const WAIT = 20_000;

// Listing page used during manual testing (Men Tshirts, in-stock only).
export const LISTING_PATH = '/c/men-tshirts-17107?inStock=1';

// Decathlon keeps loading trackers/ads, so waiting for the full "load" event is
// slow and flaky. DOMContentLoaded + web-first assertions is enough.
export async function openHome(page: Page) {
  return page.goto('/', { waitUntil: 'domcontentloaded' });
}

// Product links on a listing page. PDP URLs contain /p/<id>.
export function productLinks(page: Page) {
  return page.locator('a[href*="/p/"]').filter({ visible: true });
}

export async function openMenTshirtsListing(page: Page) {
  const response = await page.goto(LISTING_PATH, { waitUntil: 'domcontentloaded' });
  await expect(productLinks(page).first()).toBeVisible({ timeout: WAIT });
  return response;
}

// First VISIBLE element with the given text. Plain getByText().first() can pick a
// hidden duplicate (mobile menu etc.) and fail toBeVisible().
export function visibleText(page: Page, text: string | RegExp, exact = false) {
  return page.getByText(text, { exact }).filter({ visible: true }).first();
}

export async function visibleLinkCount(page: Page) {
  return page.getByRole('link').filter({ visible: true }).count();
}

export async function searchFor(page: Page, keyword: string) {
  await openHome(page);

  // The page is rendered once the main navigation is visible.
  await expect(visibleText(page, 'All Sports', true)).toBeVisible({ timeout: WAIT });

  // The search text ("Search for "Cycles"") is animated, so it is probably NOT a plain
  // placeholder attribute. Try common real-input selectors first...
  const input = page
    .locator(
      [
        'input[type="search"]',
        'input[placeholder*="earch" i]',
        'input[aria-label*="earch" i]',
        'input[name*="earch" i]',
        'input[id*="earch" i]',
        '[role="searchbox"]',
        '[role="combobox"]',
      ].join(', ')
    )
    .filter({ visible: true })
    .first();

  const foundInput = await input
    .waitFor({ state: 'visible', timeout: 5_000 })
    .then(() => true)
    .catch(() => false);

  if (foundInput) {
    await input.click();
    await input.fill(keyword);
    await input.press('Enter');
    return;
  }

  // ...otherwise click the visible "Search for ..." bar and type into whatever gets focus.
  const searchBar = visibleText(page, /search for/i);
  await expect(searchBar, 'search bar text').toBeVisible({ timeout: WAIT });
  await searchBar.click();
  await page.keyboard.type(keyword, { delay: 50 });
  await page.keyboard.press('Enter');
}

export async function openFirstProduct(page: Page) {
  await openMenTshirtsListing(page);
  await productLinks(page).first().click();
  await expect(page).toHaveURL(/\/p\/\d+/, { timeout: WAIT });
}

// Best effort: click the first enabled size option if the product has sizes.
// If your PDP uses different markup, adjust the regex/selector here only.
export async function selectFirstAvailableSize(page: Page) {
  const sizes = page
    .getByText(/^(XXS|XS|S|M|L|XL|XXL|2XL|3XL|4XL|\d{2}(\.\d)?)$/)
    .filter({ visible: true });
  const count = await sizes.count();
  for (let i = 0; i < count; i++) {
    const option = sizes.nth(i);
    if (await option.isEnabled()) {
      await option.click();
      return true;
    }
  }
  return false; // no size selector found (some products do not need one)
}