const { test, expect } = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');
const { search } = require('../config/urls');

test('Validate Search Filters And Pagination Functionality', async ({ page }) => {

 
  const base = new BasePage(page);
  // 1) Open base and accept cookies
  console.log("Step 1: Open base URL and accept cookies");
  let searchpage = urls.search;
  let baseUrl = urls.base;
  let fullUrl = baseUrl + searchpage;
  await base.open(fullUrl);
  await base.acceptCookies();
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);
  const searchbox = page.locator("//*[@class='magic-box-input']");
  await searchbox.isVisible();

  //console.log("Step 1: Clicking on filter button to select region")
  const filterButton = page.locator('button.search-filter-dropdown');
  const filterMenu = page.locator('#search-filter-menu[style="display: flex;"]');
  await filterButton.waitFor({ state: 'visible' });
  await filterButton.click();
  await filterMenu.waitFor({ state: 'visible' });
  console.log('Clicking Filter menu...');


  // Loop through locations and validate counts
  const locationItems = page.locator("//*[@data-title='Location']/ul/li");
   await page.waitForTimeout(500);
  const locationCount = await locationItems.count();
  console.log(`Step 2: Verifying Location Filters...`);
  console.log(`Total location filters found: ${locationCount}`);
  for (let i = 0; i < locationCount; i++) {
    //console.log("Step 3: Closing Active filters if present")
    await page.waitForTimeout(1000)
      const closeButton = page.locator('#close_filter_btn');

    if (await closeButton.isVisible()) {
      const buttonHandle = await closeButton.elementHandle();
      await page.evaluate((el) => el.click(), buttonHandle);
    }

    const w = i + 1;
    const locationItem = locationItems.nth(i);
    await page.waitForTimeout(2000);
    await locationItem.waitFor({ state: 'visible' });
    await locationItem.scrollIntoViewIfNeeded();
    await locationItem.click();
     await page.waitForTimeout(1000);
    //const locationItems = page.locator(`//*[@data-title='Location']/ul/li[${w}]`);
    const locname = await locationItem.getAttribute('data-value');
    console.log(`[Location ${i + 1}] Location Name: ${locname}`);
    await page.waitForTimeout(5000);
    const counts = await page.locator("//*[@data-title='Location']/ul/li[" + w + "]//*[@class='coveo-facet-value-count']"); await page.waitForTimeout(1000);
    await page.waitForTimeout(5000);
    const countText = await counts.innerText();
    const countClean = countText.replace(/[+,]/g, '');
    console.log(`[Location ${i + 1}] Facet count: ${countClean}`);
    // Validate the total count
    const totalCount = await page.locator("//h6[contains(@class, 'search-info')]//span[contains(@class, 'coveo-highlight-total-count')]").innerText();
    const totalCountClean = totalCount.includes(",") ? totalCount.replace(",", "") : totalCount;
    console.log(`[Location ${i + 1}] Total results count: ${totalCountClean}`);
    expect(countClean).toBe(totalCountClean);
    console.log(`[Location ${i + 1}] Count matched successfully`);
  }
  // Close any active filters if they exist
  //console.log("Step 3: Closing Active filters if present")
  //await base.closeAllFilters();
   const closeButton = page.locator('#close_filter_btn');

    if (await closeButton.isVisible()) {
      const buttonHandle = await closeButton.elementHandle();
      await page.evaluate((el) => el.click(), buttonHandle);
    }
  await page.waitForTimeout(1000);
 
  console.log("Step 3: Verifying Type filter...")
  const isMenVisible = await filterMenu.isVisible();
  if (!isMenVisible) {
    // Only click if menu is NOT visible
    await filterButton.waitFor({ state: 'visible' });
    await filterButton.click();

    // Wait until menu is visible
    await filterMen.waitFor({ state: 'visible' });
    console.log('Filter menu was closed, clicked the button, and it is now open');
  } else {
    console.log('Filter menu is already open');
  }

  // Loop through Type Filters and validate counts
  const TypeItems = page.locator("//*[@data-title='Type']/ul/li");
  await page.waitForTimeout(500)
  const TypeCount = await TypeItems.count();
  console.log(`Total Type filters found: ${TypeCount}`);
  for (let i = 0; i < TypeCount; i++) {
   
   await page.waitForTimeout(500)
    const closeButton = page.locator('#close_filter_btn');

    if (await closeButton.isVisible()) {
      const buttonHandle = await closeButton.elementHandle();
      await page.evaluate((el) => el.click(), buttonHandle);
    }


    const w = i + 1;
    const TypeItem = TypeItems.nth(i);
    await TypeItem.click();
    await page.waitForTimeout(2000);
    const Typename = await TypeItem.getAttribute('data-value');
    console.log(`[Type ${i + 1}] Type Name: ${Typename}`);
    const TypecountText = await page.locator("//*[@data-title='Type']/ul/li[" + w + "]//*[@class='coveo-facet-value-count']").innerText();
    await page.waitForTimeout(3000);
    const TypecountClean = TypecountText.includes(",") || TypecountText.includes("+")
    ? TypecountText.replace(/[, +]/g, "")
    : TypecountText;
    //const TypecountClean = TypecountText.includes(",") ? TypecountText.replace(",", "") : TypecountText;
    console.log(`[Type ${i + 1}] Facet count: ${TypecountClean}`);
     await page.waitForTimeout(3000);
    const TypetotalCount = await page.locator("//h6[contains(@class, 'search-info')]//span[contains(@class, 'coveo-highlight-total-count')]").innerText();
     await page.waitForTimeout(3000);
    //const TypetotalCountClean = TypetotalCount.includes(",") ? TypetotalCount.replace(",", "") : TypetotalCount;
    const TypetotalCountClean = TypetotalCount.includes(",") || TypetotalCount.includes("+")
    ? TypetotalCount.replace(/[, +]/g, "")
    : TypetotalCount;
    await page.waitForTimeout(3000);
    console.log(`[Type ${i + 1}] Total results count: ${TypetotalCountClean}`);
    await page.waitForTimeout(3000);
    expect(TypecountClean).toBe(TypetotalCountClean);
    console.log(`[Type ${i + 1}] Count matched successfully`);
    await TypeItem.click();
     await page.waitForTimeout(500);
  }


  console.log("Step 4: Verifying category filter...")
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
  await page.waitForTimeout(500)
  const categoryCount = await categoryItems.count();
  console.log(`Total category filters found: ${categoryCount}`);
  for (let i = 0; i < categoryCount; i++) {
    const w = i + 1;
    await page.waitForTimeout(500)
      const closeButton = page.locator('#close_filter_btn');

    if (await closeButton.isVisible()) {
      const buttonHandle = await closeButton.elementHandle();
      await page.evaluate((el) => el.click(), buttonHandle);
    }

    const categoryItem = categoryItems.nth(i);
    await categoryItem.click();
    await page.waitForTimeout(3000);
    const categoryname = await categoryItem.getAttribute('data-value');
    console.log(`[Category ${i + 1}] Category Name: ${categoryname}`);
    const countText = await page.locator("//*[@data-title='Category']/ul/li[" + w + "]//*[@class='coveo-facet-value-count']").innerText();
    await page.waitForTimeout(3000);
    
    const countClean = countText.includes(",") || countText.includes("+")
    ? countText.replace(/[, +]/g, "")
    : countText;
   // const countClean = countText.includes(",") ? countText.replace(",", "") : countText;
    console.log(`[Category ${i + 1}] Facet count: ${countClean}`);
    const totalCount = await page.locator("//h6[contains(@class, 'search-info')]//span[contains(@class, 'coveo-highlight-total-count')]").innerText();
    await page.waitForTimeout(3000);
    const totalCountClean = totalCount.includes(",") || totalCount.includes("+")
    ? totalCount.replace(/[, +]/g, "")
    : totalCount;
   // const totalCountClean = totalCount.includes(",") ? totalCount.replace(",", "") : totalCount;
    console.log(`[Category ${i + 1}] Total results count: ${totalCountClean}`);
    await page.waitForTimeout(2000);
    expect(countClean).toBe(totalCountClean);
    console.log(`[Category ${i + 1}] Count matched successfully`);
    await categoryItem.click();
     await page.waitForTimeout(5000);
  }

 //Filter button closing
  console.log("Step 5: Validating the Search Input Field...")
  const filterbuttonHandle = await filterButton.elementHandle();
  await page.evaluate((el) => el.click(), filterbuttonHandle);
  const search = page.locator("//*[@class='magic-box-input']/input")
  await search.fill("Lake Gaston");
  const searchbtn = page.locator("//*[@class='CoveoSearchButton coveo-accessible-button']");
  searchbtn.click();
  console.log("Searching Keyword...")
  const count = page.locator(".coveo-highlight-total-count");
  await page.waitForTimeout(2000);;
  const totalResultsText = await count.innerText();
  const totalResults = Number(String(totalResultsText).match(/\d+/g).join(''));
  const resultsPerPage = 10;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  console.log(`Total results found: ${totalResults}`);
  console.log(`Results per page: ${resultsPerPage}`);
  console.log(`Total pages calculated: ${totalPages}`);

  const targetUrl =
    "http://www.dominionenergy.com/en/About/Lakes-and-Recreation/Lake-Gaston-and-Roanoke-Rapids-Lake-NC/Lake-Gaston-Water-Levels";

  let found = false;

  for (let pageIndex = 1; pageIndex <= totalPages && !found; pageIndex++) {

    // Wait for results on the current page
    const results = page.locator(".coveo-list-layout.CoveoResult");
    await results.first().waitFor({ timeout: 10000 });

    const resultCount = await results.count();

    for (let i = 0; i < resultCount; i++) {
      const href = await results
        .nth(i)
        .locator(".search-item-content a")
        .getAttribute("href");

      if (href === targetUrl) {
        console.log(`Target URL found on page ${pageIndex}, result ${i + 1}`);
        found = true;
        break;
      }
    }

    // Go to next page if not found
    if (!found && pageIndex < totalPages) {
      const nextButton = page.locator(".coveo-pager-next");

      if (await nextButton.isVisible()) {
        await page.waitForTimeout(2000);
        await nextButton.click();

        // Wait for page results to refresh
        await page.waitForLoadState("networkidle");
        await results.first().waitFor({ timeout: 10000 });
      } else {
        console.warn("Next page button not found.");
        break;
      }
    }
}

if (!found) {
  console.log("Target URL not found in search results.");
}


console.log("Step 6:Verifying Results per page correctly displaying...");
  await page.waitForSelector("//*[@id='coveo01cd4840']//*[@class='coveo-result-list-container coveo-list-layout-container']//*[@class='coveo-list-layout CoveoResult']", { timeout: 10000 });

  const displayedResults = await page.$$eval(".coveo-list-layout.CoveoResult", els => els.length);

  console.log(`Results displayed on page 1: ${displayedResults}`);


  const pager = page.locator('.coveo-pager-list');

  if (totalResults <= resultsPerPage) {
    // Assert all results are shown on the first page
    console.log("Validating all results are shown on page 1 and pagination is hidden.");
    expect(displayedResults).toBe(totalResults);

    // Verify pagination is not visible

    const isPagerVisible = await pager.isVisible();
    console.log(`Is pagination visible? ${isPagerVisible}`);
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

    await page.waitForSelector(".coveo-result-list-container.coveo-list-layout-container", { timeout: 10000 });
    const displayedResultsnow = await page.$$eval(".coveo-list-layout.CoveoResult", els => els.length);
    const expectedResults = (currentPage < totalPages) ? resultsPerPage : totalResults - resultsPerPage * (totalPages - 1);
    console.log(`Page ${currentPage} → Displayed results: ${displayedResultsnow}`);
    console.log(`Page ${currentPage} → Expected results: ${expectedResults}`);
    expect(displayedResultsnow).toBe(expectedResults);

    console.log(`Page ${currentPage} validated successfully`);
  }



});