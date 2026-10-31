import { expect, type Locator, type Page } from "@playwright/test";

export async function expectImageLoaded(image: Locator) {
  await expect
    .poll(() =>
      image.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
}

// Answers every flag in the quiz on screen, checking each flag image loads.
// `answers[i]` is whether flag i is marked correct.
export async function playQuiz(page: Page, answers: boolean[]) {
  const total = answers.length;
  for (const [i, correct] of answers.entries()) {
    await expect(page.getByText(`${i + 1} / ${total}`)).toBeVisible();
    await expectImageLoaded(page.locator("section img"));
    await page
      .getByRole("button", {
        name: correct ? "Correct answer" : "Incorrect answer",
        exact: true,
      })
      .click();
  }
  await expect(page.getByText("Quiz complete")).toBeVisible();
}

// Six right, four wrong: flags 1, 4, 7 and 10 are missed.
export const TEN_ANSWERS = Array.from({ length: 10 }, (_, i) => i % 3 !== 0);
