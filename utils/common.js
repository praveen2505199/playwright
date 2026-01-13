const DEFAULT_TIMEOUT = 10000;

async function acceptCookies(page, timeout = DEFAULT_TIMEOUT) {
  const banner = page.locator('#onetrust-banner-sdk');
  try {
    await banner.waitFor({ state: 'visible', timeout });

    const acceptById = page.locator('#onetrust-accept-btn-handler');
    if (await acceptById.count() && await acceptById.isVisible()) {
      await acceptById.click();
    } else {
      const acceptByText = page.locator("xpath=//*[normalize-space(text())='Accept All Cookies' or contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'accept all')]");
      if (await acceptByText.count() && await acceptByText.isVisible()) {
        await acceptByText.click();
      } else {
        const inBanner = banner.locator("xpath=.//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'accept')]");
        if (await inBanner.count() && await inBanner.isVisible()) {
          await inBanner.first().click();
        }
      }
    }

    try { await banner.waitFor({ state: 'hidden', timeout: 8000 }); } catch (e) {}
    return true;
  } catch (err) {
    return false;
  }
}

async function rejectCookies(page, timeout = DEFAULT_TIMEOUT) {
  const banner = page.locator('#onetrust-banner-sdk');
  try {
    await banner.waitFor({ state: 'visible', timeout });

    const rejectById = page.locator('#onetrust-reject-all-handler');
    if (await rejectById.count() && await rejectById.isVisible()) {
      await rejectById.click();
    } else {
      const rejectByText = page.locator(
        "xpath=//*[normalize-space(text())='Reject All Cookies' or contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'reject all')]"
      );
      if (await rejectByText.count() && await rejectByText.isVisible()) {
        await rejectByText.click();
      } else {
        const inBanner = banner.locator(
          "xpath=.//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'reject')]"
        );
        if (await inBanner.count() && await inBanner.isVisible()) {
          await inBanner.first().click();
        }
      }
    }

    try { 
      await banner.waitFor({ state: 'hidden', timeout: 8000 }); 
    } catch (e) {}

    return true;
  } catch (err) {
    return false;
  }
}

async function clickAndWaitForNavigation(page, locator, options = { waitUntil: 'load', timeout: 20000 }) {
  try {
    const wait = page.waitForNavigation(options).catch(() => null);
    await locator.click();
    await wait;
  } catch (err) {
    // best-effort click
  }
}

module.exports = {
  acceptCookies,
  clickAndWaitForNavigation,
  rejectCookies
};
