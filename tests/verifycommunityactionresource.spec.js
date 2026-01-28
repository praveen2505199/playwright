const {test, expect} = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');  
test('Verify Community Action Resource Search and Pagination Functionality', async ({ page }) => {
  test.setTimeout(180000);
    const base = new BasePage(page);
    await base.handleFeedbackModal();
  await base.open(urls.base);
   await base.acceptCookies();
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    const searchIcon = page.locator("//button[@class='search']");
    await expect(searchIcon).toBeVisible({ timeout: 10000 });
    await searchIcon.isEnabled({ timeout: 10000 });
    await searchIcon.click();
    await base.handleLocationSouthCarolina();
    await page.waitForTimeout(1000);
    await searchIcon.click();
    const searchInput=page.locator('#search-box-input');
    await expect(searchInput).toBeVisible({ timeout: 1000 });
    await searchInput.fill('Community Action Resources');
    await page.waitForTimeout(1000);
    await searchInput.press('Enter');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    await base.CoveoresultIsVisible();
    //await page.waitForSelector("//*[@id='coveo01cd4840']//*[@class='coveo-result-list-container coveo-list-layout-container']//*[@class='coveo-list-layout CoveoResult']");
    const result = page.locator("//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Community Action Resources']");
    await page.waitForTimeout(5000);
    //await expect(result).toBeVisible({ timeout: 20000 });
    await result.isVisible();
    //await base.handleFeedbackModal();
    await result.click();
    //await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    if (currentUrl.includes('/south-carolina/paying-my-bill/billing-options-and-assistance/community-action-resources')) {
     console.log("Community Action resources page loaded successfully:", currentUrl);
    }
     else {console.log("Failed to load the correct page.");} 

     const searchBar = page.locator("//*[@class='dt-search']/input");
  // -------------------------------
  // Verify Search Bar and Results
  // -------------------------------

  //await expect(searchBar).toBeVisible({ timeout: 5000 });
  await searchBar.scrollIntoViewIfNeeded();

  await searchBar.fill('Abbeville');
  await page.waitForTimeout(1000);

  const resultsTable = page.locator("//table[@id='datatablesAssistanceAgencies']/tbody/tr");
  const rowCount = await resultsTable.count();
  console.log(`Number of rows found in results table: ${rowCount}`);
  expect(rowCount).toBeGreaterThan(0); 
  //----------------------------
  // Verify Table headers
  //------------------------------
  const table = page.locator('#datatablesAssistanceAgencies');
  await expect(table).toBeVisible({ timeout: 10000 });

  //Check the column headers
  const headers = await table.locator('thead tr th');
  const headerTexts = await headers.allTextContents();

  //Verify the headers match the expected column names
  const expectedHeaders = ['County', 'Agency', 'Website', 'Phone'];
  
  //Check if the table headers match the expected column names
  expectedHeaders.forEach((header, index) => {
    expect(headerTexts[index].trim()).toBe(header);
  });

  console.log('Table contains the correct column names:', headerTexts);
  // -------------------------------
  // Pagination Check
  // -------------------------------
  const infoText = await page.locator("//div[@id='datatablesAssistanceAgencies_info']").textContent();
  console.log("Pagination info text:", infoText);
  const match = infoText.match(/of (\d+) results/);
  expect(match).not.toBeNull();
  const totalResults = parseInt(match[1]);
  console.log(`Total results extracted: ${totalResults}`);
  const resultsPerPage = 10;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  console.log(`Total pages calculated: ${totalPages}`);
  // Check first page
  let displayedResults = await resultsTable.count();
  if (totalResults <= resultsPerPage) {
    console.log("All results are displayed on first page.");
    expect(displayedResults).toBe(totalResults);

    const functionalPaginationButtons = await page.locator("//nav[@aria-label='pagination']//button[contains(@class, 'dt-paging-button')]")
      .filter({ has: page.locator(':not([aria-disabled="true"])') })
      .count();

    expect(functionalPaginationButtons).toBe(0);
    console.log("Pagination not displayed since total results <= 10.");
    return;
  }
   const prevBtn = page.locator("//nav[@aria-label='pagination']//button[contains(@class,'previous')]");
  const nextBtn = page.locator("//nav[@aria-label='pagination']//button[contains(@class,'next')]");

  await expect(prevBtn).toHaveClass(/disabled/);
  await expect(nextBtn).not.toHaveClass(/disabled/);
  expect(displayedResults).toBe(Math.min(resultsPerPage, totalResults));
 // Loop through pages
  for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
    const pageBtn = page.locator(`//nav[@aria-label='pagination']//button[text()='${currentPage}']`);
    await pageBtn.scrollIntoViewIfNeeded();
    console.log(`Clicking on page ${currentPage} button.`);
    await pageBtn.click();
    await page.waitForTimeout(1000);
    // Requery displayed results
    displayedResults = await resultsTable.count();
     console.log(`Page ${currentPage} - number of rows: ${displayedResults}`);
    const expected = currentPage < totalPages
      ? resultsPerPage
      : totalResults - resultsPerPage * (totalPages - 1);

    expect(displayedResults).toBe(expected);
     console.log(`Page ${currentPage} row count matches expected.`);
      // Validate buttons
    if (currentPage === totalPages) {
      await expect(nextBtn).toHaveClass(/disabled/);
    } else {
      await expect(nextBtn).not.toHaveClass(/disabled/);
    }
    await expect(prevBtn).not.toHaveClass(/disabled/);
  }
});
    