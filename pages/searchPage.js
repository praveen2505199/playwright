const { expect } = require("@playwright/test");

class SearchPage {
  constructor(page) {
    this.page = page;

    this.filterButton = page.locator("button.search-filter-dropdown");
    this.filterMenu = page.locator("#search-filter-menu");
    this.closeFilter = page.locator("#close_filter_btn");

    this.searchBox = page.locator("//*[@class='magic-box-input']");
    this.searchInput = page.locator("//*[@class='magic-box-input']/input");
    this.searchBtn = page.locator(
      "//*[@class='CoveoSearchButton coveo-accessible-button']",
    );

    this.totalCount = page.locator(
      "//span[contains(@class,'coveo-highlight-total-count')]",
    );

    this.nextButton = page.locator(".coveo-pager-next");
    this.results = page.locator(".coveo-list-layout.CoveoResult");
  }

  async openFilters() {
    await this.filterButton.waitFor({ state: "visible" });
    await this.filterButton.click();
    await this.page.waitForTimeout(1000);
    await this.filterMenu.waitFor({ state: "visible" });
  }

  async closeFilters() {
    await this.page.waitForTimeout(1000);

    if (await this.closeFilter.isVisible()) {
      const handle = await this.closeFilter.elementHandle();
      await this.page.evaluate((el) => el.click(), handle);
      await this.page.waitForTimeout(1500);
    }
  }

  async cleanNumber(text) {
    return Number(text.replace(/[,+]/g, "").trim());
  }

  async verifyFacet(title, offset = 3) {
    const items = this.page.locator(`//*[@data-title='${title}']/ul/li`);

    const count = await items.count();

    console.log(`${title} Filter Count : ${count}`);

    for (let i = 0; i < count; i++) {
      await this.closeFilters();

      const item = items.nth(i);

      await this.page.waitForTimeout(2000);

      await item.waitFor({
        state: "visible",
      });

      await item.scrollIntoViewIfNeeded();

      await item.click();

      await this.page.waitForTimeout(4000);

      const name = await item.getAttribute("data-value");

      const facetCount = await this.page
        .locator(
          `//*[@data-title='${title}']/ul/li[${i + 1}]//*[@class='coveo-facet-value-count']`,
        )
        .innerText();

      await this.page.waitForTimeout(3000);

      const total = await this.totalCount.innerText();

      const facet = await this.cleanNumber(facetCount);
      const totalResult = await this.cleanNumber(total);

      console.log(`${title}: ${name}`);
      console.log(`Facet: ${facet}`);
      console.log(`Total: ${totalResult}`);

      if (title === "Type") {
        if (name.toLowerCase() === "web page") {
          expect(facet + offset).toBe(totalResult);
        } else {
          expect(facet).toBe(totalResult);
        }
      } else {
        expect(facet + offset).toBe(totalResult);
      }

      await item.click();

      await this.page.waitForTimeout(2000);
    }
  }

  async search(keyword) {
    // Close active filters
    await this.closeFilters();

    // Close filter overlay
    await this.page.evaluate(() => {
      if (typeof searchFullScreen === "function") {
        searchFullScreen();
      }
    });

    await this.page.waitForTimeout(2000);

    // Now search
    await this.searchInput.waitFor({
      state: "visible",
      timeout: 10000,
    });

    await this.searchInput.fill(keyword);

    await this.page.waitForTimeout(1000);

    await this.searchBtn.click();

    await this.page.waitForLoadState("networkidle");

    await this.page.waitForTimeout(3000);
  }

  async verifyTargetUrl(targetUrl) {
    const total = await this.cleanNumber(await this.totalCount.innerText());

    const perPage = 10;

    const pages = Math.ceil(total / perPage);

    let found = false;

    for (let p = 1; p <= pages && !found; p++) {
      await this.results.first().waitFor();

      const resultCount = await this.results.count();

      for (let i = 0; i < resultCount; i++) {
        const href = await this.results
          .nth(i)
          .locator(".search-item-content a")
          .getAttribute("href");

        if (href === targetUrl) {
          console.log(`Found on Page ${p}`);

          found = true;

          break;
        }
      }

      if (!found && p < pages) {
        await this.nextButton.click();

        await this.page.waitForLoadState("networkidle");

        await this.page.waitForTimeout(3000);
      }
    }

    expect(found).toBeTruthy();
  }

  async verifyPagination() {
    const total = await this.cleanNumber(await this.totalCount.innerText());

    const perPage = 10;

    const totalPages = Math.ceil(total / perPage);

    await this.page.waitForTimeout(3000);

    const displayed = await this.results.count();

    if (total <= perPage) {
      expect(displayed).toBe(total);

      expect(
        await this.page.locator(".coveo-pager-list").isVisible(),
      ).toBeFalsy();

      return;
    }

    expect(displayed).toBe(perPage);

    for (let p = 2; p <= totalPages; p++) {
      const btn = this.page.locator(`.coveo-pager-list span:text-is("${p}")`);

      await btn.click();

      await this.page.waitForTimeout(3000);

      await this.page.waitForLoadState("networkidle");

      const displayedNow = await this.results.count();

      const expected =
        p < totalPages ? perPage : total - perPage * (totalPages - 1);

      expect(displayedNow).toBe(expected);
    }
  }
}

module.exports = { SearchPage };
