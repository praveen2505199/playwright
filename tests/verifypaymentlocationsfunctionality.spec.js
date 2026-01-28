const { test, expect } = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');


test('Verify Payment Locations Page Search and Pagination Functionality', async ({ page }) => {

    test.setTimeout(200000);
    const base = new BasePage(page);
    await base.handleFeedbackModal();
    console.log("Step 1: Open base URL and accept cookies");
    await base.open(urls.base);
    await base.acceptCookies();
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    console.log("Step 2:Click Search button and search payment locations");
    const searchIcon = page.locator("//button[@class='search']");
    await page.waitForTimeout(3000);
    await expect(searchIcon).toBeVisible({ timeout: 1000 });
    await searchIcon.isEnabled({ timeout: 1000 });
    await searchIcon.click();
    await base.handleLocationSouthCarolina();
    await page.waitForTimeout(1000);
    await searchIcon.click();
    const searchInput=page.locator('#search-box-input');
    await expect(searchInput).toBeVisible({ timeout: 1000 });
    await searchInput.fill('Payment Locations');
    await page.waitForTimeout(1000);
    console.log("Step 3: click the search results - 'Payment Locations'")
    await searchInput.press('Enter');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    //await page.waitForSelector("//*[@id='coveo01cd4840']//*[@class='coveo-result-list-container coveo-list-layout-container']//*[@class='coveo-list-layout CoveoResult']");
    await base.CoveoresultIsVisible();
    const result = page.locator("//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Payment Locations']");
    await page.waitForTimeout(4000);
    await expect(result).toBeVisible({ timeout: 2000 });
   // await base.handleFeedbackModal();
    await result.click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    console.log("Step 4: Verify it navigates to Payment locations page")
    if (currentUrl.includes('/south-carolina/paying-my-bill/pay-my-bill/payment-locations')) {
     console.log("Payment locations page loaded successfully:", currentUrl);
    }
     else {console.log("Failed to load the correct page.");}
      console.log("Step 5: Verify Search bar is visible in the page");
     const searchbar = page.locator("//*[@class='dt-search']/input");
     await page.waitForTimeout(100);
     await searchbar.waitFor({ state: 'visible' });
     await expect(searchbar).toBeVisible();
     await searchbar.fill("Street");
      console.log("Step 6: Verify Search result is visible in the page");
     const searchres = page.locator("//table[@id='DataTables_Table_0']");
     await searchres.waitFor({ state: 'visible'});
     await expect(searchres).toBeVisible();
     console.log("Step 7: Verify pagination for the search results");
     await page.reload();
     await page.waitForTimeout(500);


const totalResultsText = await page.locator("//div[@id='DataTables_Table_0_info']").innerText();
await page.waitForTimeout(500);
const match = totalResultsText.match(/of (\d+) entries/);
if (!match) {
  throw new Error("Could not extract total result count from info text.");
}

const totalResults = parseInt(match[1]);
const resultsPerPage = 10;
const totalPages = Math.ceil(totalResults / resultsPerPage);
const lastPageResults = totalResults % resultsPerPage;

console.log(`Total results: ${totalResults}`);
console.log(`Results per page: ${resultsPerPage}`);
console.log(`Total pages: ${totalPages}`);

// Helper function to count rows on current page
const countRows = async () => {return await page.locator("//table[@id='DataTables_Table_0']/tbody/tr").count();};

// Verify initial page results count
const displayedResults = await countRows();

if (totalResults <= resultsPerPage) {
  if (displayedResults !== totalResults) {
    throw new Error(`All ${totalResults} results should be visible on first page.`);
  }

  // Check pagination is NOT visible
  const paginationButtonsCount = await page.locator("//nav[@aria-label='pagination']//button[contains(@class, 'dt-paging-button')]").count();
  if (paginationButtonsCount > 1) {
    throw new Error("Pagination should not be visible when results ≤ 10.");
  }

  return;
}

const prevBtn = await page.locator("//nav[@aria-label='pagination']//button[contains(@class,'previous')]");
const nextBtn = await page.locator("//nav[@aria-label='pagination']//button[contains(@class,'next')]");

// Check initial button states
const prevBtnClass = await prevBtn.getAttribute("class");
const nextBtnClass = await nextBtn.getAttribute("class");

if (!prevBtnClass.includes("disabled")) {
  throw new Error("Previous button should be disabled on first page.");
}
if (nextBtnClass.includes("disabled")) {
  throw new Error("Next button should be enabled on first page.");
}

const expectedFirstPage = Math.min(resultsPerPage, totalResults);
if (displayedResults !== expectedFirstPage) {
  throw new Error(`First page: result count mismatch. Expected ${expectedFirstPage}, but found ${displayedResults}.`);
}

// Click through each page and validate result counts
for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
  const pageBtn = await page.locator(`//nav[@aria-label='pagination']//button[text()='${currentPage}']`);
  await pageBtn.scrollIntoViewIfNeeded();
  await pageBtn.click();

  // Wait for results to update (wait for network idle)
  await page.waitForLoadState('networkidle');

  // Re-query buttons to avoid stale references
  const prevBtn = await page.locator("//nav[@aria-label='pagination']//button[contains(@class,'previous')]");
  const nextBtn = await page.locator("//nav[@aria-label='pagination']//button[contains(@class,'next')]");

  const displayedResults = await countRows();
  const expected = (currentPage < totalPages)
    ? resultsPerPage
    : totalResults - resultsPerPage * (totalPages - 1);

  if (displayedResults !== expected) {
    throw new Error(`Page ${currentPage}: Expected ${expected} rows but found ${displayedResults}.`);
  }

  // Check button states
  const prevBtnClass = await prevBtn.getAttribute("class");
  const nextBtnClass = await nextBtn.getAttribute("class");

  if (prevBtnClass.includes("disabled")) {
    throw new Error("Previous button should be enabled after the first page.");
  }

  if (currentPage === totalPages) {
    if (!nextBtnClass.includes("disabled")) {
      throw new Error("Next button should be disabled on last page.");
    }
     // Log the results on the last page
    const lastPageRows = await page.locator("//table[@id='DataTables_Table_0']/tbody/tr");
    //const lastPageResults = await lastPageRows.allTextContents();
    await page.waitForTimeout(2000);
    const lastpagecount = await lastPageRows.count();
    await page.waitForTimeout(2000);
    if (lastPageResults === 0) {
      // If no remainder, the last page should have full results
      expect(lastpagecount).toBe(resultsPerPage);
      console.log(`Actual Results on last page (${currentPage}): ${lastpagecount}`);

    } else {
      // If there is a remainder, the last page should have exactly the remainder results
      expect(lastpagecount).toBe(lastPageResults);
      console.log(`Actual Results on last page (${currentPage}): ${lastpagecount}`);

    }
    console.log(`Expected results on last page: ${lastPageResults}`);
    
    
  } else if (nextBtnClass.includes("disabled")) {
    throw new Error(`Next button should be enabled on page ${currentPage}.`);
  }
}

console.log("All pagination and results validation passed.");


    






});