import { test, expect, type Page } from '@playwright/test';
import { openHome, visibleText, visibleLinkCount, WAIT } from './helpers/decathlon';

// A nav item may either navigate to a new page OR open a dropdown/mega-menu.
// Both are valid, so pass if the URL changed or more links became visible.
async function expectMenuOrNavigation(page: Page, startUrl: string, linksBefore: number, what: string) {
  await expect
    .poll(async () => page.url() !== startUrl || (await visibleLinkCount(page)) > linksBefore, {
      timeout: WAIT,
      message: `${what} should navigate or open a menu`,
    })
    .toBe(true);
}

// HOME-002: Open the All Sports navigation menu.
test('HOME-002 - All Sports navigation opens its category menu', async ({ page }) => {
  await openHome(page);
  const item = visibleText(page, 'All Sports', true);
  await expect(item).toBeVisible({ timeout: WAIT });

  const startUrl = page.url();
  const before = await visibleLinkCount(page);
  await item.click();
  await expectMenuOrNavigation(page, startUrl, before, 'All Sports');
});

// HOME-003: Open the Men section from the main navigation.
test('HOME-003 - Men navigation opens the Men section', async ({ page }) => {
  await openHome(page);
  // Matched by text (not role=link) because the nav item may be a button or tab.
  const item = visibleText(page, 'Men', true);
  await expect(item).toBeVisible({ timeout: WAIT });

  const startUrl = page.url();
  const before = await visibleLinkCount(page);
  await item.click();
  await expectMenuOrNavigation(page, startUrl, before, 'Men');
});