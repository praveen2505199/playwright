const { test, expect } = require("@playwright/test");

const urls = require("../config/urls.json");

const { BasePage } = require("../pages/basePage");
const { HeaderPage } = require("../pages/headerPage");

test("Header: Verify UI Interactions, Header Navigation, and Location Selector Functionality", async ({
  page,
}) => {
  test.setTimeout(300000);

  const base = new BasePage(page);
  const header = new HeaderPage(page);

  await base.handleFeedbackModal();
  await base.open(urls.base);
  await base.acceptCookies();

  console.log("Step 1: Verify Logo");
  await header.verifyLogo();

  console.log("Step 2: Verify Header Buttons");
  await header.verifyHeaderButtons();

  console.log("Step 3: Click Location");
  await header.clickLocationSelector();

  console.log("Step 4: Handle Location Popup");
  await base.handleChooselater();

  console.log("Step 5: Click Support");
  await header.clickSupport();
  await page.waitForTimeout(1000);
  await base.handleChooselater();

  console.log("Step 6: Click Search");
  await header.clickSearch();
  await page.waitForTimeout(1000);
  await base.handleChooselater();

  console.log("Step 7: Click Sign In");
  await header.clickSignIn();
  await page.waitForTimeout(1000);
  await base.handleChooselater();

  console.log("Step 8: Verify Header Navigation");
  await header.verifyHeaderMenus(base);

  console.log("Step 9: Open Location Selector");

  await header.clickLogo();

  await header.clickLocationSelector();

  console.log("Step 10: Select Random Location");

  const expectedUrlPart = await header.selectRandomLocation();

  const currentUrl = page.url().replace(/\/$/, "").toLowerCase();

  const stateSlug = expectedUrlPart.split("/").pop().toLowerCase();

  const expectedUrl = `${urls.base}/${stateSlug}`;

  console.log("Current URL :", currentUrl);
  console.log("Expected URL:", expectedUrl);

  expect(currentUrl).toBe(expectedUrl);

  console.log("Step 11: Verify Pay My Bill Navigation");

  await header.clickPayMyBill();

  await expect(page).toHaveURL(/paying-my-bill/i);

  console.log("Pay My Bill page verified");

  console.log("Step 12: Click Logo");

  await header.clickLogo();

  console.log("Step 13: Verify Homepage");

  await expect(page).toHaveURL(expectedUrl);

  console.log("Homepage verified");
});
