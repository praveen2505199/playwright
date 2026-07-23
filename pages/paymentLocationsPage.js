const { expect } = require("@playwright/test");

class PaymentLocationsPage {
  constructor(page) {
    this.page = page;

    this.searchIcon = page.locator("//button[@class='search']");
    this.searchInput = page.locator("#search-box-input");

    this.paymentLocationsResult = page.locator(
      "//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Payment Locations']",
    );

    this.tableSearch = page.locator("//*[@class='dt-search']/input");

    this.resultsTable = page.locator("//table[@id='DataTables_Table_0']");

    this.tableInfo = page.locator("//div[@id='DataTables_Table_0_info']");

    this.rows = page.locator("//table[@id='DataTables_Table_0']/tbody/tr");

    this.pagination = page.locator("//nav[@aria-label='pagination']");

    this.previousButton = page.locator(
      "//nav[@aria-label='pagination']//button[contains(@class,'previous')]",
    );

    this.nextButton = page.locator(
      "//nav[@aria-label='pagination']//button[contains(@class,'next')]",
    );
  }

  async searchPaymentLocations(base) {
    await expect(this.searchIcon).toBeVisible();

    await this.searchIcon.click();

    await base.handleLocationSouthCarolina();

    await this.searchIcon.click();

    await expect(this.searchInput).toBeVisible();

    await this.searchInput.fill("Payment Locations");

    await this.searchInput.press("Enter");

    await this.page.waitForLoadState("load");

    await base.CoveoresultIsVisible();

    await expect(this.paymentLocationsResult).toBeVisible({ timeout: 10000 });

    await this.paymentLocationsResult.click();

    await this.page.waitForLoadState("load");
  }

  async verifyPaymentLocationsPage() {
    const currentUrl = this.page.url();

    console.log("Current URL:", currentUrl);

    expect(currentUrl).toContain(
      "/south-carolina/paying-my-bill/pay-my-bill/payment-locations",
    );

    console.log("Payment Locations page loaded successfully");
  }

  async searchLocationInTable() {
    await this.tableSearch.waitFor({
      state: "visible",
    });

    await expect(this.tableSearch).toBeVisible();

    await this.tableSearch.fill("Street");

    await expect(this.resultsTable).toBeVisible();

    console.log("Search results displayed");
  }

  async verifyPagination() {
    await this.page.reload();

    await this.page.waitForLoadState("networkidle");

    const totalResultsText = await this.tableInfo.innerText();

    const match = totalResultsText.match(/of (\d+) entries/);

    if (!match) {
      throw new Error("Could not extract total result count");
    }

    const totalResults = parseInt(match[1]);

    const resultsPerPage = 10;

    const totalPages = Math.ceil(totalResults / resultsPerPage);

    const lastPageResults = totalResults % resultsPerPage;

    console.log(`Total Results: ${totalResults}`);
    console.log(`Total Pages: ${totalPages}`);

    const countRows = async () => {
      return await this.rows.count();
    };

    const displayedResults = await countRows();

    if (totalResults <= resultsPerPage) {
      expect(displayedResults).toBe(totalResults);

      return;
    }

    let previousClass = await this.previousButton.getAttribute("class");

    let nextClass = await this.nextButton.getAttribute("class");

    expect(previousClass).toContain("disabled");

    expect(nextClass).not.toContain("disabled");

    for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
      const pageButton = this.page.locator(
        `//nav[@aria-label='pagination']//button[text()='${currentPage}']`,
      );

      await pageButton.scrollIntoViewIfNeeded();

      await pageButton.click();

      await this.page.waitForLoadState("networkidle");

      const actualCount = await countRows();

      const expectedCount =
        currentPage < totalPages
          ? resultsPerPage
          : totalResults - resultsPerPage * (totalPages - 1);

      expect(actualCount).toBe(expectedCount);

      previousClass = await this.previousButton.getAttribute("class");

      nextClass = await this.nextButton.getAttribute("class");

      if (currentPage === totalPages) {
        expect(nextClass).toContain("disabled");

        console.log(`Last page ${currentPage} rows: ${actualCount}`);
      } else {
        expect(nextClass).not.toContain("disabled");
      }

      expect(previousClass).not.toContain("disabled");
    }

    console.log("Pagination validation completed successfully");
  }
}

module.exports = { PaymentLocationsPage };
