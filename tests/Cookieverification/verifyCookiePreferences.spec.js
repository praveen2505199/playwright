const { test } = require("@playwright/test");

const urls = require("../../config/urls.json");
const { BasePage } = require("../../pages/basePage");
const { CookiePage } = require("../../pages/cookiePage");

test("Verify Default Cookie Preferences", async ({ page }) => {
  test.setTimeout(120000);
  const base = new BasePage(page);

  const cookiePage = new CookiePage(page);

  await base.open(urls.base);

  await cookiePage.openPreferences();

  await cookiePage.verifyDefaultCookieSettings();
});
