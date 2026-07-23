const { test } = require("@playwright/test");
const urls = require("../config/urls.json");
const { BasePage } = require("../pages/basePage");
const { CDNPage } = require("../pages/cdnPage");

test("Verify Resources Are Loading from CDN", async ({ page }) => {
  test.setTimeout(60000);

  const base = new BasePage(page);
  const cdnPage = new CDNPage(page);

  // Start monitoring network requests
  cdnPage.startNetworkMonitoring();

  // Open application
  await base.open(urls.base);
  await base.acceptCookies();

  // Verify CDN resources
  await cdnPage.verifyCDNResources();

  // Verify page loaded successfully
  await cdnPage.verifyPageLoaded();
});
