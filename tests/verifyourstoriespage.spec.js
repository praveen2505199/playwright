const { test, expect } = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');

test('Verify Our Stories Page Functionality with Search, Filters, and Pagination', async ({ page }) => {

  test.setTimeout(200000);
  const base = new BasePage(page);
  // 1) Open base and accept cookies
  console.log("Step 1: Open base URL and accept cookies");
  await base.open(urls.base);
  await base.acceptCookies();
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);
  console.log("Step 2:Click Search button and search our stories");
  const searchIcon = page.locator("//button[@class='search']");
  await expect(searchIcon).toBeVisible({ timeout: 1000 });
  await searchIcon.isEnabled({ timeout: 1000 });
  await searchIcon.click();
  await page.waitForTimeout(100);
  //Selecting Random location using func
  await base.handleRandomLocationModal();
  await page.waitForTimeout(1000);
  await searchIcon.click();
  await page.waitForTimeout(100);
  const searchInput = page.locator('#search-box-input');
  await expect(searchInput).toBeVisible({ timeout: 1000 });
  await searchInput.fill('Our Stories');
  await page.waitForTimeout(1000);
  console.log("Step 3: click the search results - 'Our Stories'")
  await page.keyboard.press('Enter');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);
 // await page.waitForSelector("//*[@id='coveo01cd4840']//*[@class='coveo-result-list-container coveo-list-layout-container']//*[@class='coveo-list-layout CoveoResult']");
   await base.CoveoresultIsVisible();
  const result = page.locator("//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Our Stories']");
  await page.waitForTimeout(10000);
  //await expect(result).toBeVisible({ timeout: 2000 });
  await result.isVisible();
  await result.click();
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);
  const currentUrl = page.url();
  console.log("Step 4: Verify it navigates to our stories page")
  if (currentUrl.includes('/about/our-stories')) {
    console.log("Our Stories page loaded successfully:", currentUrl);
  }
  else { console.log("Failed to load the correct page."); }

  // Verify search summary is displayed
  const searchSummary = page.locator('.CoveoQuerySummary');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(4000);
  //await searchSummary.isVisible();
  await expect(searchSummary).toBeVisible();

  // Open the filter if it's not open
  console.log("Step 5: Clicking on filter button to select region")
  const filterButton = page.locator('button.search-filter-dropdown');
  const filterMenu = page.locator('#search-filter-menu[style="display: flex;"]');
  await filterButton.waitFor({ state: 'visible' });
  await filterButton.click();
  await page.waitForTimeout(500);
  await filterMenu.waitFor({ state: 'visible' });
  console.log('Filter menu is open and visible');

  // Loop through locations and validate counts
  const locationItems = page.locator("//*[@data-title='Location']/ul/li");
  const locationCount = await locationItems.count();
  console.log(`Step 6: Total location filters found: ${locationCount}`);
  for (let i = 0; i < locationCount; i++) {
    const w = i + 1;
    const locationItem = locationItems.nth(i);
    await locationItem.waitFor({ state: 'visible' });
    await locationItem.scrollIntoViewIfNeeded();
    await locationItem.click();
    await page.waitForTimeout(500);
    await page.waitForLoadState('networkidle');
    //const locationItems = page.locator(`//*[@data-title='Location']/ul/li[${w}]`);
    const countText = await page.locator("//*[@data-title='Location']/ul/li[" + w + "]//*[@class='coveo-facet-value-count']").innerText();
    await page.waitForTimeout(2000);
    const countClean = countText.includes(",") ? countText.replace(/,|\+/g, "") : countText.replace("+", "");

    //const countClean = countText.includes(",") ? countText.replace(",", "") : countText;
    console.log(`[Location ${i + 1}] Facet count: ${countClean}`);
    // Validate the total count
    const totalCount = await page.locator("//h6[contains(@class, 'search-info')]//span[contains(@class, 'coveo-highlight-total-count')]").innerText();
    await page.waitForTimeout(2000);
    const totalCountClean = totalCount.includes(",") ? totalCount.replace(/,|\+/g, "") : totalCount.replace("+", "");

    //  const totalCountClean = totalCount.includes(",") ? totalCount.replace(",", "") : totalCount;
    console.log(`[Location ${i + 1}] Total results count: ${totalCountClean}`);
    expect(countClean).toBe(totalCountClean);
    console.log(`[Location ${i + 1}] Count matched successfully`);
  }
  // Close any active filters if they exist
  console.log("Step 7: Closing Active filters if present")
  //await base.closeAllFilters();
  const closeButtonLocator = page.locator('#close_filter_btn');
  await closeButtonLocator.waitFor({ state: 'visible' });
  const buttonHandle = await closeButtonLocator.elementHandle();
  await page.evaluate((el) => el.click(), buttonHandle);
  // closeButtonLocator.click();


  console.log("Step 8: Clicking on filter button to select category")
  //const filterButton = page.locator('button.search-filter-dropdown');
  // const filterMenu = page.locator('#search-filter-menu[style="display: flex;"]');
  const isMenuVisible = await filterMenu.isVisible();
  if (!isMenuVisible) {
    // Only click if menu is NOT visible
    await filterButton.waitFor({ state: 'visible' });
    await filterButton.click();

    // Wait until menu is visible
    await filterMenu.waitFor({ state: 'visible' });
    console.log('Filter menu was closed, clicked the button, and it is now open');
  } else {
    console.log('Filter menu is already open');
  }

  // Loop through categories and validate counts
  const categoryItems = page.locator("//*[@data-title='Category']/ul/li");
  const categoryCount = await categoryItems.count();
  console.log(`Step 9: Total category filters found: ${categoryCount}`);
  for (let i = 0; i < categoryCount; i++) {
    const w = i + 1;
    const categoryItem = categoryItems.nth(i);
    await categoryItem.click();
    await page.waitForTimeout(3000);
    const categoryname = await categoryItem.getAttribute('data-value');
    console.log(`[Category ${i + 1}] Category Name: ${categoryname}`);
    const countText = await page.locator("//*[@data-title='Category']/ul/li[" + w + "]//*[@class='coveo-facet-value-count']").innerText();
    await page.waitForTimeout(3000);
    const countClean = countText.includes(",") ? countText.replace(/,|\+/g, "") : countText.replace("+", "");

    //const countClean = countText.includes(",") ? countText.replace(",", "") : countText;
    console.log(`[Category ${i + 1}] Facet count: ${countClean}`);
    const totalCount = await page.locator("//h6[contains(@class, 'search-info')]//span[contains(@class, 'coveo-highlight-total-count')]").innerText();
    await page.waitForTimeout(1000);
    const totalCountClean = totalCount.includes(",") ? totalCount.replace(/,|\+/g, "") : totalCount.replace("+", "");

    //  const totalCountClean = totalCount.includes(",") ? totalCount.replace(",", "") : totalCount;
    console.log(`[Category ${i + 1}] Total results count: ${totalCountClean}`);
    await page.waitForTimeout(3000);
    expect(countClean).toBe(totalCountClean);
    console.log(`[Category ${i + 1}] Count matched successfully`);
    await categoryItem.click();
    await page.waitForTimeout(1000);
  }


  const filterbuttonHandle = await filterButton.elementHandle();
  await page.evaluate((el) => el.click(), filterbuttonHandle);


  // Get the total number of results

  const count = page.locator(".coveo-highlight-total-count");
  await page.waitForTimeout(2000);;
  const totalResultsText = await count.innerText();
  await page.waitForTimeout(2000);
  const totalResults = Number(String(totalResultsText).match(/\d+/g).join(''));
  const resultsPerPage = 10;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  console.log(`Total results found: ${totalResults}`);
  console.log(`Results per page: ${resultsPerPage}`);
  console.log(`Total pages calculated: ${totalPages}`);
  await page.waitForSelector(".coveo-result-list-container.coveo-card-layout-container", { timeout: 10000 });

  const displayedResults = await page.$$eval(".coveo-card-layout.CoveoResult", els => els.length);

  console.log(`Results displayed on page 1: ${displayedResults}`);


  const pager = page.locator('.coveo-pager-list');

  if (totalResults <= resultsPerPage) {
    // Assert all results are shown on the first page
    console.log("Validating all results are shown on page 1 and pagination is hidden.");
    await page.waitForTimeout(1000);
    expect(displayedResults).toBe(totalResults);

    // Verify pagination is not visible

    const isPagerVisible = await pager.isVisible();
    console.log(`Is pagination visible? ${isPagerVisible}`);
    await page.waitForTimeout(100);
    expect(await pager.isVisible()).toBe(false);
    console.log("Pagination correctly hidden for <= 10 results");


    return; // No further pagination check is needed
  }

  // Verify results per page on the first page
  expect(displayedResults).toBe(resultsPerPage);

  // Loop through remaining pages
  for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
    console.log(`Navigating to page ${currentPage}`);
    const pagerButtons = await page.locator(".coveo-pager-list li:not(.coveo-pager-disabled) span").all();

    //console.log(`Pagination buttons found: ${pagerButtons.length}`);
    let targetPageButton = null;

    for (const button of pagerButtons) {
      const text = (await button.innerText()).trim();
      if (text === currentPage.toString()) {
        targetPageButton = button;
        break;
      }
    }

    if (!targetPageButton) {
      throw new Error(`Page button for page ${currentPage} not found.`);
    }

    // Click the target page button
    await targetPageButton.click();
    await page.waitForTimeout(3000); // Wait for page content to load
    const coveoresult = page.locator(".coveo-result-list-container.coveo-card-layout-container");
    await page.waitForTimeout(3000);
    await coveoresult.isVisible();
    const displayedResultsnow = await page.$$eval(".coveo-card-layout.CoveoResult", els => els.length);
    const expectedResults = (currentPage < totalPages) ? resultsPerPage : totalResults - resultsPerPage * (totalPages - 1);
    console.log(`Page ${currentPage} → Displayed results: ${displayedResultsnow}`);
    console.log(`Page ${currentPage} → Expected results: ${expectedResults}`);
    expect(displayedResultsnow).toBe(expectedResults);

    console.log(`Page ${currentPage} validated successfully`);
  }

});
