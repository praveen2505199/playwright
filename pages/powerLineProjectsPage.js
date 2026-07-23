const { expect } = require("@playwright/test");

class PowerLineProjectsPage {
  constructor(page) {
    this.page = page;

    this.searchIcon = page.locator("//button[@class='search']");
    this.searchInput = page.locator("#search-box-input");

    this.powerLineResult = page.locator(
      "//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Power Line Projects']",
    );

    this.map = page.locator("#map");

    this.zoomInButton = page.locator("a.leaflet-control-zoom-in");
    this.zoomOutButton = page.locator("a.leaflet-control-zoom-out");

    this.regionVirginia = page.locator(
      "//div[@class='region-project']//a[@id='VAC']",
    );

    this.addressInput = page.locator("#addressInput");
    this.addressSearchButton = page.locator("#addressInputLabel");

    this.firstSuggestion = page.locator(
      "//div[@id='addressInputautocomplete-list']//div[1]//strong",
    );

    this.marker = page.locator(
      "//img[contains(@class, 'leaflet-marker-icon')]",
    );
  }

  async searchPowerLineProjects(base) {
    await expect(this.searchIcon).toBeVisible();
    await this.searchIcon.click();

    await base.handleRandomLocationModal();

    await this.searchIcon.click();

    await this.searchInput.fill("Power Line Projects");
    await this.searchInput.press("Enter");

    await this.page.waitForLoadState("load");

    await base.CoveoresultIsVisible();

    await expect(this.powerLineResult).toBeVisible();

    await this.powerLineResult.click();

    await this.page.waitForLoadState("load");
  }

  async verifyPowerLineProjectsPage() {
    const currentUrl = this.page.url();

    console.log("Current URL:", currentUrl);

    expect(currentUrl).toContain(
      "/about/delivering-energy/electric-projects/power-line-projects",
    );

    console.log("Power Line Projects page loaded successfully");
  }

  async verifyMapVisible() {
    await expect(this.map).toBeVisible();

    console.log("Map is visible");
  }

  async zoomMap() {
    await this.zoomInButton.click();

    await this.page.waitForTimeout(1000);

    await this.zoomOutButton.click();

    await this.page.waitForTimeout(1000);

    console.log("Zoom In and Zoom Out completed");
  }

  async selectVirginiaRegion() {
    await expect(this.regionVirginia).toBeVisible();

    await this.regionVirginia.click();

    const selectedRegions = await this.page.evaluate(() => {
      let regions = [];

      document.querySelectorAll(".leaflet-marker-icon").forEach((marker) => {
        if (parseInt(marker.style.zIndex) > 100) {
          regions.push(marker.innerText);
        }
      });

      return regions;
    });

    console.log("Selected Regions:", selectedRegions);

    return selectedRegions;
  }

  async searchProjectByAddress(zipCode) {
    await this.addressInput.fill(zipCode);

    await this.firstSuggestion.waitFor({
      state: "visible",
      timeout: 20000,
    });

    await this.firstSuggestion.click();

    await this.addressSearchButton.click();

    await this.page.waitForTimeout(3000);

    await expect(this.marker).toBeVisible();

    console.log("Project marker displayed successfully");
  }
}

module.exports = { PowerLineProjectsPage };
