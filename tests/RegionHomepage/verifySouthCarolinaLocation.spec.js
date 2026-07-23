const { test, expect } = require('@playwright/test');
const urls = require('../../config/urls.json');

const { BasePage } = require('../../pages/basePage');
const { LocationSelectionPage } = require('../../pages/LocationSelectionPage');

test('South Carolina: Verify Location Selection and URL Navigation', async ({ page }) => {

    test.setTimeout(60000);

    const base = new BasePage(page);
    const location = new LocationSelectionPage(page);

    await base.handleFeedbackModal();
    await base.open(urls.base);
    await base.acceptCookies();

    const homeUrl = await location.selectLocation("South Carolina");

    await location.verifyLocationUrl(urls.base, homeUrl);

    expect(await base.checkNetworkStatus()).toBeTruthy();
});