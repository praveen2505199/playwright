const { test } = require("@playwright/test");

const urls = require("../config/urls.json");

const { BasePage } = require("../pages/BasePage");
const { BreadcrumbPage } = require("../pages/BreadcrumbPage");

test("Breadcrumb Navigation: Verifying Correct Path and Functionality", async ({
  page,
}) => {
  test.setTimeout(180000);

  const base = new BasePage(page);

  const breadcrumb = new BreadcrumbPage(page);

  await base.open(urls.base);

  await base.acceptCookies();

  await base.handleFeedbackModal();

  await breadcrumb.navigateToBudgetBilling(base);

  await breadcrumb.verifyBreadcrumbDisplayed();

  await breadcrumb.verifyBreadcrumbNavigation(
    "https://www.dominionenergy.com",
    urls.breadcrumbPage,
  );

  await breadcrumb.verifyBreadcrumbDisplayed();
});
