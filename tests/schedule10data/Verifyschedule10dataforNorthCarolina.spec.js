const { test, expect } = require("@playwright/test");
const urls = require("../../config/urls.json");
const { BasePage } = require("../../pages/basePage");
const { Schedule10Page } = require("../../pages/Schedule10Page");

test("Verify Correct Calendar Date And Events On Schedule10 North Carolina", async ({
  page,
}) => {
  test.setTimeout(300000);

  const base = new BasePage(page);

  const schedule = new Schedule10Page(page);

  await base.handleFeedbackModal();

  await base.open(urls.base);

  await base.acceptCookies();

  await page.waitForLoadState("load");

  await schedule.openSchedule10ForNorthCarolina(base);

  expect(page.url()).toContain("/north-carolina/rates-and-tariffs/schedule-10");

  await schedule.verifyCalendar();

  await schedule.verifyCalendarEvents();
});
