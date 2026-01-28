const { test, expect } = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');

test('Chatbot Functionality Test: Verifying Message Flow and Responses', async ({ page }) => {
  test.setTimeout(180000);
  const base = new BasePage(page);
  await base.handleFeedbackModal();
  // 1) Open base and accept cookies
  await base.open(urls.base);
  await base.acceptCookies();

  // 2) Open Location, select Virginia, Continue
  const locationMenu = page.locator("//a[text()='Location']");
  await expect(locationMenu).toBeVisible();
  await locationMenu.click();
  await page.waitForTimeout(500);
  const locationOptions = page.locator("//div[@id='modal-overlay']//div[contains(@class, 'tiles')]//a[contains(@class,'tile location-tile')]");
  await expect(locationOptions).toHaveCount(3);
  // Try to pick Virginia
  let virginiaOption = null;
  for (let i = 0; i < await locationOptions.count(); i++) {
    const opt = locationOptions.nth(i);
    try {
      const txt = (await opt.innerText()).toLowerCase();
      if (txt.includes('virginia')) { virginiaOption = opt; break; }
    } catch (e) { }
  }
  if (!virginiaOption) virginiaOption = locationOptions.nth(0);
  await expect(virginiaOption).toBeVisible();
  await virginiaOption.click();
  await page.waitForTimeout(500);
  const continuebtn = page.locator("//button[@type='button' and contains(@class, 'location-continue-btn')]");
  await expect(continuebtn).toBeVisible();
  await Promise.all([continuebtn.click(), page.waitForLoadState('load')]);
  await page.reload({ waitUntil: 'load' });

  //Hover header Save Energy & Money and choose Renewable Energy
  // const saveenergyMenu = page.locator("//a[@id='Save Energy & Money']");
  const saveEnergyNav = page.locator("//div[@id='Save Energy & Money']");
  await expect(saveEnergyNav).toBeVisible({ timeout: 10000 });
  const box = await saveEnergyNav.boundingBox();
  if (!box) throw new Error("Nav item bounding box is null — cannot hover.");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.evaluate(() => {
    const nav = document.querySelector("a[id='Save Energy & Money']");
    if (nav) {
      nav.dispatchEvent(new Event("mouseover", { bubbles: true }));
      nav.dispatchEvent(new Event("mouseenter", { bubbles: true }));
      nav.dispatchEvent(new MouseEvent("mousemove", { bubbles: true }));
    }
  });
  await page.locator(
    "//div[@id='Save Energy & Money']//div[contains(@class,'third-navigation')]"
  ).waitFor({ state: 'visible' });
  await page.locator("(//a[@href='/en/Virginia/Renewable-Energy-Programs'])[1]").click();

  // On Renewable page, click Learn More About Net Metering
  await page.waitForLoadState('load');
  await page.waitForTimeout(800);

  const link = page.locator("//a[@class='cta-btn' and @href='/en/Virginia/Renewable-Energy-Programs/Net-Metering']");
  await link.scrollIntoViewIfNeeded();
  await link.click();

  // On Net Metering page, wait for chatbot to appear
  await page.waitForLoadState('load');
  const chatButton = page.locator('#chat-button'); // if it's a class, use '.chat-button'

  // Check if it's visible
  if (await chatButton.isVisible()) {
    console.log('Chat button is visible, clicking it...');
    // await chatButton.click();
    await page.locator('#chat-button').click({ force: true });
  } else {
    console.log('Chat button is not visible.');
  }
  await page.locator('#chat-container.slideUp').waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(1000);
   const botMessageLocator = page.locator(
    "//div[contains(@class, 'webchat__basic-transcript__activity') and contains(., 'Bot said:')]//div[contains(@class,'webchat__render-markdown')]//p"
  );
  
  // Wait for the first bot message to appear (up to 30 seconds)
  //await botMessageLocator.waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForTimeout(10000);
  
  // Step 3: Log the initial bot message
  const initialBotResponse = await botMessageLocator.evaluateAll(paragraphs =>
    paragraphs.map(p => p.innerText).join('\n')
  );
  console.log('Initial Bot Response:\n', initialBotResponse);

  const messageInput = page.locator("//input[@aria-label='Message input box']");
  await page.waitForTimeout(500);
  await messageInput.fill('Net Metering');
  console.log("Bot Input: Net Metering");
  const sendBtn = page.locator("//button[@title='Send' and contains(@class,'webchat__send-button')]");
  await sendBtn.waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(1000);
  await expect(sendBtn).toBeEnabled();
  await sendBtn.click();
  await page.locator("//div[@aria-label = 'Chat history, press arrow keys to navigate.']").isVisible();
  await page.evaluate((btn) => btn.click(), await sendBtn.elementHandle());
  await page.waitForTimeout(10000);
  await page.waitForSelector("//div[contains(@class, 'webchat__basic-transcript__activity') and contains(., 'Bot said:')]//div[contains(@class,'webchat__render-markdown')]//p", {
  state: 'visible',
  timeout: 30000 // Ensure it's visible within 30 seconds
});
const botMessage = page.locator("(//div[contains(@class, 'webchat__basic-transcript__activity') and contains(., 'Bot said:')]//div[contains(@class,'webchat__render-markdown')]//p)[last()-1] | (//div[contains(@class, 'webchat__basic-transcript__activity') and contains(., 'Bot said:')]//div[contains(@class,'webchat__render-markdown')]//p)[last()]");

  await page.waitForTimeout(1000);
  const botResponse = await botMessage.evaluateAll(paragraphs =>
    paragraphs.map(p => p.innerText).join('\n'));
 // console.log('Bot response:\n', botResponse);
  botResponse.split('\n').forEach((message, index) => {
  console.log(`Bot Response ${index + 1}: ${message}`);
});
  await page.waitForTimeout(500);
  const closeButton = page.locator("//button[@id='chat-close']");
  await closeButton.click();






});