const { test } = require("@playwright/test");
const urls = require("../config/urls.json");

const { BasePage } = require("../pages/basePage");
const { OurStoriesPage } = require("../pages/ourStoriesPage");

test("Verify Our Stories Page Functionality with Search, Filters and Pagination", async ({
  page,
}) => {
  test.setTimeout(210000);

  const base = new BasePage(page);
  const stories = new OurStoriesPage(page);

  await base.handleFeedbackModal();

  console.log("Open Home Page");

  await base.open(urls.base);
  await base.acceptCookies();

  console.log("Search Our Stories");

  await stories.searchOurStories(base);

  console.log("Verify Our Stories page");

  await stories.verifyPageLoaded();

  console.log("Validate Location Filters");

  await stories.openFilter();
  await stories.validateLocationFilters();

  console.log("Close Active Filters");

  await stories.closeFilter();

  console.log("Validate Category Filters");

  await stories.openFilter();
  await stories.validateCategoryFilters();

  //await stories.filterButton.click();

  console.log("Validate Pagination");

  await stories.validatePagination();
});
