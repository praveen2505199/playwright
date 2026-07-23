const { expect } = require("@playwright/test");

class WasteHeatTreatmentFacilityPage {
  constructor(page) {
    this.page = page;

    this.searchIcon = page.locator("//button[@class='search']");
    this.searchInput = page.locator("#search-box-input");

    this.searchResult = page.locator(
      "//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Waste Heat Treatment Facility']",
    );

    this.table = page.locator("//div[@data-component-name='LC01']//table");

    this.tableRows = page.locator(
      "//div[@data-component-name='LC01']//tbody/tr",
    );
  }

  async navigateToWasteHeatTreatmentPage(base) {
    await expect(this.searchIcon).toBeVisible();

    await this.searchIcon.click();

    await base.handleRandomLocationModal();

    await this.searchIcon.click();

    await expect(this.searchInput).toBeVisible();

    await this.searchInput.fill("Waste Heat Treatment Facility");

    await this.searchInput.press("Enter");

    await base.CoveoresultIsVisible();

    await expect(this.searchResult).toBeVisible();

    await this.searchResult.click();

    await expect(this.page).toHaveURL(/waste-heat-treatment-facility/);
  }

  async verifyTableData() {
    await expect(this.table).toBeVisible({ timeout: 30000 });

    // Wait until at least one row is present
    await expect(this.tableRows.first()).toBeVisible({ timeout: 30000 });
    const rowCount = await this.tableRows.count();

    console.log(`Total rows: ${rowCount}`);

    expect(rowCount).toBeGreaterThan(0);

    for (let i = 0; i < rowCount; i++) {
      const row = this.tableRows.nth(i);

      const cells = row.locator("td");

      const cellCount = await cells.count();

      console.log(`Row ${i + 1}: ${cellCount} columns`);

      // Validate date column
      const dateText = (await cells.nth(0).innerText()).trim();

      const rowDate = new Date(dateText);

      const nowEST = new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "America/New_York",
        }),
      );

      const diffDays = Math.floor((nowEST - rowDate) / (1000 * 60 * 60 * 24));

      console.log(
        `Row ${i + 1} Date: ${dateText} | Difference: ${diffDays} day(s)`,
      );

      expect(diffDays).toBeLessThanOrEqual(2);

      // Validate remaining columns are not empty
      for (let c = 1; c < cellCount; c++) {
        const value = (await cells.nth(c).innerText()).trim();

        console.log(`Row ${i + 1}, Column ${c + 1}: ${value}`);

        expect(
          value,
          `Row ${i + 1}, Column ${c + 1} should not be empty`,
        ).not.toBe("");
      }

      console.log(`Row ${i + 1} validated successfully`);
    }

    console.log("All table rows validated successfully.");
  }
}

module.exports = { WasteHeatTreatmentFacilityPage };
