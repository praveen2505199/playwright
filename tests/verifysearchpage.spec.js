const { test } = require("@playwright/test");

const urls = require("../config/urls.json");

const { BasePage } = require("../pages/basePage");
const { SearchPage } = require("../pages/searchPage");

test("Validate Search Filters And Pagination", async ({ page }) => {
  test.setTimeout(300000);

  const base = new BasePage(page);
  const search = new SearchPage(page);

  await base.handleFeedbackModal();

  await base.open(urls.base + urls.search);

  await base.acceptCookies();

  await page.waitForLoadState("load");

  await page.waitForTimeout(2000);

  await search.openFilters();

  console.log("Location Filter");

  await search.verifyFacet("Location");

  console.log("Type Filter");

  await search.verifyFacet("Type");

  console.log("Category Filter");

  await search.verifyFacet("Category");

  await search.search("Lake Gaston");

  await search.verifyTargetUrl(
    "http://www.dominionenergy.com/en/About/Lakes-and-Recreation/Lake-Gaston-and-Roanoke-Rapids-Lake-NC/Lake-Gaston-Water-Levels",
  );

  await search.verifyPagination();
});
