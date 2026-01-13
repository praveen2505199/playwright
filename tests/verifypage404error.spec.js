const { test, expect } = require('@playwright/test');
const { BasePage } = require('../pages/basePage');

test('Verify 404 Error Page Handling for Random Invalid URL', async ({ page }) => {
  test.setTimeout(120000);  
  const base = new BasePage(page);
    await base.open();
    await base.acceptCookies();

  // 2) Build a random path with trailing slash
  const origin = new URL(page.url()).origin;
  const randomSlug = `random-${Math.random().toString(36).slice(2, 10)}`;
  const testUrl = `${origin}/${randomSlug}`;

  // 3) Navigate to the random path and capture the response
  const response = await page.goto(testUrl, { waitUntil: 'load' });

  // 4) Fetch page title and network status
  const title = await page.title();
  const status = response ? response.status() : null;

  console.log(`Test URL: ${testUrl}`);
  console.log(`Response status: ${status}`);
  console.log(`Page title: ${title}`);

  // 5) Verify title indicates a not-found page (case-insensitive)
expect(title).toMatch(/Page Not Found \| Dominion Energy/);

  // 6) Verify network status is an error (prefer 404, allow any 4xx/5xx)
  if (status !== null) {
    expect(status).toBeGreaterThanOrEqual(400);
  } else {
    // If no response available, at minimum rely on the title check above
    test.info().annotations.push({ type: 'warning', description: 'No network response available; asserted using title only.' });
  }
});
