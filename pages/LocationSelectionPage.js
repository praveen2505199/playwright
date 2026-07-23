const { expect } = require("@playwright/test");

class LocationSelectionPage {
  constructor(page) {
    this.page = page;

    this.locationMenu = page.locator("//a[text()='Location']");
    this.locationModal = page.locator("#modal-overlay");
    this.continueButton = page.locator("button.location-continue-btn");
  }

  async selectLocation(locationName) {
    await expect(this.locationMenu).toBeVisible();

    await this.locationMenu.click();

    await expect(this.locationModal).toBeVisible();

    const locationTile = this.locationModal.locator(
      `a.tile.location-tile[data-location='${locationName}']`,
    );

    await expect(locationTile).toBeVisible();

    const homeUrl = await locationTile.getAttribute("data-home-url");

    console.log("Selected Home URL:", homeUrl);

    await locationTile.click();

    await expect(this.continueButton).toBeVisible();

    await this.continueButton.click();

    await this.page.waitForLoadState("load");

    await this.page.reload({
      waitUntil: "load",
    });

    return homeUrl;
  }

  async verifyLocationUrl(baseUrl, homeUrl) {
    const currentUrl = this.page.url().replace(/\/$/, "").toLowerCase();

    console.log("Current URL:", currentUrl);

    const stateSlug = homeUrl.split("/").pop().toLowerCase();

    const expectedUrl = `${baseUrl}/${stateSlug}`;

    expect(currentUrl).toBe(expectedUrl);
  }
}

module.exports = { LocationSelectionPage };
