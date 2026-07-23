const { test, expect } = require("@playwright/test");
const urls = require("../config/urls.json");
const { BasePage } = require("../pages/basePage");
const { FooterPage } = require("../pages/footerPage");

test("Verify Footer Links, Social Media, and Navigation Functionality", async ({
  page,
}) => {
  test.setTimeout(120000);

  const base = new BasePage(page);
  const footer = new FooterPage(page);

  await base.handleFeedbackModal();
  await base.open(urls.base);
  await base.acceptCookies();

  console.log("Step 1: Verify Footer Logo");
  await footer.verifyFooterLogo();

  console.log("Step 2: Verify Social Links");
  await footer.verifySocialLinks();

  console.log("Step 3: Click Make Payment");
  await footer.clickMakePayment();

  console.log("Step 4: Handle Choose Later Popup");
  await page.waitForTimeout(2000);
  await base.handleChooselater();

  console.log("Step 5: Click About Us");
  await footer.clickAboutUs();

  console.log("Step 6: Verify About Page");
  await footer.verifyAboutPage();

  console.log("Step 7: Verify Location Selection");

  await footer.clickMakePayment();

  const expectedUrlPart = await footer.selectRandomLocation();

  const currentUrl = page.url().replace(/\/$/, "").toLowerCase();

  const stateSlug = expectedUrlPart.split("/").pop().toLowerCase();

  const expectedUrl = `${urls.base}/${stateSlug}/paying-my-bill/pay-my-bill`;

  console.log("Current URL :", currentUrl);
  console.log("Expected URL:", expectedUrl);

  expect(currentUrl).toBe(expectedUrl);
});
