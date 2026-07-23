const { test } = require("@playwright/test");

const urls = require("../config/urls.json");

const { BasePage } = require("../pages/basePage");
const { ChatBotPage } = require("../pages/ChatBotPage");

test("Chatbot Functionality Test: Verifying Message Flow and Responses", async ({
  page,
}) => {
  test.setTimeout(180000);

  const base = new BasePage(page);

  const chat = new ChatBotPage(page);

  await base.handleFeedbackModal();

  await base.open(urls.base);

  await base.acceptCookies();

  await chat.selectVirginia();

  await chat.openNetMeteringPage();

  await chat.openChat();

  await chat.printInitialBotResponse();

  await chat.sendMessage("Net Metering");

  await chat.printLatestBotResponse();

  await chat.closeChat();
});
