const { expect } = require("@playwright/test");

class Schedule10Page {
  constructor(page) {
    this.page = page;

    this.locationMenu = page.locator("//a[@id='location-select']");
    this.searchIcon = page.locator("//button[@class='search']");
    this.searchInput = page.locator("#search-box-input");

    this.calendar = page.locator("//div[@class='dom-calendar']");
    this.calendarTitle = page.locator(".dom-cal-date");

    this.calendarCells = page.locator(
      "(//*[@class='dom-calendar'])[1]//div[contains(@class,'dom-calendar-col')]",
    );
  }

  async openSchedule10ForNorthCarolina(base) {
    await expect(this.locationMenu).toBeVisible();

    await this.locationMenu.click();

    await this.page.waitForTimeout(500);

    await base.handleLocationNorthCarolina();

    await this.page.waitForTimeout(1000);

    await expect(this.searchIcon).toBeVisible({ timeout: 10000 });

    await this.searchIcon.click();

    await this.searchInput.fill("Schedule 10");

    await this.searchInput.press("Enter");

    await this.page.waitForLoadState("load");

    await base.CoveoresultIsVisible();

    const result = this.page.locator(
      "//a[contains(@href,'/Schedule-10') and contains(@class,'CoveoResultLink')]",
    );

    await expect(result).toBeVisible({ timeout: 30000 });

    await result.click();

    await this.page.waitForLoadState("load");

    console.log("Schedule 10 NC URL:", this.page.url());
  }

  async openSchedule10ForVirginia(base) {
    const location = this.page.locator("//a[text()='Location']");

    await expect(location).toBeVisible();

    await location.click();

    await this.page.waitForTimeout(500);

    await base.handleLocationVirginia();

    await this.page.waitForTimeout(1000);

    await expect(this.searchIcon).toBeVisible({ timeout: 10000 });

    await this.searchIcon.click();

    await this.searchInput.fill("Schedule 10 Data");

    await this.searchInput.press("Enter");

    await this.page.waitForLoadState("load");

    await base.CoveoresultIsVisible();

    const result = this.page.locator(
      "//a[contains(@href,'/Schedule-10-Data') and contains(@class,'CoveoResultLink')]",
    );

    await expect(result).toBeVisible({ timeout: 30000 });

    await result.click();

    await this.page.waitForLoadState("load");

    console.log("Schedule 10 Virginia URL:", this.page.url());
  }

  async verifyCalendar() {
    await this.calendar.scrollIntoViewIfNeeded();

    await expect(this.calendar).toBeVisible({
      timeout: 30000,
    });

    await this.calendarTitle.waitFor({
      state: "attached",
      timeout: 30000,
    });

    await this.page.waitForFunction(
      () => {
        const element = document.querySelector(
          ".dom-calendar-title .dom-cal-date",
        );

        return element && element.innerText.trim().length > 0;
      },
      {
        timeout: 30000,
      },
    );

    const actual = await this.calendarTitle.innerText();

    const date = new Date();

    const month = date.toLocaleString("default", {
      month: "long",
    });

    const year = date.getFullYear();

    const expected = `${month} ${year}`;

    console.log("Calendar Actual:", actual);

    console.log("Calendar Expected:", expected);

    expect(actual.trim()).toBe(expected);
  }

  async verifyCalendarEvents() {
    const today = new Date().getUTCDate();

    const eventColors = {
      A: "rgb(172, 12, 51)",
      B: "rgb(240, 187, 15)",
      C: "rgb(0, 108, 62)",
    };

    const eventColorNames = {
      A: "Red",
      B: "Yellow",
      C: "Green",
    };

    await this.calendarCells.first().waitFor({
      state: "visible",
      timeout: 30000,
    });

    const cellCount = await this.calendarCells.count();

    //console.log("Total calendar Days for this month:", cellCount);

    for (let i = 0; i < cellCount; i++) {
      const cell = this.calendarCells.nth(i);

      const dayLocator = cell.locator(".dom-cal-day");

      if ((await dayLocator.count()) === 0) {
        continue;
      }

      const dayText = (await dayLocator.innerText()).trim();

      if (!dayText) {
        continue;
      }

      const day = parseInt(dayText, 10);

      const eventLocator = cell.locator(".dom-event");

      let eventValue = "";

      if ((await eventLocator.count()) > 0) {
        eventValue = (await eventLocator.innerText()).trim();
      }

      const backgroundColor = await cell.evaluate((element) => {
        return window.getComputedStyle(element).backgroundColor;
      });

      // Map color
      let colorName = "No Color";

      if (eventValue && eventColorNames[eventValue]) {
        colorName = eventColorNames[eventValue];
      }

      console.log(
        `Day ${day} => Event: "${eventValue}" => Color: ${colorName}`,
      );

      // Validate today and previous days
      if (day <= today) {
        await this.page.waitForTimeout(2000);

        expect(
          ["A", "B", "C"],
          `Day ${day} should contain A/B/C event`,
        ).toContain(eventValue);

        expect(backgroundColor, `Day ${day} incorrect background color`).toBe(
          eventColors[eventValue],
        );
      }

      // Validate future days
      if (day > today) {
        expect(eventValue, `Future Day ${day} should have empty event`).toBe(
          "",
        );
        // Future days should not have event color classes
        const className = await cell.getAttribute("class");

        expect(
          className,
          `Future Day ${day} should not have event color`,
        ).not.toMatch(/dom-event-[abc]/i);

        console.log(`Day ${day} => Event: "" => Color: No Color`);
      }
    }
  }
}

module.exports = { Schedule10Page };
