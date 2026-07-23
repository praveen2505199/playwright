const { test } = require('@playwright/test');

const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');
const { PowerLineProjectsPage } = require('../pages/powerLineProjectsPage');


test('Verify Power Line Projects Search and Map Functionality', async ({ page }) => {

    test.setTimeout(180000);


    const base = new BasePage(page);
    const powerLinePage = new PowerLineProjectsPage(page);


    // Open site
    await base.handleFeedbackModal();

    console.log("Step 1: Open base URL");

    await base.open(urls.base);

    await base.acceptCookies();

    await page.waitForLoadState("load");


    // Search Power Line Projects
    console.log("Step 2: Search Power Line Projects");

    await powerLinePage.searchPowerLineProjects(base);


    // Verify navigation
    console.log("Step 3: Verify Power Line Projects page");

    await powerLinePage.verifyPowerLineProjectsPage();


    // Verify map
    console.log("Step 4: Verify map functionality");

    await powerLinePage.verifyMapVisible();


    // Zoom test
    await powerLinePage.zoomMap();


    // Select Virginia region
    console.log("Step 5: Select Virginia region");

    await powerLinePage.selectVirginiaRegion();


    // Search project by zip code
    console.log("Step 6: Verify project search");

    await powerLinePage.searchProjectByAddress("75401");

});