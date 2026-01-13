const { test, expect } = require('@playwright/test');
const urls = require('../../config/urls.json');
const { BasePage } = require('../../pages/basePage');

test('Verify Correct Calendar Date And Events On Schedule10 NorthCarolina', async ({ page }) => {

    test.setTimeout(200000);
    const base = new BasePage(page);
    
    console.log("Step 1: Open base URL and accept cookies");
    await base.open(urls.base);
    await base.acceptCookies();
    await page.waitForLoadState('load');
     await ValidateSchedule10dataforNorthCarolina(page,base);

    
           
});
async function ValidateSchedule10dataforNorthCarolina(page, base){
    const locationMenu = page.locator("//a[@id='location-select']");
    await page.waitForTimeout(500);
    await expect(locationMenu).toBeVisible();

    await locationMenu.click();
    await page.waitForTimeout(500);
    await base.handleLocationNorthCarolina();
    await page.waitForTimeout(1000);
     const searchIcon = page.locator("//button[@class='search']");
    await expect(searchIcon).toBeVisible({ timeout: 1000 });
    
    await searchIcon.click();
    const searchInput = page.locator('#search-box-input');
    await searchInput.fill('Schedule 10');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('load');
   // await page.waitForSelector("//*[@id='coveo01cd4840']//*[@class='coveo-result-list-container coveo-list-layout-container']//*[@class='coveo-list-layout CoveoResult']");
    await base.CoveoresultIsVisible();
    const result = page.locator("//a[contains(@href, '/Schedule-10') and contains(@class, 'CoveoResultLink')]");
    await result.click();
    await page.waitForLoadState('load');
    const currentUrl = page.url();
    
    console.log("Step 2: Navigates to Schedule 10 data page in North Carolina");
    if (currentUrl.includes('/north-carolina/rates-and-tariffs/schedule-10')) {
        console.log("North-Carolina - Schedule 10 Datapage loaded successfully:", currentUrl);
    } else {
        console.log("Failed to load the correct page.");
    }
    const calendarLocator = page.locator("(//div[@class='dom-calendar'])");
    await calendarLocator.scrollIntoViewIfNeeded();
    await expect(calendarLocator).toBeVisible();
    console.log("Step 3: Schedule 10 Customers is visible.");

    // Verifying calendar displays the current month and year
    const calendarDateLocator = page.locator("(//*[@class='dom-calendar'])//*[@class='dom-calendar-row dom-calendar-title']//*[@class='dom-calendar-col dom-cal-col-5 dom-cal-date']");
    await page.waitForTimeout(500);
    const currentDate = new Date();
    const currentDay = currentDate.getDate().toString().padStart(2, '0');
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    const expectedDate = `${currentMonth} ${currentYear}`;
    const calendarText = await calendarDateLocator.textContent();
     await page.waitForTimeout(1000);

    console.log(`Current Date: ${currentMonth} ${currentYear}`);
    console.log(`Calendar Text: ${calendarText}`);
    console.log(`Expected Date: ${expectedDate}`);

    if (calendarText.trim() === expectedDate) {
        console.log("The calendar date matches the expected date.");
        await expect(calendarDateLocator).toBeVisible();
    } else {
        console.log("The calendar date does not match the expected date.");
    }

    // Verifying current day
    // Get today and tomorrow (UTC)
    const today = new Date().getUTCDate();
    const tomorrow = today + 1;
    //Display total days in calendar
    const totaldays= page.locator("(//*[@class='dom-calendar'])//div[@class='dom-cal-day']");
   await page.waitForTimeout(1000);
    const totaldays_count= await totaldays.count();
    console.log(`Total calendar days found: ${totaldays_count}`);
    
    // Get all calendar cells in the first calendar
    const dayCells = page.locator("(//*[@class='dom-calendar'])//div[contains(@class,'dom-calendar-col')]");
    //(//*[@class='dom-calendar'])[1]//div[@class='dom-cal-day']
    //(//*[@class='dom-calendar'])[1]//div[contains(@class,'dom-calendar-col')]
    const count = await dayCells.count();
    //console.log(`Total calendar cells found: ${count}`);
    await page.waitForTimeout(1000);
    for (let i = 0; i < count; i++) {
        const cell = dayCells.nth(i);

        // Skip cells without a day number
        const dayLocator = cell.locator(".dom-cal-day").first();
        if ((await dayLocator.count()) === 0) continue;

        await dayLocator.waitFor({ state: 'visible' });
        let dayText = (await dayLocator.innerText()).trim();

        // Skip empty/placeholder cells
        if (!dayText || dayText === "\u00a0") continue;

        const day = parseInt(dayText, 10);

        // Get event value if it exists
        const eventLocator = cell.locator(".dom-event").first();
        const eventValue = (await eventLocator.count())
            ? (await eventLocator.innerText()).trim()
            : "";

        console.log(`Day ${day} → Event: "${eventValue}"`);

        // 🔹 Validate days up to today
        if (day <= today) {
            if (["A", "B", "C"].includes(eventValue)) {
                console.log(`Day ${day} is valid`);
            } else {
                console.log(`Day ${day} is missing A/B/C`);
            }
        }

        // 🔹 Validate tomorrow
        if (day === tomorrow) {
            if (!eventValue) {
                console.log(`Tomorrow (day ${day}) is correctly empty`);
            } else {
                console.log(`Tomorrow (day ${day}) should be empty but found "${eventValue}"`);
            }
        }
    }
}