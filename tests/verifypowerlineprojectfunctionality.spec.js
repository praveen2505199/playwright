const { test, expect } = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');


test('verifyPowerLineProjectsSearchAndMapFunctionality', async ({ page }) => {

    test.setTimeout(180000);
    const base = new BasePage(page);
    console.log("Step 1: Open base URL and accept cookies");
    await base.open(urls.base);
    await base.acceptCookies();
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);

    console.log("Step 2:Click Search button and search Powerline Projects");
    const searchIcon = page.locator("//button[@class='search']");
    await expect(searchIcon).toBeVisible({ timeout: 1000 });
    await searchIcon.isEnabled({ timeout: 1000 });
    await searchIcon.click();

    await base.handleRandomLocationModal();
    await page.waitForTimeout(1000);
    await searchIcon.click();
    const searchInput=page.locator('#search-box-input');
   // await page.waitForTimeout(1000);
   // await expect(searchInput).toBeVisible({ timeout: 1000 });
    await searchInput.fill('Power Line Projects');
    await page.waitForTimeout(1000);
    console.log("Step 3: click the search results - 'Powerline Projects'")
    await page.keyboard.press('Enter');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    await base.CoveoresultIsVisible();
    const result = page.locator("//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Power Line Projects']");
    await page.waitForTimeout(1000);
    //await expect(result).toBeVisible({ timeout: 2000 });
    await result.click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    console.log("Step 4: Verify it navigates to Power Line Projects page")
    if (currentUrl.includes('/about/delivering-energy/electric-projects/power-line-projects')) {
     console.log("Powerline Projects page loaded successfully:", currentUrl);

    }else {console.log("Failed to load the correct page.");}

//    Check if the map element exists and is visible
const mapLocator = page.locator("#map");
await expect(mapLocator).toBeVisible();  // Ensure map is visible

// Zoom In and Zoom Out buttons
const zoomInButton = page.locator("a.leaflet-control-zoom-in");
const zoomOutButton = page.locator("a.leaflet-control-zoom-out");

// Click on the Zoom In button
await zoomInButton.click();

// Optionally, wait for a brief moment if necessary (e.g., wait for the zoom to take effect)
await page.waitForTimeout(1000);  // wait 1 second

// Click on the Zoom Out button
await zoomOutButton.click();

// Optionally, wait again after clicking Zoom Out if needed
await page.waitForTimeout(1000);  // wait 1 second


  //---------
  // Check if the region element is visible and exists
const regionLocator = page.locator("//div[@class='region-project']//a[@id='VAC']");
await expect(regionLocator).toBeVisible();  // Ensure the region is visible

// Click on the central Virginia region
await regionLocator.click();

// Execute JavaScript to find selected regions
const selectedRegions = await page.evaluate(() => {
    let selectedRegions = [];
    let markers = document.querySelectorAll('.leaflet-marker-icon'); // Query for markers (regions)
    markers.forEach(marker => {
        if (parseInt(marker.style.zIndex) > 100) { // Assuming selected regions have a higher z-index
            selectedRegions.push(marker.innerText); // Get the text of the marker (e.g. region name)
        }
    });
    return selectedRegions;
});

// Output the selected regions
if (selectedRegions.length > 0) {
    console.log("Selected regions:");
    selectedRegions.forEach(region => {
        console.log(region);
    });
}

// ---Verify user able to search project successfully

// Select the address input and search button
const addressInput = page.locator("#addressInput");
const searchButton = page.locator("#addressInputLabel");
const randomZipCode = "75401"; // Example zip code
await addressInput.fill(randomZipCode);  
const firstSuggestion = page.locator("//div[@id='addressInputautocomplete-list']//div[1]//strong");
await firstSuggestion.waitFor({ state: 'visible', timeout: 20000 });
await firstSuggestion.click();
await searchButton.click();
const marker = page.locator("//img[contains(@class, 'leaflet-marker-icon')]");
// Verify that the marker is placed on the map
await marker.isVisible();
await expect(marker).toBeVisible();

});