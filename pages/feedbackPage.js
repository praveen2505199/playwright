const { expect } = require("@playwright/test");

class FeedbackPage {
  constructor(page) {
    this.page = page;

    this.feedbackButton = page.getByRole("button", { name: "Feedback" });

    this.feedbackModal = page.locator(
      "//div[contains(@class, 'uws-modal') and contains(@class, 'uws-survey-modal') and @role='dialog' and @aria-modal='true']",
    );
  }

  async openFeedbackModal() {
    await this.feedbackButton.waitFor({
      state: "visible",
      timeout: 30000,
    });

    await this.feedbackButton.click();

    await this.feedbackModal.waitFor({
      state: "visible",
      timeout: 40000,
    });
  }

  async verifyFeedbackModalVisible() {
    await expect(this.feedbackModal).toBeVisible();

    console.log("Feedback modal is visible");
  }
}

module.exports = { FeedbackPage };
