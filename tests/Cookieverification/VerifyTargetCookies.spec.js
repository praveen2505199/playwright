const { test, expect } = require('@playwright/test');
const { BasePage } = require('../../pages/basePage');
const urls = require('../../config/urls.json');

test('verify Targeting Cookies Behavior In MediaPage', async ({ page }) => {
  test.setTimeout(120000);
  const base = new BasePage(page);

  await base.open(urls.base);
  const banner = page.locator('#onetrust-banner-sdk');
  //await banner.waitFor({ state: 'visible', timeout });
  await page.waitForTimeout(1000);
  const ManagePreferences = page.locator("//button[contains(@aria-label, 'Manage Preferences,')]");
  //await ManagePreferences.waitFor({ state: 'visible', timeout });
  await page.waitForTimeout(500);
  await ManagePreferences.click();
  const TargetCookiesTab = page.locator("//h3[normalize-space(text())='Targeting Cookies']");
  await page.waitForTimeout(500);
  await TargetCookiesTab.click();
  const TargetCookieDisabled = page.locator("//div[@id='ot-desc-id-C0004']//input[@type='checkbox' and not(@checked)]");
  await TargetCookieDisabled.isVisible();
  const ConfirmMyChoicebtn = page.locator("//button[contains(@class, 'save-preference-btn')]");
  await ConfirmMyChoicebtn.click();
  const searchIcon = page.locator("//button[@class='search']");
    await expect(searchIcon).toBeVisible({ timeout: 10000 });
    await searchIcon.isEnabled({ timeout: 10000 });
    await searchIcon.click();
    await base.handleRandomLocationModal();
    await page.waitForTimeout(2000);
    await searchIcon.click();
    const searchInput=page.locator('#search-box-input');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('Media');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);
    await page.waitForSelector("//*[@id='coveo01cd4840']//*[@class='coveo-result-list-container coveo-list-layout-container']//*[@class='coveo-list-layout CoveoResult']");
    const result = page.locator("//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Media']");
    await page.waitForTimeout(1000);
    await expect(result).toBeVisible({ timeout: 10000 });
    await result.click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    if (currentUrl.includes('/About/Delivering-Energy/Electric-Projects/Rural-Broadband-Program/Media')) {
     console.log("Media page loaded successfully:", currentUrl);
    }
     else {console.log("Failed to load the correct page.");} 
     const videodisabled = page.locator("(//p[contains(@class,'empty-cookie') and not(@style)])[1]");
     await videodisabled.isVisible();
     const consentText = await videodisabled.innerText();
     await page.waitForTimeout(500);
     const expectedText = 'This is a video provided by a third party. To view this, please click on the "Cookie Settings" icon at the bottom left and provide your consent to accept "Targeting Cookies".';
     await expect(videodisabled).toContainText(expectedText);
     await page.waitForTimeout(500);
     console.log(`Consent Text: ${consentText}`);

     const cookiesetting = page.locator("//div[@class='ot-floating-button__front custom-persistent-icon']");
     await cookiesetting.click();
     await page.waitForTimeout(500);

     await TargetCookiesTab.click();
     await page.waitForTimeout(500);
     const TargetcookieEnable = page.locator("//label[@for ='ot-group-id-C0004']");
     await page.waitForTimeout(500);
     await TargetcookieEnable.click();
     await page.waitForTimeout(500);
     await ConfirmMyChoicebtn.click();
     await page.reload();
     const videoenabled = page.locator("(//p[@class='empty-cookie' and @style='display: none;'])[1]");
     await videoenabled.isVisible();
     await page.waitForTimeout(500);
     // If inside YouTube iframe, uncomment below and use frameLocator


//const titles = page.locator("//a[contains(@class,'ytp-title-link')]");

// get count
// Get all YouTube iframes on the page
const iframeHandles = await page.locator('iframe[src*="youtube.com"]').elementHandles();

for (let i = 0; i < iframeHandles.length; i++) {
  const frame = await iframeHandles[i].contentFrame();
  if (!frame) continue;

  // Get all video title links inside this iframe
  const titleHandles = await frame.locator("//a[contains(@class,'ytp-title-link')]").elementHandles();

  for (const titleHandle of titleHandles) {
    const text = await titleHandle.innerText();
    const href = await titleHandle.getAttribute('href');
    console.log(`Title: ${text}`);
    console.log(`Href: ${href}`);
  }
}



});