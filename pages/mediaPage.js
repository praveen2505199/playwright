const { expect } = require("@playwright/test");

class MediaPage {
  constructor(page) {
    this.page = page;

    this.searchIcon = page.locator("//button[@class='search']");

    this.searchInput = page.locator("#search-box-input");

    this.mediaResult = page.locator(
      "//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Media']",
    );

    this.disabledVideoMessage = page.locator(
      "(//p[contains(@class,'empty-cookie') and not(@style)])[1]",
    );

    this.enabledVideoMessage = page.locator("p.empty-cookie");
  }

  async openMediaPage(base) {
    await this.searchIcon.click();

    await base.handleRandomLocationModal();

    await this.searchIcon.click();

    await this.searchInput.fill("Media");

    await this.searchInput.press("Enter");

    await this.page.waitForLoadState("load");

    // Wait for Coveo results to render
    const coveoResults = this.page.locator(".CoveoResultLink");
    await expect(coveoResults.first()).toBeVisible({
      timeout: 60000,
    });

    await expect(this.mediaResult).toBeVisible({ timeout: 10000 });

    await this.mediaResult.click();

    await this.page.waitForLoadState("load");

    console.log("Media URL:", this.page.url());
  }

  async verifyVideoBlockedWithoutTargetingCookie() {
    await expect(this.disabledVideoMessage).toBeVisible({
      timeout: 10000,
    });

    const text = await this.disabledVideoMessage.innerText();

    console.log(text);

    expect(text).toContain("This is a video provided by a third party");
  }

  async verifyVideoEnabledAfterConsent() {
    await expect(this.enabledVideoMessage).not.toBeVisible({
      timeout: 10000,
    });

    console.log("Video loaded after targeting cookie consent");
  }
}

module.exports = { MediaPage };
