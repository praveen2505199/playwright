const { test } = require("@playwright/test");

const { BasePage } = require("../pages/basePage");
const { ErrorPage } = require("../pages/ErrorPage");

test("Verify 404 Error Page Handling for Random Invalid URL", async ({
  page,
}) => {
  test.setTimeout(120000);

  const base = new BasePage(page);
  const errorPage = new ErrorPage(page);

  await base.handleFeedbackModal();

  await base.open();

  await base.acceptCookies();

  const result = await errorPage.navigateToRandomInvalidUrl();

  console.log("Test URL:", result.url);
  console.log("Response Status:", result.status);

  await errorPage.verify404Page(result.status);
});
