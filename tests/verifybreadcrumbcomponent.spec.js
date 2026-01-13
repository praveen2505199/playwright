const { test, expect } = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');

test('Breadcrumb Navigation: Verifying Correct Path and Functionality', async ({ page }) => {
 
  test.setTimeout(180000);
  const base = new BasePage(page);
  await base.open(urls.base);
  await base.acceptCookies();

  const locationMenu = page.locator("//a[text()='Location']");
  await expect(locationMenu).toBeVisible();
  // Click the Location menu
  await locationMenu.click();
  await page.waitForTimeout(500);
  await base.handleLocationVirginia();
  const searchIcon = page.locator("//button[@class='search']");
    await expect(searchIcon).toBeVisible({ timeout: 10000 });
    await searchIcon.isEnabled({ timeout: 10000 });
    await searchIcon.click();
    const searchInput=page.locator('#search-box-input');
    await expect(searchInput).toBeVisible({ timeout: 1000 });
    await searchInput.fill('Budget Billing');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    await base.CoveoresultIsVisible();
    const result = page.locator("//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Budget Billing']");
    await page.waitForTimeout(4000);
    await result.isVisible();
    //await expect(result).toBeVisible({ timeout: 1000 });
    await result.click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    if (currentUrl.includes('/virginia/paying-my-bill/billing-options-and-energy-assistance/budget-billing')) {
     console.log("Budget Billing page loaded successfully:", currentUrl);
    }
     else {console.log("Failed to load the correct page.");} 

  // -------------------------------
  // Verify Breadcrumb and navigation
  // -------------------------------
  const breadcrumb = page.locator("//div[contains(@class, 'breadcrumb-area')]");
  await expect(breadcrumb).toBeVisible({ timeout: 10000 });

  // 3) Collect breadcrumb links
  const crumbs = breadcrumb.locator('a');
  const count = await crumbs.count();
  expect(count).toBeGreaterThan(0);

  // 4) Iterate each crumb, click it and verify the navigated url matches the link href
  for (let i = 0; i < count; i++) {
    const link = crumbs.nth(i);
    const text = (await link.innerText()).trim();
    const href = await link.getAttribute('href');

    // Skip crumbs without href
    if (!href) {
      test.info().annotations.push({ type: 'info', description: `Skipping breadcrumb part '${text}' — no href.` });
      continue;
    }
    const hrefNormalized = href.replace(/^\/(en|es)/, '').toLowerCase();
    const expectedUrl = new URL(hrefNormalized, 'https://www.dominionenergy.com').toString().replace(/\/$/, '');
    console.log(expectedUrl);
    // Click and wait for navigation. Some breadcrumb links may load via client routing — handle both.
    await link.click({ timeout: 20000 });
    //await page.waitForLoadState('load', { timeout: 20000 });


    const actualUrl = page.url().replace(/\/$/, '');

    // Assert the navigated URL matches expected href (resolved to absolute)
    expect(actualUrl).toBe(expectedUrl);

    // Navigate back to original page to continue verifying remaining crumbs
   // await page.goBack({ waitUntil: 'load' });
  await page.goto(`${urls.base}${urls.breadcrumbPage}`, { waitUntil: 'load' });

  }

  // Final assertion: breadcrumb still present on original page
  await expect(breadcrumb).toBeVisible();
});
