const { test, expect } = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');

// Convert JS Date to MM/dd/yy format
function formatDate_MMddyy(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

test('Verify Electric Load Data with Date Validation for Current Month and Previous Days', async ({ page }) => {
  test.setTimeout(120000);
  const base = new BasePage(page);
  await base.handleFeedbackModal();
  await base.open(urls.electricLoadData);
  await base.acceptCookies();
  await page.waitForLoadState('load');

  // Search for Electric Transmission Access
  const searchIcon = page.locator("//button[@class='search']");
  await searchIcon.click();
  await base.handleRandomLocationModal();
  await searchIcon.click();

  const searchInput = page.locator('#search-box-input');
  await searchInput.fill('Electric Transmission Access');
  await searchInput.press('Enter');

  await base.CoveoresultIsVisible();
  const result = page.locator("//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Electric Transmission Access']");
  await page.waitForTimeout(10000);
  await page.waitForLoadState('networkidle');
  //await base.handleFeedbackModal();
  await result.click();

  // Click "PJM-South Zone Load (Current Month)"
  const fileLink = page.locator("//div[@class='rich-text']//a[text()='PJM-South Zone Load (Current Month)']");
  await fileLink.click();

  // New tab
  const newPage = await page.waitForEvent('popup');
  await newPage.waitForLoadState('load');

  // Get file content
  const fileContent = await newPage.locator('pre').textContent();
  const lines = fileContent.split(/\r?\n/).filter(x => x.trim().length > 0);

  console.log(`Total lines found in file: ${lines.length}`);

  // --------------------------------------------------------------------
  //  DATE VALIDATION LOGIC (EST)
  // --------------------------------------------------------------------

  const dateSet = new Set();
  // Current EST date
  const nowESTString = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const today = new Date(nowESTString);

   // Yesterday (EST)
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  //const today = new Date();
  //const yesterday = new Date(today);
  //yesterday.setDate(today.getDate() - 1);

  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  let lastDataLine = '';

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);

    if (parts.length > 0) {
      const dateStr = parts[0]; // Example: "12/01/25"

      // Try parsing MM/dd/yy
      const parsed = new Date(dateStr);

      if (!isNaN(parsed)) {
        const formatted = formatDate_MMddyy(parsed);

        // Detect duplicate
        if (dateSet.has(formatted)) {
          throw new Error(`Duplicate date found: ${formatted}`);
        }

        dateSet.add(formatted);
        lastDataLine = line;
      }
    }
  }

  console.log("Unique dates found:", dateSet.size);

  // --------------------------------------------------------------------
  // Generate expected dates: 1st → yesterday
  // --------------------------------------------------------------------

  const expectedDates = [];
  for (
    let d = new Date(firstOfMonth);
    d <= yesterday;
    d.setDate(d.getDate() + 1)
  ) {
    expectedDates.push(formatDate_MMddyy(d));
  }

  // Validate expected dates
  for (const expected of expectedDates) {
    if (!dateSet.has(expected)) {
      throw new Error(`Missing data for: ${expected}`);
    }
  }

  console.log(`All dates from ${formatDate_MMddyy(firstOfMonth)} to ${formatDate_MMddyy(yesterday)} are present`);
  console.log(" Last row in file:", lastDataLine);

  //expect(true).toBeTruthy();  // Allow test to pass if no errors thrown
});
