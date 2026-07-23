const { test } = require("@playwright/test");
const urls = require("../config/urls.json");
const { BasePage } = require("../pages/basePage");
const { FeedbackPage } = require("../pages/feedbackPage");

test("Verify Feedback Button Modal Visibility", async ({ page }) => {
  test.setTimeout(120000);

  const base = new BasePage(page);
  const feedbackPage = new FeedbackPage(page);

  // Open application
  await base.open(urls.base);
  await base.acceptCookies();

  await page.waitForLoadState("load");

  // Open feedback modal
  await feedbackPage.openFeedbackModal();

  // Verify modal
  await feedbackPage.verifyFeedbackModalVisible();
});
