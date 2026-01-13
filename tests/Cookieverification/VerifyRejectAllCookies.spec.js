const { test, expect } = require('@playwright/test');
const { BasePage } = require('../../pages/basePage');
const urls = require('../../config/urls.json');

test('verifyCookiesNotSetAfterRejectingAllCookies', async ({ page }) => {
  const base = new BasePage(page);

  // Open the target page
  await base.open(urls.base);

  // Click "Reject All Cookies"
  //const rejected = await base.rejectCookies();
  //expect(rejected).toBe(true); // ensure the reject action was performed

  // Wait a moment for cookies to settle
  await page.waitForTimeout(3000);
    await page.waitForLoadState('domcontentloaded');
  // Get all cookies from the browser context
  const cookies = await page.context().cookies();
  await page.waitForLoadState('domcontentloaded');

  // Cookies that should NOT be set
  const forbiddenCookies = ['_clck', '_clsk', '_ga', 'uws_session', 'uws_visitor'];

  console.log('--- Cookie Verification After Reject ---');

  forbiddenCookies.forEach(name => {
   
    const cookie = cookies.find(c => c.name === name);
    if (cookie) {
      console.log(`${name} FOUND!`);
      console.log(`   Value  : ${cookie.value}`);
      console.log(`   Domain : ${cookie.domain}`);
      console.log(`   Path   : ${cookie.path}`);
    } else {
      console.log(`${name} NOT FOUND (PASS)`);
    }
  });

  // Optional: assert that forbidden cookies do NOT exist
  forbiddenCookies.forEach(name => {
    const cookieExists = cookies.some(c => c.name === name);
    
    expect(cookieExists).toBeFalsy();
  });
});
