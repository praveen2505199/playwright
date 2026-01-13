const { test, expect } = require('@playwright/test');
const urls = require('../../config/urls.json');
const { BasePage } = require('../../pages/basePage');

test('Cookie Verification Test: Ensuring Performance, Target, and Functional Cookies are Set Correctly ', async ({ page }) => {
  test.setTimeout(120000);
  
  const base = new BasePage(page);

  await base.open(urls.base);
  await base.acceptCookies();
  const HeaderLogo = page.locator('a[aria-label="Dominion Energylogo"] img[alt="Dominion Energy"]');
  await HeaderLogo.isVisible();
  HeaderLogo.click();
  await page.waitForLoadState('domcontentloaded');

  // Wait for cookies to be written
  //await page.waitForTimeout(3000);

  // Get browser context
  const context = page.context();
  await page.waitForTimeout(15000);
   await page.waitForLoadState('domcontentloaded');
  // Read cookies (Application tab)
  const cookies = await context.cookies();
    await page.waitForTimeout(1000);


  // Only required cookies
  const targetCookies = ['_clck', '_clsk', '_ga', 'www.dominionenergy.com.cookie'];

  console.log('--- Cookie Verification ---');

  targetCookies.forEach(name => {
    const cookie = cookies.find(c => c.name === name);
    if (cookie) {
      console.log(`${name}`);
      console.log(`   Value  : ${cookie.value}`);
      console.log(`   Domain : ${cookie.domain}`);
      console.log(`   Path   : ${cookie.path}`);
    } else {
      console.log(`${name} NOT FOUND`);
    }
  });
});
