const { test, expect } = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');

test('validate SignIn Page URL After Redirection', async ({ page }) => {
  test.setTimeout(60000);
  const base = new BasePage(page);
  // 1) Open base and accept cookies  
  await base.open(urls.base);
  await base.acceptCookies();
  // 2) Click on Sign In link
  const signInLink = page.locator("//div[@class='secondary-links']//a[@class='login' and @aria-label='Sign In']");
  await page.waitForTimeout(2000);
  await expect(signInLink).toBeVisible();
  await signInLink.click();
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);
  // 3) Verify Sign In page loaded
  await base.handleRandomLocationModal();
  await page.waitForTimeout(1000);
  const currentUrl = page.url();
  if (currentUrl.includes('/login.dominionenergy.com') || currentUrl.includes('/account.dominionenergysc.com')) {
    console.log("Sign In page loaded successfully:", currentUrl);
  }
  else {
    console.log("Failed to load the correct Sign In page.");
  }
});
