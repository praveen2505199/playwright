const { test } = require("@playwright/test");
const urls = require("../../config/urls.json");
const { BasePage } = require("../../pages/basePage");
const { SmartPricingPlanPage } = require("../../pages/SmartPricingPlanPage");

test("Verify Smart Pricing Plan Calendar Month And Events For Business", async ({
  page,
}) => {
  test.setTimeout(180000);

  const base = new BasePage(page);

  const smartPage = new SmartPricingPlanPage(page);
  await base.open(urls.base);
  await base.handleFeedbackModal();
  await base.acceptCookies();

  await smartPage.navigateToSmartPricingPlan(base);
  await page.waitForLoadState("load");

  await smartPage.verifyCalendar(2, "Business");
  await smartPage.verifyEvents(2, "Business");
});
