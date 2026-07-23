const { test } = require("@playwright/test");

const urls = require("../config/urls.json");
const { BasePage } = require("../pages/basePage");
const { ElectricLoadPage } = require("../pages/electricLoadPage");

test("Verify Electric Load Data with Date Validation for Current Month and Previous Days", async ({
  page,
}) => {
  test.setTimeout(120000);

  const base = new BasePage(page);
  const electricLoad = new ElectricLoadPage(page);

  // Handle feedback modal if displayed
  await base.handleFeedbackModal();

  // Open Electric Load page
  await base.open(urls.electricLoadData);

  await base.acceptCookies();

  await page.waitForLoadState("load");

  // Search and open Electric Transmission Access
  await electricLoad.searchElectricTransmissionAccess(base);

  // Open PJM file in new tab
  const newPage = await electricLoad.openLoadDataFile();

  // Validate dates
  await electricLoad.verifyDateValidation(newPage);
});
