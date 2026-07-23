const { expect } = require("@playwright/test");

class lakepage {
  constructor(page, request) {
    this.page = page;
    this.request = request;
    this.searchIcon = page.locator("//button[@class='search']");
    this.searchInput = page.locator("#search-box-input");
    this.result = page.locator(
      "//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Lake Murray, SC']",
    );
    this.LSresult = page.locator(
      "//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Lower Saluda River SC']",
    );
    this.riverLevelFrame = page.locator("#lake-level");
    this.dateTime = page.locator(".date-time");
    this.lowersaludariverLevelFrame = page.locator("#river-level-app");
    this.acceptbtn = page.locator(
      "//div[contains(@class,'rich-text')]//button[@class='accept-button' and normalize-space(text())='Accept']",
    );
  }

  async navigateToLakeMurrayPage(base) {
    await expect(this.searchIcon).toBeVisible();
    await this.searchIcon.click();
    await base.handleRandomLocationModal();
    await this.searchIcon.click();
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill("Lake Murray SC");
    await this.searchInput.press("Enter");
    await this.page.waitForLoadState("load");
    await base.CoveoresultIsVisible();
    await expect(this.result).toBeVisible();
    await this.result.click();
    await this.page.waitForLoadState("load");
    await expect(this.page).toHaveURL(/lake-murray-sc/);
  }

  async navigateToLowerSaludaPage(base) {
    await expect(this.searchIcon).toBeVisible();
    await this.searchIcon.click();
    await base.handleRandomLocationModal();
    await this.searchIcon.click();
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill("Lower Saluda River SC");
    await this.searchInput.press("Enter");
    await this.page.waitForLoadState("load");
    await base.CoveoresultIsVisible();
    await expect(this.LSresult).toBeVisible();
    await this.LSresult.click();
    // await this.page.waitForLoadState("load");
    await expect(this.page).toHaveURL(/lower-saluda-river-sc/);
  }
  async verifyAcceptButtonDisplay() {
    await this.acceptbtn.scrollIntoViewIfNeeded();
    await this.acceptbtn.click();
  }
  async getUIDate() {
    await this.riverLevelFrame.scrollIntoViewIfNeeded();
    const dateTime = await this.dateTime.innerText();
    // console.log("dateTime")
    return dateTime.split("|")[0].trim();
  }
  async getLowerSaludaUIDate() {
    await expect(this.page.locator("#river-level-app .date-time")).toBeVisible({
      timeout: 60000,
    });
    // await this.lowersaludariverLevelFrame.scrollIntoViewIfNeeded();
    const dateTime = await this.dateTime.innerText();
    //  console.log("dateTime")
    return dateTime.split("|")[0].trim();
  }
  async verifyTimestampHasTodaysDate() {
    const uiDate = await this.getUIDate();
    const todayEST = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    expect(uiDate).toBe(todayEST);
  }
  async verifyTimestampHasTodaysDateInLowerSaluda() {
    const uiDate = await this.getLowerSaludaUIDate();
    const todayEST = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    expect(uiDate).toBe(todayEST);
  }
  async getRiverLevel() {
    const level = await this.page.locator("#lake-level-current").innerText();
    const levelNumber = level.replace(/[^0-9.]/g, "");
    return Number(levelNumber);
  }
  async getLowerSaludaLakeDischarge() {
    const level = await this.page.locator("//div[@class='cfs']").innerText();
    const levelNumber = level.replace(/[^0-9.]/g, "");
    return Number(levelNumber);
  }
  async getRiverDifference() {
    const difference = await this.page
      .locator("#lake-level-difference")
      .innerText();

    const differenceNumber = difference.match(/-?\d+(\.\d+)?/)[0];

    return Number(differenceNumber);
  }
  async getLakeMurrayAPIData() {
    const response = await this.request.get(
      "https://publicservice.dominionenergyse.com/api/lakemurray",
    );

    expect(response.ok()).toBeTruthy();

    const api = await response.json();

    console.log("API Response:", api);

    return {
      currentLevel: api.CurrentLevel,
      difference: api.Difference,
      fileDate: api.FileDate,
    };
  }
  async getLowerSaludaAPIData() {
    const response = await this.request.get(
      "https://publicservice.dominionenergyse.com/api/lakedischarge?lowersaluda",
    );
    expect(response.ok()).toBeTruthy();
    const api = await response.json();
    console.log("API Response:", api);
    return {
      discharge: api.Discharge,
      leveldate: api.LevelDate,
    };
  }
  async verifyLowerSaludaRiverLevelDateAPI() {
    const api = await this.getLowerSaludaAPIData();

    const apiDate = new Date(api.leveldate);

    const datePart = apiDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const timePart = apiDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const expectedDate = `${datePart} | ${timePart}`;

    const uiDate = (await this.page.locator(".date-time").innerText()).trim();

    console.log("API Raw Date:", api.leveldate);
    console.log("Expected UI Date:", expectedDate);
    console.log("UI Date:", uiDate);

    expect(uiDate).toBe(expectedDate);
  }

  async verifyRiverLevelDateAPI() {
    const api = await this.getLakeMurrayAPIData();

    const apiDate = new Date(api.fileDate);

    const datePart = apiDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const timePart = apiDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const expectedDate = `${datePart} | ${timePart}`;

    const uiDate = (await this.page.locator(".date-time").innerText()).trim();

    console.log("API Raw Date:", api.fileDate);
    console.log("Expected UI Date:", expectedDate);
    console.log("UI Date:", uiDate);

    expect(uiDate).toBe(expectedDate);
  }
  async verifyRiverLevelAPI() {
    const api = await this.getLakeMurrayAPIData();
    const uiLevel = await this.getRiverLevel();
    const uiDifference = await this.getRiverDifference();

    console.log("API Current Level:", api.currentLevel);
    console.log("UI River Level:", uiLevel);
    console.log("API Difference:", api.difference);
    console.log("UI Difference:", uiDifference);

    expect(Number(uiLevel)).toBe(api.currentLevel);
    expect(uiDifference).toBe(api.difference);
  }
  async verifyLowerSaludaRiverLevelAPI() {
    const api = await this.getLowerSaludaAPIData();
    // const uiLevel = await this.getLowerSaludaRiverLevel();
    const uiDischarge = await this.getLowerSaludaLakeDischarge();
    console.log("Discharge level in API:", api.discharge);
    console.log("Level discharge in UI:", uiDischarge);
    expect(uiDischarge).toBe(api.discharge);
  }
}
module.exports = { lakepage };
