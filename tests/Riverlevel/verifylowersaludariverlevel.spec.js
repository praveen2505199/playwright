const { test, expect } = require("@playwright/test");
const urls = require("../../config/urls.json");
const { BasePage } = require("../../pages/basePage");
const { lakepage } = require("../../pages/lakepage");

test("Verify Lower Saluda River Level Date Update", async ({
  page,
  request,
}) => {
  test.setTimeout(180000);
  const base = new BasePage(page);
  const lake = new lakepage(page, request);

  await base.handleFeedbackModal();

  await base.open(urls.base);

  await base.acceptCookies();

  await lake.navigateToLowerSaludaPage(base);

  await lake.verifyAcceptButtonDisplay();

  await lake.getLowerSaludaUIDate();

  await lake.verifyTimestampHasTodaysDateInLowerSaluda();

  await lake.verifyLowerSaludaRiverLevelDateAPI();

  await lake.verifyLowerSaludaRiverLevelAPI();
});
