const { test, expect } = require("@playwright/test");
const urls = require("../../config/urls.json");
const { BasePage } = require("../../pages/basePage");
const { Schedule10Page } = require("../../pages/Schedule10Page");

test("Verify Correct Calendar Date And Events On Schedule10 Virginia", async ({
  page,
}) => {
  test.setTimeout(300000);

  const base = new BasePage(page);

  const schedule = new Schedule10Page(page);

  await base.handleFeedbackModal();

  await base.open(urls.base);

  await base.acceptCookies();

  await page.waitForLoadState("load");

  await schedule.openSchedule10ForVirginia(base);

  expect(page.url()).toContain("/virginia/rates-and-tariffs/schedule-10-data");

  await schedule.verifyCalendar();

  await schedule.verifyCalendarEvents();
});
