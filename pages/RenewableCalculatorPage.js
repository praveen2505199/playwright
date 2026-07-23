const { expect } = require("@playwright/test");

class RenewableCalculatorPage {
  constructor(page) {
    this.page = page;

    this.searchIcon = page.locator("//button[@class='search']");
    this.searchInput = page.locator("#search-box-input");
    this.searchResult = page.locator(
      "//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Renewable Programs Cost Calculator']",
    );

    this.calculator = page.locator(
      "//section[@id='energy_calculator']//div[@id='ecalc_main']",
    );

    this.programDropdown = page.locator(
      "//select[@id='calc_program inputLabel-program']",
    );
    this.optionDropdown = page.locator(
      "//select[@id='calc_option inputLabel-option']",
    );

    this.calculateButton = page.locator(
      "//button[contains(text(),'Calculate') and not(@disabled)]",
    );

    this.billSummaryPrice = page.locator(
      "//span[contains(@class,'bill-summary-price')]",
    );
    this.quizButton = page.locator(
      "//button[contains(text(),'Take The Quiz')]",
    );
    this.recalculateButton = page.locator(
      "//a[h6[contains(text(),'Re-calculate')]]",
    );
  }

  async navigateToCalculator(base) {
    await this.searchIcon.click();

    await base.handleLocationVirginia();

    await this.searchIcon.click();

    await expect(this.searchInput).toBeVisible();

    await this.searchInput.fill("Renewable Programs Cost Calculator");

    await this.searchInput.press("Enter");

    await base.CoveoresultIsVisible();

    await expect(this.searchResult).toBeVisible();

    await this.searchResult.click();

    await expect(this.page).toHaveURL(
      /renewable-energy-programs\/renewable-energy-101\/calculator/,
    );
  }

  async verifyCalculatorDisplayed() {
    await this.calculator.scrollIntoViewIfNeeded();

    await expect(this.calculator).toBeVisible();
  }

  async selectProgram(program) {
    await this.programDropdown.selectOption(program);
  }

  async selectOption(option) {
    await this.optionDropdown.selectOption(option);
  }

  async clickCalculate() {
    await this.calculateButton.click();
  }

  async getBillSummaryPrice() {
    return (await this.billSummaryPrice.innerText()).trim();
  }

  async verifyCalculationResults() {
    await expect(this.billSummaryPrice).toBeVisible();

    await expect(this.quizButton).toBeVisible();

    await expect(this.recalculateButton).toBeVisible();
  }
}

module.exports = { RenewableCalculatorPage };
