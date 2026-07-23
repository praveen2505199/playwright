const { test, expect } = require("@playwright/test");
const urls = require("../../config/urls.json");
const { BasePage } = require("../../pages/basePage");
const { lakepage } = require("../../pages/lakepage");

test("Verify Lake Murray River Level Date Update", async ({
  page,
  request,
}) => {
  test.setTimeout(120000);
  const base = new BasePage(page);
  const lake = new lakepage(page, request);

  await base.handleFeedbackModal();

  await base.open(urls.base);

  await base.acceptCookies();

  await lake.navigateToLakeMurrayPage(base);

  await lake.getUIDate();

  await lake.verifyTimestampHasTodaysDate();

  await lake.verifyRiverLevelDateAPI();

  await lake.verifyRiverLevelAPI();
});
