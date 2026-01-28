const {test,expect} = require('@playwright/test');
const urls = require('../../config/urls.json');
const { BasePage } = require('../../pages/basePage');  

test('Verify Lower Saluda River Level Date Update', async ({ page }) => {
  test.setTimeout(120000);
  const base = new BasePage(page);
  await base.handleFeedbackModal();
    // 1) Open base and accept cookies
    await base.open(urls.base);
    await base.acceptCookies();
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    const searchIcon = page.locator("//button[@class='search']");
    await expect(searchIcon).toBeVisible({ timeout: 10000 });
    await searchIcon.isEnabled({ timeout: 10000 });
    await searchIcon.click();
   // await page.waitForSelector("//div[contains(@class,'secondary-links')]//button[@class='search']", { state: 'attached' });
    //await searchIcon.click({ force: true });
    await base.handleRandomLocationModal();
    await page.waitForTimeout(2000);
    await searchIcon.click();
    const searchInput=page.locator('#search-box-input');
   // await expect(searchInput).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(3000);
    await searchInput.fill('Lower Saluda River SC');
    await page.waitForTimeout(1000);
    await searchInput.press('Enter');
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);
    //await page.waitForSelector("//*[@id='coveo01cd4840']//*[@class='coveo-result-list-container coveo-list-layout-container']//*[@class='coveo-list-layout CoveoResult']");
    await base.CoveoresultIsVisible();
    const result = page.locator("//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Lower Saluda River SC']");
    await page.waitForTimeout(1000);
    await expect(result).toBeVisible({ timeout: 10000 });
   // await base.handleFeedbackModal();
    await result.click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    if (currentUrl.includes('/about/lakes-and-recreation/lower-saluda-river-sc')) {
     console.log("Lower Saluda River page loaded successfully:", currentUrl);
    }
     else {console.log("Failed to load the correct Lower Saluda River page.");} 
    const acceptbtn = page.locator("//div[contains(@class,'rich-text')]//button[@class='accept-button' and normalize-space(text())='Accept']");
    await acceptbtn.scrollIntoViewIfNeeded();
    await acceptbtn.click(); 
    const riverlevelframe = page.locator('#river-level-app');
    await riverlevelframe.scrollIntoViewIfNeeded();
    await expect(riverlevelframe).toBeVisible({ timeout: 10000 });
    const datetime = await page.locator('.date-time').innerText();
    const date = datetime.split('|')[0].trim();
    const todayEST = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "long",
    day: "numeric",
    year: "numeric"});
    console.log("Date shown on page:", date);
    console.log("Today's date EST:", todayEST);
    if (date === todayEST) {
      console.log("Date verification passed: Latest River Level got updated.");
    } else {
      console.log("Date verification failed: Latest River Level not updated.");
    }
});