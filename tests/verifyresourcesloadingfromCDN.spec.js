const {test, expect} = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');

test('verify Resources Are Loading from CDN', async ({ page }) => {
  test.setTimeout(60000);
  const base = new BasePage(page);

  // Collect all network requests
  const requests = [];
  page.on('response', (response) => {
    requests.push({
      url: response.url(),
      status: response.status(),
      type: response.request().resourceType(),
    });
  });

  // 1) Open base and accept cookies  
  await base.open(urls.base);
  await base.acceptCookies();

  // 2) Wait a bit for all resources to load
  await page.waitForTimeout(2000);

  // 3) Verify that key resources are loading from CDN
  const cdnPattern = 'cdn-dominionenergy-prd-001.azureedge.net';
  const cdnResources = requests.filter(req => req.url.includes(cdnPattern));

  // Log all requests for debugging
  console.log(`Total requests: ${requests.length}`);
  console.log(`CDN requests: ${cdnResources.length}`);
  
  // Filter for common static asset types (css, js, images, fonts)
  const staticAssetTypes = ['stylesheet', 'script', 'image', 'font'];
  const staticRequests = requests.filter(req => staticAssetTypes.includes(req.type));
  const cdnStaticAssets = cdnResources.filter(req => staticAssetTypes.includes(req.type));

  console.log(`Static asset requests: ${staticRequests.length}`);
  console.log(`CDN static asset requests: ${cdnStaticAssets.length}`);

  // Log sample CDN resources
  if (cdnResources.length > 0) {
    console.log('Sample CDN resources loaded:');
    cdnResources.slice(0, 5).forEach(req => {
      console.log(`  - ${req.type}: ${req.url.substring(0, 100)}`);
    });
  }

  // Assertions
  expect(requests.length, 'Should have loaded some resources').toBeGreaterThan(0);
  expect(cdnResources.length, 'Should have loaded resources from CDN').toBeGreaterThan(0);
  expect(cdnStaticAssets.length, 'Should have loaded static assets from CDN').toBeGreaterThan(0);

  // Verify page loaded successfully
  const pageTitle = await page.title();
  expect(pageTitle).toBeTruthy();
  console.log(`Page title: ${pageTitle}`);
});