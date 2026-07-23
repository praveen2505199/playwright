const { expect } = require("@playwright/test");

class HeaderPage {
  constructor(page) {
    this.page = page;

    // Logo
    this.domLogo = page.locator(
      'a[aria-label="Dominion Energylogo"] img[alt="Dominion Energy"]',
    );
    this.logoLink = page.locator(".logo a");

    // Header Buttons
    this.desktopHeader = page.locator(".logo-links-box");

    this.locationBtn = this.desktopHeader.locator("#location-select");
    this.supportBtn = this.desktopHeader.locator("a.support");
    this.searchBtn = this.desktopHeader.locator("button.search");
    this.signInBtn = this.desktopHeader.locator(
      'a.login[aria-label="Sign In"]',
    );
    this.logoLink = this.desktopHeader.locator(".logo a");

    // Header Navigation
    this.headerMenus = page.locator(
      "//div[contains(@class,'secondary-navigation') and contains(@class,'main-nav')]",
    );

    // Location Selector
    this.locations = page.locator(".tiles .location-tile");
    this.continueBtn = page.locator(".location-continue-btn");

    // Navigation
    this.payMyBillLink = page.locator('a[id="Pay My Bill"]');
  }

  async verifyLogo() {
    await expect(this.domLogo).toBeVisible();

    const altText = await this.domLogo.getAttribute("alt");
    console.log("Dominion logo displayed");
    console.log(`Alt Text: ${altText}`);
  }

  async verifyHeaderButtons() {
    const buttons = [
      { locator: this.locationBtn, label: "Location" },
      { locator: this.supportBtn, label: "Support" },
      { locator: this.searchBtn, label: "Search" },
      { locator: this.signInBtn, label: "Sign In" },
    ];

    for (const button of buttons) {
      await expect(button.locator).toBeVisible();
      console.log(`${button.label} button displayed`);
    }
  }

  async clickLocationSelector() {
    await this.locationBtn.click();
  }

  async clickSupport() {
    await this.supportBtn.click();
  }

  async clickSearch() {
    await this.searchBtn.click();
  }

  async clickSignIn() {
    await this.signInBtn.click();
  }

  async verifyHeaderMenus(base) {
    const count = await this.headerMenus.count();

    for (let i = 0; i < count; i++) {
      const menu = this.headerMenus.nth(i);

      const menuText = await menu.textContent();

      await expect(menu).toBeVisible();

      await menu.hover();

      const submenu = menu.locator(".third-navigation");

      if (await submenu.isVisible()) {
        console.log(`Dropdown displayed for ${menuText}`);
      } else {
        console.log(`No dropdown for ${menuText}`);
      }

      await menu.click();

      await this.page.waitForTimeout(2000);

      await base.handleChooselater();

      await this.page.mouse.move(0, 0);
    }
  }

  async selectRandomLocation() {
    const count = await this.locations.count();

    const randomIndex = Math.floor(Math.random() * count);

    const location = this.locations.nth(randomIndex);

    const locationName = await location.getAttribute("aria-label");

    const expectedUrlPart = await location.getAttribute("data-home-url");

    console.log(`Selected Location: ${locationName}`);

    await location.click();

    await this.continueBtn.click();

    return expectedUrlPart;
  }

  async clickPayMyBill() {
    await this.payMyBillLink.click();
  }

  async clickLogo() {
    await this.logoLink.click();
  }
}

module.exports = { HeaderPage };
