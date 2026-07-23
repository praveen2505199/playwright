const { test } = require("@playwright/test");
const urls = require("../config/urls.json");
const { BasePage } = require("../pages/basePage");
const { SignInPage } = require("../pages/signInPage");

test("Validate Sign In Page URL After Redirection", async ({ page }) => {
  test.setTimeout(60000);

  const base = new BasePage(page);
  const signInPage = new SignInPage(page);

  // Open application
  await base.open(urls.base);
  await base.acceptCookies();

  const activePage = await signInPage.clickSignIn();

  await base.handleRandomLocationModal();

  await signInPage.verifySignInPageURL(activePage);
});
