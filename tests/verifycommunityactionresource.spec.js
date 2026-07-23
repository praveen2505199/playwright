const { test } = require("@playwright/test");
const urls = require("../config/urls.json");

const { BasePage } = require("../pages/basePage");
const {
  CommunityActionResourcesPage,
} = require("../pages/communityActionResourcesPage");

test("Verify Community Action Resource Search and Pagination Functionality", async ({
  page,
}) => {
  test.setTimeout(180000);

  const base = new BasePage(page);
  const community = new CommunityActionResourcesPage(page);

  await base.handleFeedbackModal();

  await base.open(urls.base);

  await base.acceptCookies();

  await page.waitForLoadState("load");

  await community.openSearch();

  await base.handleLocationSouthCarolina();

  await community.openSearch();

  await community.searchCommunityActionResource("Community Action Resources");

  await base.CoveoresultIsVisible();

  await community.openCommunityActionResult();

  await community.verifyCommunityActionPage();

  await community.searchCounty("Abbeville");

  await community.verifySearchResults();

  await community.verifyTableHeaders();

  await community.verifyPagination();

  await community.searchCounty("Aiken");

  await community.verifySearchResults();

  await community.verifyTableHeaders();

  await community.verifyPagination();
});
