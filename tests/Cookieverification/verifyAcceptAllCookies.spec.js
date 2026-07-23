const { test } = require("@playwright/test");

const urls = require("../../config/urls.json");
const { BasePage } = require("../../pages/basePage");
const { CookiePage } = require("../../pages/cookiePage");

test("Verify Performance Target and Functional Cookies are Set", async ({
  page,
}) => {
  test.setTimeout(120000);

  const base = new BasePage(page);
  const cookiePage = new CookiePage(page);

  await base.open(urls.base);

  await base.acceptCookies();

  // Allow analytics/consent cookies to be generated
  await page.waitForLoadState("networkidle");

  await page.reload();

  await page.waitForLoadState("networkidle");

  const requiredCookies = [
    "_clck",
    "_clsk",
    "_ga",
    "www.dominionenergy.com.cookie",
  ];

  await cookiePage.verifyCookiesPresent(requiredCookies);
});
