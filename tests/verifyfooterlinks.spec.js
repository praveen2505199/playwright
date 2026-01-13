const { test, expect } = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');

test('Verify Footer Links, Social Media, and Navigation Functionality', async ({ page }) => {
  test.setTimeout(120000);
  const base = new BasePage(page);
  await base.open(urls.base);
  await base.acceptCookies();
  
  console.log("Step 1:Verifying DOM logo displaying in footer...");
  const domLogo = page.locator("//div[@class='footer-logo']//div[@class='Logo']//div[@class='logo-desktop']//img");
  await domLogo.scrollIntoViewIfNeeded();
  
    await expect(domLogo).toBeVisible('Dom Logo should be displayed');
    const alttext = await domLogo.getAttribute('alt');
    console.log('Dominion logo is visible');
    console.log(`Dominion logo alt text: ${alttext}`);


  console.log("Step 2:Verifying social media and copyright links in footer...");
  
  const followUsDiv = page.locator('.Follow-us');
  const socialLinks = followUsDiv.locator('.follow-icon a');
  const socialLinksCount = await socialLinks.count();
  
  let allLinksValid = true;
  for (let i = 0; i < socialLinksCount; i++) {
    const link = socialLinks.nth(i);
    const ariaLabel = await link.getAttribute('aria-label');
    const href = await link.getAttribute('href');

    if (!href) {
      console.log(`FAIL: Social media link with aria-label '${ariaLabel}' has empty or missing href.`);
      allLinksValid = false;
    } else {
      console.log(`PASS: Social media link '${ariaLabel}' has href: ${href}`);
    }
  }

  const footerCopyright = page.locator("//div[contains(@class, 'Footer-copyright')]");
  await expect(footerCopyright).toBeVisible();
  console.log("Footer copyright section is displayed.");

  if (allLinksValid) {
    console.log("All social links have valid href attributes.");
  } else {
    console.log("Some social links have empty or missing href attributes.");
  }



  console.log("Step 3:Verifying 'Make a Payment' link in footer...");

  const makePaymentLink = page.locator("//div[contains(@class, 'nav-footer')]//a[@aria-label='Make a Payment']");
  await makePaymentLink.scrollIntoViewIfNeeded();
  await makePaymentLink.click();

  console.log("Clicked on 'Make a Payment' link.");

  console.log("Step 4: Verifying location selector modal and clicking choose later...");
  await page.waitForTimeout(2000);
  await base.handleChooselater();

  console.log("Step 5:Verifying global links in footer...");

  const aboutUsLink =page.locator("//div[contains(@class, 'nav-footer')]//a[@aria-label='About Us']");
  await aboutUsLink.click();

  console.log("Clicked on 'About Us' link.");

  console.log("Step 6:Verifying links redirection...");

  const currentPageUrl = page.url().toLowerCase();
  expect(currentPageUrl).toContain("/about");
  console.log("URL contains '/about'.");


  console.log("Step 7:Verifying location selector popup...");
  const makePayment = page.locator("//div[contains(@class, 'nav-footer')]//a[@aria-label='Make a Payment']");
  await makePayment.scrollIntoViewIfNeeded();
  await makePayment.click();
  const locations = page.locator('.tiles .location-tile');
    const randomIndex = Math.floor(Math.random() * (await locations.count()));
    const selectedLocation = locations.nth(randomIndex);
    const locationName = await selectedLocation.getAttribute('aria-label');
    const expectedUrlPart = await selectedLocation.getAttribute('data-home-url');
    console.log(`Clicking on random location: ${locationName}`);
    //await selectedLocation.scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000);
    await selectedLocation.isVisible();
    await selectedLocation.click();

    // Click the continue button after selecting a location
    const continuebtn = page.locator('.location-continue-btn');
    await continuebtn.click();
    console.log('Continue button clicked after location selection');

   const currentUrl = page.url();
   const currentUrlTrimmed = currentUrl.replace(/\/$/, "").toLowerCase();
   //console.log(currentUrlTrimmed);
   console.log("Current URL :", currentUrlTrimmed);
   // Build correct expected URL
   const stateSlug = expectedUrlPart.split("/").pop().toLowerCase(); // "north-carolina"
   const expectedUrl = `${urls.base}/${stateSlug}/paying-my-bill/pay-my-bill`;
   //expect(currentUrlTrimmed).toBe(expectedUrl);
   //console.log(expectedUrl);
   console.log("Expected URL:", expectedUrl);

  // Click the continue button after selecting a location


  // Build correct expected URL


  // Assert that the URLs match
  expect(currentUrlTrimmed).toBe(expectedUrl);
});