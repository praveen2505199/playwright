const { test, expect } = require('@playwright/test');
const { BasePage } = require('../../pages/basePage');
const urls = require('../../config/urls.json');

test('Verify Cookie Preferences and Default Settings for Performance, Functional, and Targeting Cookies ', async ({ page }) => {
  test.setTimeout(120000);
  const base = new BasePage(page);

  await base.open(urls.base);
  const banner = page.locator('#onetrust-banner-sdk');
  //await banner.waitFor({ state: 'visible', Timeout });
  await page.waitForTimeout(500);
  const ManagePreferences = page.locator("//button[contains(@aria-label, 'Manage Preferences,')]");
  //await ManagePreferences.waitFor({ state: 'visible', timeout });
  await page.waitForTimeout(3000);
  await ManagePreferences.click();
  const YourPrivacyTab = page.locator("//h3[normalize-space(text())='Your Privacy']");
  await YourPrivacyTab.isVisible();
  console.log("Your Privacy Cookie is displayed");
  //step 2
  const StrictlyNecessaryCookieTab = page.locator("//h3[normalize-space(text())='Strictly Necessary Cookies']");
  await StrictlyNecessaryCookieTab.click();
  await StrictlyNecessaryCookieTab.isVisible();
  console.log("Strictly Necessary Cookie is displayed");
  //step3
  const PerformanceCookieTab = page.locator("//h3[normalize-space(text())='Performance Cookies']");
  await PerformanceCookieTab.click();
  await PerformanceCookieTab.isVisible();
  console.log("Performance Cookie is displayed");
  await page.waitForTimeout(500);
  const PerformanceCookieDisabled = page.locator("//div[@id='ot-desc-id-C0002']//input[@type='checkbox' and not(@checked)]");
  await PerformanceCookieDisabled.isVisible();
  console.log("Performance Cookie is disabled by default")
  //step4
  const FucntionalCookieTab = page.locator("//h3[normalize-space(text())='Functional Cookies']");
  await FucntionalCookieTab.click();
  await FucntionalCookieTab.isVisible();
  console.log("Functional Cookie is displayed");
  await page.waitForTimeout(500);
  const FunctionalCookieDisabled = page.locator("//div[@id='ot-desc-id-C0003']//input[@type='checkbox' and not(@checked)]");
  await FunctionalCookieDisabled.isVisible();
  console.log("Functional Cookie is disabled by default")
  //step5
  const TargetCookiesTab = page.locator("//h3[normalize-space(text())='Targeting Cookies']");
  await TargetCookiesTab.click();
  await TargetCookiesTab.isVisible();
  console.log("Target Cookie is displayed");
  await page.waitForTimeout(500);
  const TargetCookieDisabled = page.locator("//div[@id='ot-desc-id-C0004']//input[@type='checkbox' and not(@checked)]");
  await TargetCookieDisabled.isVisible();
  console.log("Target Cookie is disabled by default")
});
