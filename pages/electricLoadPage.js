const { expect } = require("@playwright/test");

class ElectricLoadPage {
  constructor(page) {
    this.page = page;

    this.searchIcon = page.locator("//button[@class='search']");
    this.searchInput = page.locator("#search-box-input");

    this.electricTransmissionResult = page.locator(
      "//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Electric Transmission Access']",
    );

    this.fileLink = page.locator(
      "//div[@class='rich-text']//a[text()='PJM-South Zone Load (Current Month)']",
    );
  }

  formatDate_MMddyy(date) {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2);

    return `${mm}/${dd}/${yy}`;
  }

  async searchElectricTransmissionAccess(base) {
    await this.searchIcon.click();

    await base.handleRandomLocationModal();

    await this.searchIcon.click();

    await this.searchInput.fill("Electric Transmission Access");
    await this.searchInput.press("Enter");

    await base.CoveoresultIsVisible();

    await expect(this.electricTransmissionResult).toBeVisible();

    await this.electricTransmissionResult.click();
  }

  async openLoadDataFile() {
    const popupPromise = this.page.waitForEvent("popup");

    await this.fileLink.click();

    const newPage = await popupPromise;

    await newPage.waitForLoadState("load");

    return newPage;
  }

  async verifyDateValidation(newPage) {
    const fileContent = await newPage.locator("pre").textContent();

    const lines = fileContent.split(/\r?\n/).filter((x) => x.trim().length > 0);

    console.log(`Total lines found in file: ${lines.length}`);

    const dateSet = new Set();

    // Current EST date
    const nowESTString = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });

    const today = new Date(nowESTString);

    // Yesterday EST
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let lastDataLine = "";

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);

      if (parts.length > 0) {
        const dateStr = parts[0];

        const parsed = new Date(dateStr);

        if (!isNaN(parsed)) {
          const formatted = this.formatDate_MMddyy(parsed);

          if (dateSet.has(formatted)) {
            throw new Error(`Duplicate date found: ${formatted}`);
          }

          dateSet.add(formatted);
          lastDataLine = line;
        }
      }
    }

    console.log("Unique dates found:", dateSet.size);

    // Generate expected dates
    const expectedDates = [];

    for (
      let d = new Date(firstOfMonth);
      d <= yesterday;
      d.setDate(d.getDate() + 1)
    ) {
      expectedDates.push(this.formatDate_MMddyy(d));
    }

    // Validate dates
    for (const expected of expectedDates) {
      if (!dateSet.has(expected)) {
        throw new Error(`Missing data for: ${expected}`);
      }
    }

    console.log(
      `All dates from ${this.formatDate_MMddyy(firstOfMonth)} to ${this.formatDate_MMddyy(yesterday)} are present`,
    );

    console.log("Last row in file:", lastDataLine);
  }
}

module.exports = { ElectricLoadPage };
