const { test } = require('@playwright/test');
const { BasePage } = require('../pages/basePage');
const { rebatefinder } = require('../pages/rebatefinder');


test('Verify Save Energy Rebate Finder functionality', async ({ page }) => {

    test.setTimeout(300000);

    const base = new BasePage(page);
    const rebate = new rebatefinder(page);

    await base.handleFeedbackModal();
    await rebate.navigateToSaveEnergy(base);

    await rebate.verifyRebateFinderVisible();

    await rebate.expandRebateFinder();

    await rebate.collapseRebateFinder();

    await rebate.verifyCoveoSearchAndDefaultLocation();

    await rebate.verifySearchResultsAndResultsPerPage();

    await rebate.verifyAllFacetCountsMatchResultCount();

    await rebate.verifyNoresultsMessage();

});
