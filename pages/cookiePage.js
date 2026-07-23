const { expect } = require("@playwright/test");

class CookiePage {
  constructor(page) {
    this.page = page;

    // Cookie preference modal
    this.managePreferencesBtn = page.locator(
      "//button[contains(@aria-label, 'Manage Preferences,')]",
    );

    this.yourPrivacyTab = page.locator(
      "//h3[normalize-space(text())='Your Privacy']",
    );

    this.strictlyNecessaryTab = page.locator(
      "//h3[normalize-space(text())='Strictly Necessary Cookies']",
    );

    this.performanceTab = page.locator(
      "//h3[normalize-space(text())='Performance Cookies']",
    );

    this.functionalTab = page.locator(
      "//h3[normalize-space(text())='Functional Cookies']",
    );

    this.targetingTab = page.locator(
      "//h3[normalize-space(text())='Targeting Cookies']",
    );

    // Cookie checkboxes

    this.performanceCookieSwitch = page.locator("#ot-group-id-C0002");

    this.functionalCookieSwitch = page.locator("#ot-group-id-C0003");

    this.targetingCookieSwitch = page.locator("#ot-group-id-C0004");

    this.savePreferenceBtn = page.locator(
      "//button[contains(@class,'save-preference-btn')]",
    );

    this.cookieSettingIcon = page.locator(
      "//div[@class='ot-floating-button__front custom-persistent-icon']",
    );

    this.targetingEnable = page.locator("//label[@for='ot-group-id-C0004']");
  }

  async openPreferences() {
    await this.managePreferencesBtn.waitFor({
      state: "visible",
    });

    await this.managePreferencesBtn.click();
  }

  async verifyDefaultCookieSettings() {
    await expect(this.yourPrivacyTab).toBeVisible();

    console.log("Your Privacy displayed");

    await this.strictlyNecessaryTab.click();

    await expect(this.strictlyNecessaryTab).toBeVisible();

    await this.performanceTab.click();

    await expect(this.performanceTab).toBeVisible();

    const performanceChecked = await this.performanceCookieSwitch.isChecked();

    expect(performanceChecked).toBeFalsy();

    console.log("Performance Cookie is disabled by default");

    await this.functionalTab.click();

    await expect(this.functionalTab).toBeVisible();

    const functionalChecked = await this.functionalCookieSwitch.isChecked();

    expect(functionalChecked).toBeFalsy();

    console.log("Functional Cookie is disabled by default");

    await this.targetingTab.click();

    await expect(this.targetingTab).toBeVisible();

    const targetingChecked = await this.targetingCookieSwitch.isChecked();

    expect(targetingChecked).toBeFalsy();

    console.log("Targeting Cookie is disabled by default");
  }

  async verifyCookiesNotPresent(cookieNames) {
    const cookies = await this.page.context().cookies();

    for (const name of cookieNames) {
      const exists = cookies.some((cookie) => cookie.name === name);

      expect(exists).toBeFalsy();

      console.log(`${name} NOT FOUND`);
    }
  }

  async verifyCookiesPresent(cookieNames) {
    const cookies = await this.page.context().cookies();

    console.log("--- Available Cookies ---");

    cookies.forEach((cookie) => {
      console.log(`Name: ${cookie.name}, Domain: ${cookie.domain}`);
    });

    console.log("--- Required Cookie Verification ---");

    for (const name of cookieNames) {
      const cookie = cookies.find((c) => c.name === name);

      if (cookie) {
        console.log(`PASS: ${name} FOUND`);
        console.log(`Value  : ${cookie.value}`);
        console.log(`Domain : ${cookie.domain}`);
        console.log(`Path   : ${cookie.path}`);
      } else {
        console.log(`FAIL: ${name} NOT FOUND`);
      }

      expect(cookie, `Expected cookie '${name}' to be present`).toBeTruthy();
    }
  }

  async enableTargetingCookies() {
    await this.cookieSettingIcon.click();

    await this.targetingTab.click();

    await this.targetingEnable.click();

    await this.savePreferenceBtn.click();

    await this.page.reload();
  }
}

module.exports = { CookiePage };
