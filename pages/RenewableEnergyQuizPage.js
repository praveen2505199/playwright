const { expect } = require("@playwright/test");

class RenewableEnergyQuizPage {
  constructor(page) {
    this.page = page;

    // Search
    this.searchIcon = page.locator("//button[@class='search']");
    this.searchInput = page.locator("#search-box-input");
    this.searchResult = page.locator(
      "//a[contains(@class,'CoveoResultLink')]//h4[normalize-space()='Renewable Energy Quiz']",
    );

    // Quiz
    this.quizSection = page.locator(".quiz-box");

    // Current visible question
    this.currentQuestion = page.locator(".question-cta.d-block:visible");
    this.quizResult = page.locator(".rich-text-quiz-result");
  }

  async navigateToQuiz(base) {
    await this.searchIcon.click();
    await base.handleLocationVirginia();
    await this.searchIcon.click();
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill("Renewable Energy Quiz");
    await this.searchInput.press("Enter");
    await base.CoveoresultIsVisible();
    await expect(this.searchResult).toBeVisible();
    await this.searchResult.click();
    await expect(this.page).toHaveURL(
      /renewable-energy-programs\/renewable-energy-101\/quiz/,
    );
  }

  async verifyQuizLoaded() {
    await this.quizSection.scrollIntoViewIfNeeded();
    await expect(this.quizSection).toBeVisible();
  }

  async selectAnswer(answerNumber) {
    const answer = this.currentQuestion
      .locator(".answer-list label")
      .nth(answerNumber - 1);
    await answer.click();
  }

  async clickNext() {
    const nextButton = this.currentQuestion.locator(".quiz-btn");
    await expect(nextButton).toBeVisible();
    await nextButton.click();
  }

  async clickBack() {
    const backButton = this.currentQuestion.locator(".quiz-btn-back");
    await expect(backButton).toBeVisible();
    await backButton.click();
  }

  async getSelectedAnswer() {
    const selectedAnswer = this.currentQuestion
      .locator("label")
      .filter({ has: this.page.locator("i.fa-check-circle") })
      .locator(".answer-label");
    await expect(selectedAnswer).toBeVisible();
    return (await selectedAnswer.innerText()).trim();
  }

  async verifyQuizResultDisplayed() {
    await expect(this.quizResult).toBeVisible();
  }
}

module.exports = { RenewableEnergyQuizPage };
