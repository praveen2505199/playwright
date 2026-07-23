const { expect } = require("@playwright/test");

class SmartPricingPlanPage {
  constructor(page) {
    this.page = page;

    this.calendars = page.locator(".smart-pricing .dom-calendar");
  }
  async navigateToSmartPricingPlan(base) {
    const searchIcon = this.page.locator("//button[@class='search']");
    await searchIcon.click();
    await base.handleLocationVirginia();
    await this.page.waitForTimeout(1000);
    await searchIcon.click();
    const searchInput = this.page.locator("#search-box-input");

    await searchInput.fill("Smart Pricing Plan");
    await searchInput.press("Enter");

    await this.page.waitForLoadState("load");
    await base.CoveoresultIsVisible();
    await this.page
      .locator(
        "//a[contains(@href,'/Smart-Pricing-Plan') and contains(@class,'CoveoResultLink')]",
      )
      .click();
    await this.page.waitForLoadState("load");

    console.log("Smart Pricing Plan URL:", this.page.url());
  }

  async verifyCalendar(calendarIndex, calendarName) {
    const calendar = this.calendars.nth(calendarIndex - 1);

    await calendar.scrollIntoViewIfNeeded();

    await expect(calendar).toBeVisible({
      timeout: 30000,
    });

    console.log(`Step: ${calendarName} Smart Pricing Calendar visible`);

    // Calendar title
    const calendarTitle = calendar.locator(".dom-cal-date");

    await calendarTitle.scrollIntoViewIfNeeded();
    await expect(calendarTitle).toBeVisible({
      timeout: 30000,
    });
    // console.log(await calendarTitle.evaluate(el => el.outerHTML));
    // Wait for knockout binding to populate month
    await expect(calendarTitle).toHaveText(/\w+\s+\d{4}/, {
      timeout: 30000,
    });

    const actualMonth = (await calendarTitle.textContent()).trim();

    console.log("Actual Month:", actualMonth);
    const expectedMonth = new Date().toLocaleString("default", {
      month: "long",
    });

    const expectedYear = new Date().getFullYear();

    expect(actualMonth).toBe(`${expectedMonth} ${expectedYear}`);

    const dayCells = calendar.locator(".dom-calendar-col .dom-cal-day");

    await expect(dayCells.first()).toBeVisible({
      timeout: 30000,
    });

    await this.verifyEvents(calendarIndex, calendarName);
  }

  async verifyEvents(calendarIndex, calendarName) {
    const calendar = this.calendars.nth(calendarIndex - 1);

    const dayCells = calendar.locator(".dom-calendar-days .dom-calendar-col");

    const totalDays = await dayCells.count();

    // console.log(`${calendarName} Total calendar days found:`,totalDays);

    const today = new Date().getUTCDate();

    const eventColors = {
      A: "Red",
      B: "Yellow",
      C: "Green",
    };

    for (let i = 0; i < totalDays; i++) {
      const cell = dayCells.nth(i);

      const dayLocator = cell.locator(".dom-cal-day");

      if ((await dayLocator.count()) === 0) continue;

      const dayText = (await dayLocator.innerText()).trim();

      if (!dayText) continue;

      const day = parseInt(dayText);

      const eventLocator = cell.locator(".dom-event");

      let eventValue = "";

      if ((await eventLocator.count()) > 0) {
        eventValue = (await eventLocator.innerText()).trim();
      }

      /*
             Past and Current days
             should have A/B/C
            */

      if (day <= today) {
        expect(["A", "B", "C"], `Day ${day} missing event`).toContain(
          eventValue,
        );

        console.log(
          `Day ${day} => Event: "${eventValue}" => Color: ${eventColors[eventValue]}`,
        );
      }

      /*
             Future days should be empty
            */

      if (day > today) {
        expect(eventValue, `Future Day ${day} should be empty`).toBe("");

        console.log(`Day ${day} => Event: "" => Color: No Color`);
      }
    }
  }
}

module.exports = { SmartPricingPlanPage };
