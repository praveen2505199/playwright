const { expect } = require("@playwright/test");

class BreadcrumbPage {
  constructor(page) {
    this.page = page;

    this.locationMenu = page.locator("//a[text()='Location']");

    this.searchIcon = page.locator("//button[@class='search']");
    this.searchInput = page.locator("#search-box-input");

    this.searchResult = page.locator(
      "//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Budget Billing']",
    );

    this.breadcrumb = page.locator("//div[contains(@class,'breadcrumb-area')]");

    this.breadcrumbLinks = this.breadcrumb.locator("a");
  }

  async navigateToBudgetBilling(base) {
    await expect(this.locationMenu).toBeVisible();

    await this.locationMenu.click();

    await base.handleLocationVirginia();

    await expect(this.searchIcon).toBeVisible();

    await this.searchIcon.click();

    await expect(this.searchInput).toBeVisible();

    await this.searchInput.fill("Budget Billing");

    await this.searchInput.press("Enter");

    await base.CoveoresultIsVisible();

    await expect(this.searchResult).toBeVisible();

    await this.searchResult.click();

    await expect(this.page).toHaveURL(
      /virginia\/paying-my-bill\/billing-options\/budget-billing/,
    );
  }

  async verifyBreadcrumbDisplayed() {
    await expect(this.breadcrumb).toBeVisible();
  }

  async verifyBreadcrumbNavigation(baseUrl, originalPath) {
    const count = await this.breadcrumbLinks.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = this.breadcrumbLinks.nth(i);

      const text = (await link.innerText()).trim();

      const href = await link.getAttribute("href");

      if (!href) {
        test.info().annotations.push({
          type: "info",
          description: `Skipping breadcrumb '${text}' because href is missing`,
        });

        continue;
      }

      const hrefNormalized = href.replace(/^\/(en|es)/, "").toLowerCase();

      const expectedUrl = new URL(hrefNormalized, baseUrl)
        .toString()
        .replace(/\/$/, "");

      console.log("Breadcrumb:", text);
      console.log("Expected URL:", expectedUrl);

      await link.click();

      const actualUrl = this.page.url().replace(/\/$/, "");

      expect(actualUrl).toBe(expectedUrl);

      // Return to original page before checking next breadcrumb
      await this.page.goto(`${baseUrl}${originalPath}`, {
        waitUntil: "load",
      });

      await expect(this.breadcrumb).toBeVisible();
    }
  }
}

module.exports = { BreadcrumbPage };
