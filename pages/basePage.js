const { acceptCookies } = require('../utils/common');

class BasePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = 'https://www.dominionenergy.com';  // Default URL
    this.retries = 3;  // Default retry count
    this.retryDelay = 5000;  // Default retry delay (3 seconds)
  }
  // Retry logic for page navigation and waiting for DOM element
  async retryGoto(url, retries = this.retries, delay = this.retryDelay, selector = 'body') {
    let attempt = 0;
    while (attempt < retries) {
      try {
        // Attempt to navigate to the URL
        await this.page.goto(url, { waitUntil: 'load', timeout: 30000 });

        // Wait for a specific DOM element to become visible
        await this.page.locator(selector).waitFor({ state: 'visible', timeout: 30000 });

        return; // Success: exit the loop
      } catch (err) {
        // Retry on connection errors or timeouts
        if ((err.message.includes('ERR_CONNECTION_CLOSED') || err.message.includes('Timeout')) && attempt < retries - 1) {
          console.log(`Retrying navigation to ${url} (Attempt ${attempt + 1})`);
          await this.page.waitForTimeout(delay); // Delay before retry
          attempt++;
        } else {
          console.log(`Error: ${err.message}`);
          throw err; // Throw if other errors or max retries reached
        }
      }
    }
    throw new Error(`Failed to navigate to ${url} after ${retries} attempts`);
  }

  // Open the base URL with retry logic
  async open(url = this.baseUrl) {
    await this.retryGoto(url);
  }

  // async open(url = 'https://www.dominionenergy.com') {
  //   //await this.page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  //   await this.page.goto(url, { waitUntil: 'load', timeout: 60000 });
  //  // await this.page.waitForTimeout(2000); // let scripts load
  // }


  async acceptCookies(timeout) {
    return acceptCookies(this.page, timeout);
  }

  async handleLocationModal() {
    const locationModal = this.page.locator('#modal-overlay');
    if (await locationModal.count() && await locationModal.isVisible()) {
      const firstOption = locationModal.locator("a.tile.location-tile").first();
      await firstOption.click();
      const continueBtn = this.page.locator("button.location-continue-btn");
      await continueBtn.click();
      await this.page.waitForLoadState('load');
    }
  }

  async handleLocationVirginia() {
    const locationModal = this.page.locator('#modal-overlay');

    if (await locationModal.count() && await locationModal.isVisible()) {
      const virginiaOption = locationModal.locator("a.tile.location-tile[data-location='Virginia']");
      await virginiaOption.click();

      const continueBtn = this.page.locator("button.location-continue-btn");
      await continueBtn.click();
      await this.page.waitForLoadState('load');
    }
  }
  async handleLocationSouthCarolina() {
    const locationModal = this.page.locator('#modal-overlay');

    if (await locationModal.count() && await locationModal.isVisible()) {
      const virginiaOption = locationModal.locator("a.tile.location-tile[data-location='South Carolina']");
      await virginiaOption.click();

      const continueBtn = this.page.locator("button.location-continue-btn");
      await continueBtn.click();

      await this.page.waitForLoadState('load');
    }
  }
  async handleLocationNorthCarolina() {
    const locationModal = this.page.locator('#modal-overlay');

    if (await locationModal.count() && await locationModal.isVisible()) {
      const virginiaOption = locationModal.locator("a.tile.location-tile[data-location='North Carolina']");
      await virginiaOption.click();

      const continueBtn = this.page.locator("button.location-continue-btn");
      await continueBtn.click();

      await this.page.waitForLoadState('load');
    }
  }

  async handleChooselater() {
    const modal = this.page.locator('#modal-overlay');
    if (await modal.isVisible()) {
      const chooseLater = this.page.locator("//a[@class='cta-btns-text' and contains(text(), 'Choose Later')]");
      if (await chooseLater.isVisible()) {
        console.log('Modal was present, clicking "Choose Later"');
        await chooseLater.click();
        await this.page.waitForLoadState('load');
      }
    }
    else {
      console.log('Modal not visible');
    }
  }
  async closeAllFilters() {
    console.log("Step: Closing all active filters if present");

    // Locator for all close filter buttons
    const closeButtonLocator = this.page.locator("//button[@id='close_filter_btn']");

    // Loop until no close buttons remain
    while (await closeButtonLocator.count() > 0) {
      const button = closeButtonLocator.first();

      // Wait until the button is visible
      await button.waitFor({ state: 'visible' });

      // Optional: scroll into view (can skip if using JS click)
      await button.scrollIntoViewIfNeeded();

      // Click using JavaScript to avoid scroll/overlay issues
      await page.evaluate((el) => el.click(), await button.elementHandle());
      console.log("Close button clicked");

      // Wait a short time for DOM to update after removal
      await page.waitForTimeout(300);
    }

    console.log("All active filter buttons have been closed.");
  }
  async handleRandomLocationModal() {
    const locationModal = this.page.locator('#modal-overlay');
    if (await locationModal.count() && await locationModal.isVisible()) {
      // Find all location tiles
      const locationTiles = locationModal.locator("a.tile.location-tile");

      // Get the number of location tiles
      const tileCount = await locationTiles.count();

      // Generate a random index to select a tile
      const randomIndex = Math.floor(Math.random() * tileCount);

      // Click the randomly selected location tile
      const randomTile = locationTiles.nth(randomIndex);
      await randomTile.click();

      // Continue with the next steps (click the continue button)
      const continueBtn = this.page.locator("button.location-continue-btn");
      await continueBtn.click();
      await this.page.waitForLoadState('load');
    }
  }

  async CoveoresultIsVisible() {
    const coveoresult = this.page.locator(
      "//*[@id='coveo01cd4840']//*[@class='coveo-result-list-container coveo-list-layout-container']//*[@class='coveo-list-layout CoveoResult']"
    ).first();
    await this.page.waitForTimeout(2000);
    // First immediate check
    if (!(await coveoresult.isVisible())) {
      for (let i = 0; i < 3; i++) {
        await this.page.waitForTimeout(10000);

        if (await coveoresult.isVisible()) {
          break;
        }

        await this.page.reload();
      }
    }

  }


  async handleFeedbackModal(){
    const feedbackModal = this.page.locator(
    "//div[contains(@class,'uws-modal') and contains(@class,'uws-survey-modal') and @role='dialog' and @aria-modal='true']"
  );
   if (await feedbackModal.first().isVisible()) {
    const closeBtn = feedbackModal
      .first()
      .locator("button.uws-modal__close[aria-label='Close']");

    await closeBtn.click();
    return true; // modal was present & closed
  } else {
    // your else logic goes here
    return false; // modal not present
  }

  }
  // Function to check network status and log error codes
  async checkNetworkStatus() {
    let networkError = false;

    // Keep track of the main page URL
    const mainPageUrl = this.page.url();

    // Listen for failed requests
    this.page.on('requestfailed', (request) => {
      // Check if the failed request is related to the current page URL
      if (request.url().startsWith(mainPageUrl)) {
        console.log(`Request failed: ${request.url()} - Error: ${request.failure().errorText}`);
        networkError = true;
      }
    });

    // Listen for responses and log status codes for the current page URL
    this.page.on('response', (response) => {
      // Check if the response is related to the current page URL
      if (response.url().startsWith(mainPageUrl) && !response.ok()) {
        console.log(`Response error: ${response.status()} for ${response.url()}`);
        networkError = true;
      }
    });

    // Wait for some time to allow network activity to finish (adjust this depending on your use case)
    await this.page.waitForTimeout(2000);  // 2 seconds (you can adjust if needed)

    // Return result based on whether there was a network error
    if (networkError) {
      console.log('There were network errors related to the current page URL.');
      return false;  // Indicates network errors
    }

    console.log('No network errors detected for the current page URL.');
    return true;  // Indicates no network errors
  }
}



module.exports = { BasePage };


