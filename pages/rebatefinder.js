const { expect } = require("@playwright/test");

class rebatefinder {
  constructor(page) {
    this.page = page;

    this.locationMenu = page.locator("//a[text()='Location']");
    this.searchIcon = page.locator("//button[@class='search']");
    this.searchInput = page.locator("#search-box-input");

    this.saveEnergyResult = page.locator(
      "//a[@class='CoveoResultLink' and .//h4[normalize-space()='Save Energy']]",
    );

    this.rebateFinderButton = page.locator("#collapsible-btn");

    // Coveo search
    this.coveoSearchFilter = page.locator("#coveob97d0067");
    this.defaultLocationFilter = page.locator("#Virginia.filter-selected");

    this.coveoSearchInput = page.locator(
      ".CoveoOmnibox input[aria-label='Search']",
    );

    // Results
    this.resultsCount = page.locator(".coveo-highlight-total-count");

    this.searchResults = page.locator(".coveo-list-layout.CoveoResult");

    // Pagination
    this.coveoPager = page.locator(".CoveoPager");

    this.activePage = page.locator(".coveo-pager-list-item.coveo-active");

    // Results per page
    this.resultsPerPage = page.locator(
      ".CoveoResultsPerPage .coveo-results-per-page-list-item.coveo-active",
    );

    this.resultsPerPageText = page.locator(
      ".CoveoResultsPerPage .coveo-results-per-page-list-item.coveo-active span",
    );
  }

  async navigateToSaveEnergy(base) {
    await base.open(require("../config/urls.json").base);

    await base.acceptCookies();

    await expect(this.locationMenu).toBeVisible();

    await this.locationMenu.click();

    await base.handleLocationVirginia();

    await this.searchIcon.click();

    await this.searchInput.fill("save energy");

    await this.searchInput.press("Enter");

    await base.CoveoresultIsVisible();

    await this.saveEnergyResult.scrollIntoViewIfNeeded();

    await this.saveEnergyResult.click();

    await this.page.waitForTimeout(2000);

    await this.page.waitForLoadState("load");

    await expect(this.page).toHaveURL(/\/virginia\/save-energy/);
  }

  async verifyRebateFinderVisible() {
    await this.rebateFinderButton.scrollIntoViewIfNeeded();

    await expect(this.rebateFinderButton).toBeVisible();
  }

  async expandRebateFinder() {
    await expect(this.rebateFinderButton).not.toHaveClass(/show/);

    await this.rebateFinderButton.click();

    await expect(this.rebateFinderButton).toHaveClass(/show/);
  }

  async collapseRebateFinder() {
    await this.rebateFinderButton.click();

    await expect(this.rebateFinderButton).not.toHaveClass(/show/);
  }

  async verifyCoveoSearchAndDefaultLocation() {
    await this.rebateFinderButton.click();

    await expect(this.rebateFinderButton).toHaveClass(/show/);

    await expect(this.coveoSearchFilter).toBeVisible();

    await expect(this.defaultLocationFilter).toBeVisible();

    await expect(this.defaultLocationFilter).toHaveClass(/filter-selected/);
  }

  async verifySearchResultsAndResultsPerPage() {
    // Search
    await expect(this.coveoSearchInput).toBeVisible();

    await this.coveoSearchInput.fill("rebate");
    await this.coveoSearchInput.press("Enter");

    // Verify total result count
    await expect(this.resultsCount).toBeVisible();

    const countText = await this.resultsCount.innerText();

    console.log(`Total results text: ${countText}`);

    const countMatch = countText.match(/\d+/);

    expect(countMatch).not.toBeNull();

    const totalResults = Number(countMatch[0]);

    console.log(`Total results: ${totalResults}`);

    expect(totalResults).toBeGreaterThan(0);

    // Verify results per page
    await expect(this.resultsPerPageText).toBeVisible();

    const resultsPerPage = Number(await this.resultsPerPageText.innerText());

    console.log(`Results per page: ${resultsPerPage}`);

    expect(resultsPerPage).toBe(10);

    // Function to count visible results
    const getVisibleResultCount = async () => {
      const results = this.searchResults;

      const count = await results.count();

      let visibleCount = 0;

      for (let i = 0; i < count; i++) {
        if (await results.nth(i).isVisible()) {
          visibleCount++;
        }
      }

      return visibleCount;
    };

    // Wait for first page results
    await expect(this.searchResults.first()).toBeVisible();

    let displayedResults = await getVisibleResultCount();

    console.log(`Page 1 results: ${displayedResults}`);

    const totalPages = Math.ceil(totalResults / resultsPerPage);

    console.log(`Total pages: ${totalPages}`);

    // Single page validation

    if (totalPages === 1) {
      expect(displayedResults).toBe(totalResults);

      await expect(this.coveoPager).not.toBeVisible();

      console.log("Pagination is not displayed");

      return;
    }

    // Pagination validation

    await expect(this.coveoPager).toBeVisible();

    expect(displayedResults).toBe(resultsPerPage);

    // Validate remaining pages

    for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
      console.log(`Navigating to page ${currentPage}`);

      const pageButton = this.page.getByRole("button", {
        name: `Page ${currentPage}`,
      });

      await expect(pageButton).toBeVisible();

      await pageButton.click();

      // Wait for selected page

      await expect(pageButton).toHaveAttribute("aria-current", "page");

      await expect(this.searchResults.first()).toBeVisible();

      const pageResultCount = await getVisibleResultCount();

      const expectedCount =
        currentPage < totalPages
          ? resultsPerPage
          : totalResults % resultsPerPage;

      console.log(
        `Page ${currentPage}: Displayed ${pageResultCount}, Expected ${expectedCount}`,
      );

      expect(pageResultCount).toBe(expectedCount);
    }

