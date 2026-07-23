const { test } = require('@playwright/test');
const urls = require('../../config/urls.json');

const { BasePage } = require('../../pages/BasePage');
const { RenewableEnergyQuizPage } = require('../../pages/RenewableEnergyQuizPage');


test('Verify Renewable Energy Quiz Functionality', async ({ page }) => {

    test.setTimeout(180000);

    const base = new BasePage(page);
    const quiz = new RenewableEnergyQuizPage(page);


    await base.handleFeedbackModal();

    await base.open(urls.base);

    await base.acceptCookies();

    await quiz.navigateToQuiz(base);

    await quiz.verifyQuizLoaded();

    // Question 1
    await quiz.selectAnswer(1);
    console.log("Q1:", await quiz.getSelectedAnswer());
    await quiz.clickNext();
    // Question 2
    await quiz.selectAnswer(2);
    console.log("Q2:", await quiz.getSelectedAnswer());
    await quiz.clickNext();
    // Question 3
    await quiz.selectAnswer(2);
    console.log("Q3:", await quiz.getSelectedAnswer());
    await quiz.clickNext();
    // Question 4
    await quiz.selectAnswer(1);
    console.log("Q4:", await quiz.getSelectedAnswer());
    await quiz.clickNext();
    await quiz.verifyQuizResultDisplayed();
    console.log("Quiz completed successfully");
});