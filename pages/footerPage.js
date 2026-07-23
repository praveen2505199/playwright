const { expect } = require("@playwright/test");

class FooterPage {
  constructor(page) {
    this.page = page;

    // Logo
    this.domLogo = page.locator(
      "//div[@class='footer-logo']//div[@class='Logo']//div[@class='logo-desktop']//img",
    );

    // Social Media
    this.followUsDiv = page.locator(".Follow-us");
    this.socialLinks = this.followUsDiv.locator(".follow-icon a");

    // Footer
    this.footerCopyright = page.locator(
      "//div[contains(@class, 'Footer-copyright')]",
    );

    // Footer Links
    this.makePaymentLink = page.locator(
      "//div[contains(@class, 'nav-footer')]//a[@aria-label='Make a Payment']",
    );
    this.aboutUsLink = page.locator(
      "//div[contains(@class, 'nav-footer')]//a[@aria-label='About Us']",
    );

    // Location Popup
    this.locations = page.locator(".tiles .location-tile");
    this.continueBtn = page.locator(".location-continue-btn");
  }

  async verifyFooterLogo() {
    await this.domLogo.scrollIntoViewIfNeeded();
    await expect(this.domLogo).toBeVisible();

    const altText = await this.domLogo.getAttribute("alt");
    console.log(`Dominion logo alt text: ${altText}`);
  }

  async verifySocialLinks() {
    const count = await this.socialLinks.count();
    let allLinksValid = true;

    for (let i = 0; i < count; i++) {
      const link = this.socialLinks.nth(i);
      const ariaLabel = await link.getAttribute("aria-label");
      const href = await link.getAttribute("href");

      if (!href) {
        console.log(`FAIL: ${ariaLabel} has empty href`);
        allLinksValid = false;
      } else {
        console.log(`PASS: ${ariaLabel} -> ${href}`);
      }
    }

    await expect(this.footerCopyright).toBeVisible();

    if (allLinksValid) {
      console.log("All social links are valid.");
    }
  }

  async clickMakePayment() {
    await this.makePaymentLink.scrollIntoViewIfNeeded();
    await this.makePaymentLink.click();
  }

  async clickAboutUs() {
    await this.aboutUsLink.click();
  }

  async verifyAboutPage() {
    await expect(this.page).toHaveURL(/about/i);
  }

  async selectRandomLocation() {
    const count = await this.locations.count();
    const randomIndex = Math.floor(Math.random() * count);

    const selectedLocation = this.locations.nth(randomIndex);

    const locationName = await selectedLocation.getAttribute("aria-label");
    const expectedUrlPart =
      await selectedLocation.getAttribute("data-home-url");

    console.log(`Selected Location: ${locationName}`);
    await selectedLocation.waitFor({
      state: "visible",
      timeout: 30000,
    });
    await selectedLocation.click();
    await this.continueBtn.click();

    return expectedUrlPart;
  }
}

module.exports = { FooterPage };
