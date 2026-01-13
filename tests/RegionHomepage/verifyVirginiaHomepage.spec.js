const { test, expect } = require('@playwright/test');
const { BasePage } = require('../../pages/basePage');
const urls = require('../../config/urls.json');


test('Virginia: Verify Location Selection and URL Navigation', async ({ page }) => {
  
  test.setTimeout(60000);
  const base = new BasePage(page);
  await base.open(urls.base);
  await base.acceptCookies();
  const locationMenu = page.locator("//a[text()='Location']");
  await expect(locationMenu).toBeVisible();
  // Click the Location menu
  await locationMenu.click();
  await page.waitForTimeout(500);
  // Get all location options 
   const locationModal = page.locator('#modal-overlay');
   await expect(locationModal).toBeVisible();
  const virginiaOption = locationModal.locator("a.tile.location-tile[data-location='Virginia']");
  const homeUrl = await virginiaOption.getAttribute("data-home-url");
await page.waitForTimeout(500);
console.log("Selected home URL:", homeUrl);  
  await virginiaOption.click();
    await page.waitForTimeout(500);
    const continueBtn = page.locator("button.location-continue-btn");
    await continueBtn.click();
    await page.waitForLoadState('load');

//await page.reload();
await page.reload({ waitUntil: 'load' });  // Wait until full page load

const currentUrl = page.url();
await page.waitForTimeout(500);
console.log(`current url: ${currentUrl}`);
//await page.waitForTimeout(500);
const currentUrlTrimmed = currentUrl.replace(/\/$/, "").toLowerCase();

// Build correct expected URL
const stateSlug = homeUrl.split("/").pop().toLowerCase(); // "north-carolina"
const expectedUrl = `${urls.base}/${stateSlug}`;
// Compare expected with current
expect(currentUrlTrimmed).toBe(expectedUrl);

// Call checkNetworkStatus function to verify there are no network errors
  const isNetworkOkay = await base.checkNetworkStatus();

  // Handle the result
  if (isNetworkOkay) {
    console.log('Test passed: No network issues.');
  } else {
    console.log('Test failed: There were network issues.');
  }


});
