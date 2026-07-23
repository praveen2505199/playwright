const { test } = require("@playwright/test");

const urls = require("../../config/urls.json");

const { BasePage } = require("../../pages/basePage");

const { CookiePage } = require("../../pages/cookiePage");

const { MediaPage } = require("../../pages/mediaPage");

test("Verify Targeting Cookies Behavior In Media Page", async ({ page }) => {
  test.setTimeout(180000);

  const base = new BasePage(page);

  const cookiePage = new CookiePage(page);

  const mediaPage = new MediaPage(page);

  await base.open(urls.base);

  // Disable targeting cookies

  await cookiePage.openPreferences();

  await cookiePage.targetingTab.click();

  await cookiePage.savePreferenceBtn.click();

  // Navigate to Media page

  await mediaPage.openMediaPage(base);

  // Verify blocked video

  await mediaPage.verifyVideoBlockedWithoutTargetingCookie();

  // Enable targeting cookies

  await cookiePage.enableTargetingCookies();

  // Verify video available

  await mediaPage.verifyVideoEnabledAfterConsent();
});
