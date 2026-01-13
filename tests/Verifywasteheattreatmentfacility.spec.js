const { test, expect } = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');

test('verify Waste Heat Treatment Facility Page And Table Data', async ({ page }) => {
  test.setTimeout(180000);
  const base = new BasePage(page);
  // 1) Open base and accept cookies
  await base.open(urls.base);
  await base.acceptCookies();
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);
  const searchIcon = page.locator("//button[@class='search']");
  await expect(searchIcon).toBeVisible({ timeout: 10000 });
  await searchIcon.isEnabled({ timeout: 10000 });
  await searchIcon.click();
  await base.handleRandomLocationModal();
  await page.waitForTimeout(2000);
  await searchIcon.click();
  const searchInput = page.locator('#search-box-input');
  await expect(searchInput).toBeVisible({ timeout: 10000 });
  await searchInput.fill('Waste Heat Treatment Facility');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('load');
  await page.waitForTimeout(2000);
  await base.CoveoresultIsVisible();
  // await page.waitForSelector("//*[@id='coveo01cd4840']//*[@class='coveo-result-list-container coveo-list-layout-container']//*[@class='coveo-list-layout CoveoResult']");
  const result = page.locator("//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Waste Heat Treatment Facility']");
  await page.waitForTimeout(1000);
  await expect(result).toBeVisible({ timeout: 10000 });
  await result.click();
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);
  const currentUrl = page.url();
  if (currentUrl.includes('/about/making-energy/nuclear-facilities/north-anna-power-station/waste-heat-treatment-facility')) {
    console.log("Waste Heat Treatment page loaded successfully:", currentUrl);
  }
  else { console.log("Failed to load the correct page."); }
  const rows = page.locator("//div[@class='table-container' and @data-component-name='LC01']//table/tbody/tr");
  const rowCount = await rows.count();
  console.log(`Total number of rows in the table: ${rowCount}`);
  if (rowCount === 0) {
    console.log("No data rows found in the table.");
  }
  else {
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const cells = row.locator('td');
      const cellCount = await cells.count();
      console.log(`Row ${i + 1} has ${cellCount} columns`);
      const dateText = await cells.nth(0).innerText();
      const rowDate = new Date(dateText);
      const nowESTString = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
      const nowEST = new Date(nowESTString);
      const diffDays = Math.floor((nowEST - rowDate) / (1000 * 60 * 60 * 24));
      console.log(`Row ${i + 1}, Column 1 date: ${dateText}, Days difference: ${diffDays}`);
      expect(diffDays).toBeLessThanOrEqual(2);
      for (let c = 1; c < cellCount; c++) {
        const cellText = await cells.nth(c).innerText();
        console.log(`Row ${i + 1}, Column ${c + 1} value: "${cellText.trim()}"`);
        expect(cellText.trim(), `Row ${i + 1}, Column ${c + 1} is empty`).not.toBe('');
      }
      console.log(`Row ${i + 1} validation passed`);
    }
    console.log("All rows validated successfully!");
  }
});