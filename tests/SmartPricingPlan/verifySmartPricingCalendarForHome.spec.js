const { test } = require("@playwright/test");
const urls = require("../../config/urls.json");

const { BasePage } = require("../../pages/basePage");
const { SmartPricingPlanPage } = require("../../pages/SmartPricingPlanPage");

test("Verify Smart Pricing Plan Calendar Month And Events For Home", async ({
  page,
}) => {
  test.setTimeout(180000);

  const base = new BasePage(page);

  const smartPage = new SmartPricingPlanPage(page);
  await base.open(urls.base);

  await base.acceptCookies();
  await base.handleFeedbackModal();
  await smartPage.navigateToSmartPricingPlan(base);
  await page.waitForLoadState("load");

  await smartPage.verifyCalendar(1, "Home");
  await smartPage.verifyEvents(1, "Home");
});
