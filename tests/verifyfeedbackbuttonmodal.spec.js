const {test,expect} = require('@playwright/test');
const urls = require('../config/urls.json');
const { BasePage } = require('../pages/basePage');
test('Verify Feedback Button Modal Visibility', async ({ page }) => {
    test.setTimeout(120000);
        const base = new BasePage(page);
        await base.open(urls.base);
        await base.acceptCookies();
        await page.waitForLoadState('load');
        await page.waitForTimeout(1000);
        const feedbackBtn = page.getByRole('button', { name: 'Feedback' });
        await feedbackBtn.waitFor({ state: 'visible', timeout: 30000 });
        // await page.waitForSelector("//button[contains(@class,'feedback-button')]", { state: 'visible', timeout: 50000 });
        // const feedbackBtn = page.locator("//button[contains(@class,'feedback-button')]");
        // await feedbackBtn.waitFor({ state: 'visible', timeout: 50000 }); 
       // await page.reload({ waitUntil: 'load' });
        await feedbackBtn.click();
        const feedbackModal = page.locator("//div[contains(@class, 'uws-modal') and contains(@class, 'uws-survey-modal') and @role='dialog' and @aria-modal='true']");
        await feedbackModal.waitFor({ state: 'visible', timeout: 40000 });
        console.log('Feedback modal is visible');

       
});