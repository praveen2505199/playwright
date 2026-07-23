const { test } = require("@playwright/test");

const urls = require("../config/urls.json");

const { BasePage } = require("../pages/basePage");
const {
  WasteHeatTreatmentFacilityPage,
} = require("../pages/WasteHeatTreatmentFacilityPage");

test("Verify Waste Heat Treatment Facility Page And Table Data", async ({
  page,
}) => {
  test.setTimeout(180000);

  const base = new BasePage(page);

  const wasteHeat = new WasteHeatTreatmentFacilityPage(page);

  await base.handleFeedbackModal();

  await base.open(urls.base);

  await base.acceptCookies();

  await wasteHeat.navigateToWasteHeatTreatmentPage(base);

  await wasteHeat.verifyTableData();
});
