const { expect } = require("@playwright/test");

class ErrorPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToRandomInvalidUrl() {
    const origin = new URL(this.page.url()).origin;

    const randomSlug = `random-${Math.random().toString(36).slice(2, 10)}`;

    const invalidUrl = `${origin}/${randomSlug}`;

    const response = await this.page.goto(invalidUrl, {
      waitUntil: "load",
    });

    return {
      url: invalidUrl,
      status: response ? response.status() : null,
    };
  }

  async getPageTitle() {
    return await this.page.title();
  }

  async verify404Page(status) {
    const title = await this.getPageTitle();

    console.log("Page Title:", title);
    console.log("Response Status:", status);

    expect(title).toMatch(/Page Not Found \| Dominion Energy/i);

    if (status !== null) {
      expect(status).toBeGreaterThanOrEqual(400);
    }
  }
}

module.exports = { ErrorPage };