    console.log("Pagination validation completed successfully");
  }

  async verifyAllFacetCountsMatchResultCount() {
    const resultCountLocator = this.page.locator(
      "//span[contains(@class,'coveo-highlight-total-count')]",
    );

    const getResultCount = async () => {
      await expect(resultCountLocator).toBeVisible();

      return Number((await resultCountLocator.innerText()).replace(/\D/g, ""));
    };

    const waitForResultCount = async (expectedCount) => {
      await this.page.waitForFunction(
        (expected) => {
          const element = document.querySelector(
            "span.coveo-highlight-total-count",
          );

          if (!element) {
            return false;
          }

          const count = Number(element.innerText.replace(/\D/g, ""));

          return count === expected;
        },
        expectedCount,
        {
          timeout: 30000,
        },
      );
    };

    const getFacetList = async () => {
      const facetValues = this.page.locator(
        "//span[@class='coveo-facet-value-caption']",
      );

      const facetCounts = this.page.locator(
        "//span[@class='coveo-facet-value-count']",
      );

      const facets = [];

      const totalFacets = await facetValues.count();

      for (let i = 0; i < totalFacets; i++) {
        facets.push({
          name: (await facetValues.nth(i).innerText()).trim(),

          count: Number(await facetCounts.nth(i).innerText()),
        });
      }

      return facets;
    };

    // --------------------------------------------------
    // Verify default selected facet
    // --------------------------------------------------

    const selectedFacet = this.page.locator("li.filter-selected");

    await expect(selectedFacet).toBeVisible();

    const selectedFacetName = await selectedFacet.getAttribute("id");

    const defaultResultCount = await getResultCount();

    console.log(`Default selected facet: ${selectedFacetName}`);

    console.log(`Default result count: ${defaultResultCount}`);

    // Find expected default facet count

    const defaultFacetLocator = this.page.locator(
      `//span[@class='coveo-facet-value-caption' and normalize-space()='${selectedFacetName}']`,
    );

    const defaultFacetParent = defaultFacetLocator.locator("xpath=..");

    const defaultExpectedCount = Number(
      await defaultFacetParent
        .locator("//span[@class='coveo-facet-value-count']")
        .innerText(),
    );

    console.log(
      `Default Facet -> Expected: ${defaultExpectedCount}, Actual: ${defaultResultCount}`,
    );

    expect(defaultResultCount).toBe(defaultExpectedCount);

    // --------------------------------------------------
    // Remove default selected facet
    // --------------------------------------------------

    await selectedFacet.locator("button.close-pill-btn").click();

    await this.page.waitForLoadState("networkidle");

    await expect(this.page.locator("li.filter-selected")).toHaveCount(0);

    console.log("Default selected facet removed");

    // --------------------------------------------------
    // Get all facets after removing default filter
    // --------------------------------------------------

    const facets = await getFacetList();

    console.log(`Total facets available: ${facets.length}`);

    // --------------------------------------------------
    // Validate every facet
    // --------------------------------------------------

    for (const facet of facets) {
      console.log(`Selecting facet: ${facet.name}`);

      console.log(`Expected count: ${facet.count}`);

      const facetLocator = this.page.locator(
        `//span[@class='coveo-facet-value-caption' and normalize-space()='${facet.name}']`,
      );

      await expect(facetLocator).toBeVisible();

      await facetLocator.click();

      // Wait until Coveo result count matches facet count

      await waitForResultCount(facet.count);

      const actualCount = await getResultCount();

      console.log(
        `${facet.name} -> Expected: ${facet.count}, Actual: ${actualCount}`,
      );

      expect(actualCount).toBe(facet.count);

      // Remove selected facet before next iteration

      const activeFacet = this.page.locator("li.filter-selected");

      await activeFacet.locator("button.close-pill-btn").click();

      await this.page.waitForLoadState("networkidle");

      await expect(activeFacet).toHaveCount(0, {
        timeout: 10000,
      });
    }

    console.log("All facets validated successfully");
  }

  async verifyNoresultsMessage() {
    await this.coveoSearchInput.fill("xyzabc123");
    await this.coveoSearchInput.press("Enter");
    const noResultsMessage = this.page.locator(
      ".coveo-query-summary-no-results-string",
    );
    await expect(noResultsMessage).toBeVisible();
    console.log("No results message:", await noResultsMessage.innerText());
  }
}
module.exports = { rebatefinder };
