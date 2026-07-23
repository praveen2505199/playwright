const { expect } = require("@playwright/test");

class CommunityActionResourcesPage {
  constructor(page) {
    this.page = page;

    // Search
    this.searchIcon = page.locator("//button[@class='search']");
    this.searchInput = page.locator("#search-box-input");
    this.searchResult = page.locator(
      "//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Community Action Resources']",
    );

    // Community Action Page
    this.searchBar = page.locator("//*[@class='dt-search']/input");
    this.resultsTable = page.locator(
      "//table[@id='datatablesAssistanceAgencies']/tbody/tr",
    );
    this.table = page.locator("#datatablesAssistanceAgencies");
    this.headers = this.table.locator("thead tr th");

    // Pagination
    this.infoText = page.locator("#datatablesAssistanceAgencies_info");
    this.prevBtn = page.locator(
      "//nav[@aria-label='pagination']//button[contains(@class,'previous')]",
    );
    this.nextBtn = page.locator(
      "//nav[@aria-label='pagination']//button[contains(@class,'next')]",
    );
  }

  async openSearch() {
    await expect(this.searchIcon).toBeVisible();
    await this.searchIcon.click();
  }

  async searchCommunityActionResource(keyword) {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(keyword);
    await this.searchInput.press("Enter");
    await this.page.waitForLoadState("load");
  }

  async openCommunityActionResult() {
    await expect(this.searchResult).toBeVisible({ timeout: 20000 });
    await this.searchResult.click();
  }

  async verifyCommunityActionPage() {
    await expect(this.page).toHaveURL(/community-action-resources/);
  }

  async searchCounty(county) {
    await this.searchBar.scrollIntoViewIfNeeded();
    await this.searchBar.fill(county);
    await this.page.waitForTimeout(1000);
  }

  async verifySearchResults() {
    const count = await this.resultsTable.count();
    console.log(`Rows Found : ${count}`);
    expect(count).toBeGreaterThan(0);
  }

  async verifyTableHeaders() {
    const expectedHeaders = ["County", "Agency", "Website", "Phone"];

    const actualHeaders = await this.headers.allTextContents();

    expectedHeaders.forEach((header, index) => {
      expect(actualHeaders[index].trim()).toBe(header);
    });

    console.log(actualHeaders);
  }

  async verifyPagination() {
    const info = await this.infoText.textContent();

    const match = info.match(/of (\d+) results/);

    expect(match).not.toBeNull();

    const totalResults = parseInt(match[1]);

    const resultsPerPage = 10;

    const totalPages = Math.ceil(totalResults / resultsPerPage);

    let displayedRows = await this.resultsTable.count();

    if (totalResults <= resultsPerPage) {
      expect(displayedRows).toBe(totalResults);

      const functionalButtons = await this.page
        .locator(
          "//nav[@aria-label='pagination']//button[contains(@class,'dt-paging-button')]",
        )
        .filter({
          has: this.page.locator(':not([aria-disabled="true"])'),
        })
        .count();

      expect(functionalButtons).toBe(0);

      return;
    }

    await expect(this.prevBtn).toHaveClass(/disabled/);

    await expect(this.nextBtn).not.toHaveClass(/disabled/);

    expect(displayedRows).toBe(Math.min(resultsPerPage, totalResults));

    for (let pageNo = 2; pageNo <= totalPages; pageNo++) {
      const pageBtn = this.page.locator(
        `//nav[@aria-label='pagination']//button[text()='${pageNo}']`,
      );

      await pageBtn.scrollIntoViewIfNeeded();

      await pageBtn.click();

      await this.page.waitForTimeout(1000);

      displayedRows = await this.resultsTable.count();

      const expected =
        pageNo < totalPages
          ? resultsPerPage
          : totalResults - resultsPerPage * (totalPages - 1);

      expect(displayedRows).toBe(expected);

      if (pageNo === totalPages) {
        await expect(this.nextBtn).toHaveClass(/disabled/);
      } else {
        await expect(this.nextBtn).not.toHaveClass(/disabled/);
      }

      await expect(this.prevBtn).not.toHaveClass(/disabled/);
    }
  }
}

module.exports = { CommunityActionResourcesPage };
