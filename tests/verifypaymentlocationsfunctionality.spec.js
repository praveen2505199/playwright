const { test } = require('@playwright/test');

const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');
const { PaymentLocationsPage } = require('../pages/paymentLocationsPage');


test('Verify Payment Locations Page Search and Pagination Functionality',
async ({ page }) => {


    test.setTimeout(200000);


    const base = new BasePage(page);

    const paymentPage =
        new PaymentLocationsPage(page);



    // Open application

    await base.handleFeedbackModal();


    console.log("Step 1: Open base URL");


    await base.open(urls.base);


    await base.acceptCookies();


    await page.waitForLoadState("load");



    // Search Payment Locations

    console.log("Step 2: Search Payment Locations");


    await paymentPage.searchPaymentLocations(base);



    // Verify navigation

    console.log("Step 3: Verify Payment Locations page");


    await paymentPage.verifyPaymentLocationsPage();



    // Search table

    console.log("Step 4: Verify table search");


    await paymentPage.searchLocationInTable();



    // Pagination

    console.log("Step 5: Verify pagination");


    await paymentPage.verifyPagination();


});