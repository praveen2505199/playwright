const { expect } = require("@playwright/test");

class SignInPage {
  constructor(page) {
    this.page = page;

    this.signInLink = page.locator(
      "//div[@class='secondary-links']//a[@class='login' and @aria-label='Sign In']",
    );
  }

  async clickSignIn() {
    await expect(this.signInLink).toBeVisible();

    const newPagePromise = this.page
      .context()
      .waitForEvent("page")
      .catch(() => null);

    await this.signInLink.click();

    const newPage = await Promise.race([
      newPagePromise,
      this.page.waitForTimeout(3000).then(() => null),
    ]);

    if (newPage) {
      await newPage.waitForLoadState("load");
      return newPage;
    }

    await this.page.waitForLoadState("load");
    return this.page;
  }

  async verifySignInPageURL(activePage) {
    const currentUrl = activePage.url();

    console.log("Current URL:", currentUrl);

    expect(
      currentUrl.includes("login.dominionenergy.com") ||
        currentUrl.includes("account.dominionenergysc.com"),
    ).toBeTruthy();
  }
}

module.exports = { SignInPage };
