const { expect } = require("@playwright/test");

class ChatBotPage {
  constructor(page) {
    this.page = page;

    // Location
    this.locationMenu = page.locator("//a[text()='Location']");
    this.locationModal = page.locator("#modal-overlay");
    this.locationOptions = page.locator(
      "//div[@id='modal-overlay']//a[contains(@class,'location-tile')]",
    );
    this.continueButton = page.locator("button.location-continue-btn");

    // Navigation
    this.saveEnergyMenu = page.locator("//div[@id='Save Energy & Money']");

    this.renewableEnergyLink = page.locator(
      "(//a[@href='/en/Virginia/Renewable-Energy-Programs'])[1]",
    );

    this.netMeteringLink = page.locator(
      "//a[@href='/en/Virginia/Renewable-Energy-Programs/Net-Metering']",
    );

    // Chat
    this.chatButton = page.locator("#chat-button");
    this.chatContainer = page.locator("#chat-container.slideUp");

    this.botMessages = page.locator(
      "//div[contains(@class,'webchat__basic-transcript__activity') and contains(.,'Bot said:')]//div[contains(@class,'webchat__render-markdown')]//p",
    );

    this.messageInput = page.locator(
      "//input[@aria-label='Message input box']",
    );

    this.sendButton = page.locator("//button[@title='Send']");

    this.closeButton = page.locator("#chat-close");
  }

  async selectVirginia() {
    await expect(this.locationMenu).toBeVisible();

    await this.locationMenu.click();

    await expect(this.locationModal).toBeVisible();

    const virginia = this.locationModal.locator(
      "a.tile.location-tile[data-location='Virginia']",
    );

    await virginia.click();

    await this.continueButton.click();

    await this.page.waitForLoadState("load");

    await this.page.reload({
      waitUntil: "load",
    });
  }

  async openNetMeteringPage() {
    await expect(this.saveEnergyMenu).toBeVisible({
      timeout: 10000,
    });

    const box = await this.saveEnergyMenu.boundingBox();

    if (!box) {
      throw new Error("Save Energy menu is not visible.");
    }

    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

    await this.page.evaluate(() => {
      const nav = document.querySelector("a[id='Save Energy & Money']");

      if (nav) {
        nav.dispatchEvent(new Event("mouseover", { bubbles: true }));
        nav.dispatchEvent(new Event("mouseenter", { bubbles: true }));
        nav.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }));
      }
    });

    const thirdMenu = this.page.locator(
      "//div[@id='Save Energy & Money']//div[contains(@class,'third-navigation')]",
    );

    await expect(thirdMenu).toBeVisible({
      timeout: 15000,
    });

    await this.renewableEnergyLink.click();

    await this.page.waitForLoadState("load");

    await this.netMeteringLink.scrollIntoViewIfNeeded();

    await this.netMeteringLink.click();

    await this.page.waitForLoadState("domcontentloaded");
  }

  async openChat() {
    await expect(this.chatButton).toBeVisible({
      timeout: 30000,
    });

    await this.chatButton.click({
      force: true,
    });

    await expect(this.chatContainer).toBeVisible();
  }

  async printInitialBotResponse() {
    await expect(this.botMessages.first()).toBeVisible({ timeout: 30000 });

    const text = await this.botMessages.allInnerTexts();

    console.log("Initial Bot Response:");

    text.forEach((msg) => console.log(msg));
  }

  async sendMessage(message) {
    await this.messageInput.fill(message);

    console.log("Bot Input:", message);

    await this.sendButton.click();

    await this.page.waitForTimeout(5000);
  }

  async printLatestBotResponse() {
    const responses = await this.botMessages.allInnerTexts();

    console.log("Bot Responses:");

    responses.forEach((msg, index) => {
      console.log(`${index + 1}. ${msg}`);
    });
  }

  async closeChat() {
    await this.closeButton.click();
  }
}

module.exports = { ChatBotPage };
