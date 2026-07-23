const { expect } = require("@playwright/test");

class OurStoriesPage {
  constructor(page) {
    this.page = page;

    // Search
    this.searchIcon = page.locator("//button[@class='search']");
    this.searchInput = page.locator("#search-box-input");
    this.searchResult = page.locator(
      "//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Our Stories']",
    );

    // Summary
    this.searchSummary = page.locator(".CoveoQuerySummary");

    // Filter
    this.filterButton = page.locator("button.search-filter-dropdown");
    this.filterMenu = page.locator(
      "#search-filter-menu[style='display: flex;']",
    );
    this.closeFilterButton = page.locator("#close_filter_btn");

    // Pagination
    this.totalCount = page.locator(".coveo-highlight-total-count");
    this.resultCards = page.locator(".coveo-card-layout.CoveoResult");
    this.resultContainer = page.locator(
      ".coveo-result-list-container.coveo-card-layout-container",
    );
    this.pager = page.locator(".coveo-pager-list");
  }

  async searchOurStories(base) {
    await expect(this.searchIcon).toBeVisible();
    await this.searchIcon.click();

    await base.handleRandomLocationModal();

    await this.searchIcon.click();

    await this.searchInput.fill("Our Stories");
    await this.searchInput.press("Enter");

    await this.page.waitForLoadState("load");
    await base.CoveoresultIsVisible();

    await this.searchResult.click();

    await this.page.waitForLoadState("load");
  }

  async verifyPageLoaded() {
    expect(this.page.url()).toContain("/about/our-stories");
    await expect(this.searchSummary).toBeVisible();
  }

  async openFilter() {
    if (!(await this.filterMenu.isVisible())) {
      await this.filterButton.click();
      await this.filterMenu.waitFor({ state: "visible" });
    }
  }

  async closeFilter() {
    if (await this.closeFilterButton.isVisible()) {
      const handle = await this.closeFilterButton.elementHandle();
      await this.page.evaluate((el) => el.click(), handle);
    }
  }

  async validateLocationFilters() {
    const locationItems = this.page.locator(
      "//*[@data-title='Location']/ul/li",
    );
    const count = await locationItems.count();

    console.log(`Total Location Filters : ${count}`);

    for (let i = 0; i < count; i++) {
      const item = locationItems.nth(i);

      await item.scrollIntoViewIfNeeded();
      await item.click();

      await this.page.waitForLoadState("networkidle");

      const facet = await this.page
        .locator(
          `//*[@data-title='Location']/ul/li[${i + 1}]//*[@class='coveo-facet-value-count']`,
        )
        .innerText();

      const total = await this.page
        .locator(
          "//h6[contains(@class,'search-info')]//span[contains(@class,'coveo-highlight-total-count')]",
        )
        .innerText();

      const facetCount = facet.replace(/,|\+/g, "");
      const totalCount = total.replace(/,|\+/g, "");

      expect(facetCount).toBe(totalCount);

      console.log(`Location ${i + 1} validated`);
    }
  }

  async validateCategoryFilters() {
    const categoryItems = this.page.locator(
      "//*[@data-title='Category']/ul/li",
    );
    const categoryCount = await categoryItems.count();

    console.log(`Total Categories : ${categoryCount}`);

    for (let i = 0; i < categoryCount; i++) {
      const categoryItem = categoryItems.nth(i);

      // Read facet count BEFORE selecting the filter
      const facetCount = (
        await categoryItem.locator(".coveo-facet-value-count").innerText()
      )
        .replace(/,|\+/g, "")
        .trim();

      const categoryName = await categoryItem.getAttribute("data-value");

      console.log(`Category : ${categoryName}`);
      console.log(`Facet Count : ${facetCount}`);

      // Click category
      await categoryItem.click();

      // Wait until search results are refreshed
      await this.page.waitForLoadState("networkidle");

      // Wait until the total count becomes the expected value
      await expect(async () => {
        const total = (
          await this.page
            .locator(
              "//h6[contains(@class,'search-info')]//span[contains(@class,'coveo-highlight-total-count')]",
            )
            .innerText()
        )
          .replace(/,|\+/g, "")
          .trim();

        expect(total).toBe(facetCount);
      }).toPass({
        timeout: 10000,
      });

      console.log(`${categoryName} validated successfully`);

      // Remove the filter
      await categoryItem.click();

      // Wait for search results to refresh again
      await this.page.waitForLoadState("networkidle");
      await this.closeFilter();
    }
  }

  async validatePagination() {
    const totalText = await this.totalCount.innerText();
    const totalResults = Number(totalText.match(/\d+/g).join(""));

    const perPage = 10;
    const totalPages = Math.ceil(totalResults / perPage);

    await this.resultContainer.waitFor();

    const firstPageResults = await this.resultCards.count();

    if (totalResults <= perPage) {
      expect(firstPageResults).toBe(totalResults);
      expect(firstPageResults).toBe(totalResults);
      return;
    }

    expect(firstPageResults).toBe(perPage);

    for (let pageNo = 2; pageNo <= totalPages; pageNo++) {
      const buttons = await this.page
        .locator(".coveo-pager-list li:not(.coveo-pager-disabled) span")
        .all();

      let target;

      for (const btn of buttons) {
        if ((await btn.innerText()).trim() === pageNo.toString()) {
          target = btn;
          break;
        }
      }

      if (!target) {
        throw new Error(`Page ${pageNo} not found`);
      }

      await target.click();

      await this.page.waitForLoadState("networkidle");

      const displayed = await this.resultCards.count();

      const expected =
        pageNo < totalPages
          ? perPage
          : totalResults - perPage * (totalPages - 1);

      expect(displayed).toBe(expected);

      console.log(`Page ${pageNo} validated`);
    }
  }
}

module.exports = { OurStoriesPage };
