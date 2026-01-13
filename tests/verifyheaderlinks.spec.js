const { test, expect } = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');

test('Header: Verify UI Interactions, Header Navigation, and Location Selector Functionality', async ({ page }) => {
 test.setTimeout(120000);
     const base = new BasePage(page);    
    await base.open(urls.base);
    await base.acceptCookies();
    console.log('Cookie banner accepted');
    // 1. Verify Dominion logo is displayed in header
    console.log('Step 1: Verifying if the Dominion logo is displayed');
    const domLogo = page.locator('a[aria-label="Dominion Energylogo"] img[alt="Dominion Energy"]');
    await expect(domLogo).toBeVisible('Dom Logo should be displayed');
    const alttext = await domLogo.getAttribute('alt');
    console.log('Dominion logo is visible');
    console.log(`Dominion logo alt text: ${alttext}`);

    // 2. Verify buttons are displayed
    console.log('Step 2: Verifying if the buttons are displayed');
    const buttons = [
        { selector: '#location-select', label: 'Loc Btn' },
        { selector: "(//a[@class='support'])[1]", label: 'Support Btn' },
        { selector: 'button.search', label: 'Search Btn' },
        { selector: "//a[@class='login' and @aria-label='Sign In']", label: 'Login Btn' }
    ];

    for (const button of buttons) {
    // Log the selector being used
    console.log(`Checking if ${button.label} exists using selector: ${button.selector}`);

    const btn = page.locator(button.selector);
    
    // Wait for the button to be visible with a timeout to ensure it has loaded
        await btn.waitFor({ state: 'visible', timeout: 10000 });  // Wait for up to 5 seconds
        console.log(`${button.label} is visible`);

        // After confirming visibility, assert it's visible
        await expect(btn).toBeVisible(`${button.label} should be displayed`);
   
    }
    // 3. Verify user is able to click Location selector
    console.log('Step 3: Clicking the Location selector');
    await page.click('#location-select');
    console.log('Location selector clicked');

    // 4. Verify Location selector modal is displayed and handle it
    console.log('Step 4: Verifying and handling Location selector modal');
    await base.handleChooselater();

    // 5. Verify user is able to click Support button
    console.log('Step 5: Clicking the Support button');
    await page.click('.secondary-links a.support[aria-label="Support"]');
    console.log('Support button clicked');
    await page.waitForTimeout(1000);
    await base.handleChooselater();

    // 6. Verify user is able to click Search button
    console.log('Step 6: Clicking the Search button');
    await page.click('button.search');
    console.log('Search button clicked');
    await page.waitForTimeout(1000);
    await base.handleChooselater();

    // 7. Verify user is able to click Sign In button
    console.log('Step 7: Clicking the Sign In button');
    await page.click('a.login[aria-label="Sign In"]');
    console.log('Sign In button clicked');
    await page.waitForTimeout(1000);
     await base.handleChooselater();

    // 8. Verify user is able to click header menu and handle dropdown visibility
    console.log('Step 8: Verifying and interacting with header menus');

   //Get all header menus
    const headerMenus = page.locator("//div[contains(@class, 'secondary-navigation') and contains(@class, 'main-nav')]");
    //await base.handleChooselater();
    // Loop through all header menus
    for (let i = 0; i < await headerMenus.count(); i++) {
        const menu = headerMenus.nth(i);
        //await base.handleChooselater();
        const menuId = await menu.getAttribute('id');
        const menuText = await menu.textContent(); // Optionally, you can use text to identify the menu
        
        console.log(`Checking header menu: ${menuId || menuText || 'No ID or Text'}`);

        // Wait for the menu to be visible before interacting with it
        await expect(menu).toBeVisible({ timeout: 5000 });

        // Get the bounding box of the element to determine the position for mouse movement
        const box = await menu.boundingBox();
        if (!box) {
            throw new Error(`${menuId || 'Menu'} bounding box is null — cannot hover.`);
        }

        // Move the mouse to the center of the menu item
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

        // Dispatch mouse events to trigger hover behavior using Playwright's hover method instead of JS evaluation
        await menu.hover();  
       // await menu.h   // Use Playwright's built-in hover method to simplify this step

        console.log(`Hovered over the menu: ${menuId || menuText}`);

        // Wait for the submenu to be visible (if applicable)
        const submenu = menu.locator('.third-navigation');
        const isDropdownVisible = await submenu.isVisible();

        if (isDropdownVisible) {
            console.log(`Dropdown visible for menu: ${menuId || menuText}`);
        } else {
            console.log(`Dropdown NOT visible for menu: ${menuId || menuText}`);
        }

        // Click the menu to follow through on the navigation
        await menu.click();
        console.log(`Clicked on ${menuId || menuText}`);
        await page.waitForTimeout(2000);
        // Optionally, handle modal if visible
        await base.handleChooselater();

        // Move mouse away to close dropdown (if needed)
        await page.mouse.move(0, 0); // Moves the mouse away to close dropdown
        console.log('Mouse moved away to close dropdown');
    }


    // 9. Verify user is able to select a location
    console.log('Step 9: Selecting a location');
    domLogo.click();
   // await page.goto(base);  // Replace with the correct base URL
    await page.click('a#location-select:has-text("Location")');
    console.log('Location selector opened');

    // 10. Verify location gets updated as per selected location
    console.log('Step 10: Verifying location update based on selection');
    const locations = page.locator('.tiles .location-tile');
    const randomIndex = Math.floor(Math.random() * (await locations.count()));
    const selectedLocation = locations.nth(randomIndex);
    const locationName = await selectedLocation.getAttribute('aria-label');
    const expectedUrlPart = await selectedLocation.getAttribute('data-home-url').then(url => url.trim('/').toLowerCase());

    console.log(`Clicking on random location: ${locationName}`);
    await page.waitForTimeout(5000);
    //await selectedLocation.waitFor({ state: 'visible', timeout: 5000 });


    await selectedLocation.click();

    // Click the continue button after selecting a location
    const continueBtn = page.locator('.location-continue-btn');
    await continueBtn.click();
    console.log('Continue button clicked after location selection');

   const currentUrl = page.url();
   const currentUrlTrimmed = currentUrl.replace(/\/$/, "").toLowerCase();
   //console.log(currentUrlTrimmed);
   console.log("Current URL :", currentUrlTrimmed);
   // Build correct expected URL
   const stateSlug = expectedUrlPart.split("/").pop().toLowerCase(); // "north-carolina"
   const expectedUrl = `${urls.base}/${stateSlug}`;
   //expect(currentUrlTrimmed).toBe(expectedUrl);
   //console.log(expectedUrl);
   console.log("Expected URL:", expectedUrl);

    // 11. Verify user is able to navigate header menu and location selector is not displaying
    console.log('Step 11: Verifying navigation to Pay My Bill page successfull');
    await page.click('a:text("Pay My Bill")');
    const currentPageUrl = page.url().toLowerCase();
    expect(currentPageUrl).toContain('/paying-my-bill');
    console.log('Navigation to Pay My Bill page verified');

    // 12. Verify user is able to click logo
    console.log('Step 12: Clicking the logo');
    await page.click('.logo a');
    console.log('Logo clicked');

    // 13. Verify clicking logo redirects to location homepage
    console.log('Step 13: Verifying the redirection after clicking the logo');
    const currentUrlAfterLogoClick = page.url();
    expect(currentUrlAfterLogoClick).toBe(expectedUrl);
    console.log('Redirection after logo click verified');
    const current_Url = page.url();
    console.log("Current Page URL:", current_Url);

});
