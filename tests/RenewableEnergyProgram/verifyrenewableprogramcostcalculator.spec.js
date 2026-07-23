const { test } = require("@playwright/test");
const urls = require("../../config/urls.json");

const { BasePage } = require("../../pages/BasePage");
const {
  RenewableCalculatorPage,
} = require("../../pages/RenewableCalculatorPage");

test("Verify Renewable Program Cost Calculator Functionality", async ({
  page,
}) => {
  test.setTimeout(120000);

  const base = new BasePage(page);
  const calculator = new RenewableCalculatorPage(page);

  await base.handleFeedbackModal();

  await base.open(urls.base);

  await base.acceptCookies();

  await calculator.navigateToCalculator(base);

  await calculator.verifyCalculatorDisplayed();

  await calculator.selectProgram("recSelect");

  await calculator.selectOption("block");

  await calculator.clickCalculate();

  await calculator.verifyCalculationResults();

  console.log(
    "Calculated Bill Summary Price:",
    await calculator.getBillSummaryPrice(),
  );
});
