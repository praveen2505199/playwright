const { test } = require("@playwright/test");

const urls = require("../../config/urls.json");
const { BasePage } = require("../../pages/basePage");
const { CookiePage } = require("../../pages/cookiePage");

test("Verify Cookies Not Set After Rejecting Cookies", async ({ page }) => {
  test.setTimeout(120000);
  const base = new BasePage(page);
  const cookiePage = new CookiePage(page);
  await base.open(urls.base);
  await page.waitForTimeout(3000);
  const forbiddenCookies = [
    "_clck",
    "_clsk",
    "_ga",
    "uws_session",
    "uws_visitor",
  ];

  await cookiePage.verifyCookiesNotPresent(forbiddenCookies);
});
