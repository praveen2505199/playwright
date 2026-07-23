const { expect } = require("@playwright/test");

class CDNPage {
  constructor(page) {
    this.page = page;
    this.requests = [];
  }

  startNetworkMonitoring() {
    this.requests = [];

    this.page.on("response", (response) => {
      this.requests.push({
        url: response.url(),
        status: response.status(),
        type: response.request().resourceType(),
      });
    });
  }

  async verifyCDNResources() {
    await this.page.waitForLoadState("domcontentloaded");

    const cdnPattern = "cdn-dominionenergy-prd-001.azureedge.net";

    const cdnResources = this.requests.filter((req) =>
      req.url.includes(cdnPattern),
    );

    const staticAssetTypes = ["stylesheet", "script", "image", "font"];

    const staticRequests = this.requests.filter((req) =>
      staticAssetTypes.includes(req.type),
    );

    const cdnStaticAssets = cdnResources.filter((req) =>
      staticAssetTypes.includes(req.type),
    );

    console.log(`Total Requests: ${this.requests.length}`);
    console.log(`CDN Requests: ${cdnResources.length}`);
    console.log(`Static Assets: ${staticRequests.length}`);
    console.log(`CDN Static Assets: ${cdnStaticAssets.length}`);

    if (cdnResources.length > 0) {
      console.log("Sample CDN Resources:");

      cdnResources.slice(0, 5).forEach((req) => {
        console.log(`${req.type} : ${req.url}`);
      });
    }

    expect(this.requests.length).toBeGreaterThan(0);
    expect(cdnResources.length).toBeGreaterThan(0);
    expect(cdnStaticAssets.length).toBeGreaterThan(0);
  }

  async verifyPageLoaded() {
    const title = await this.page.title();

    console.log("Page Title:", title);

    expect(title).toBeTruthy();
  }
}

module.exports = { CDNPage };
