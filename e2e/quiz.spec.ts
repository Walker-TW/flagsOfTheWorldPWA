import { expect, test } from "@playwright/test";
import { expectImageLoaded, playQuiz, TEN_ANSWERS } from "./helpers";

test("plays a quiz through to the results and tracks history", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "10", exact: true }).click();

  await playQuiz(page, TEN_ANSWERS);

  await expect(page.getByText("60%")).toBeVisible();
  await expect(page.getByText("6 correct")).toBeVisible();
  await expect(page.getByText("4 incorrect")).toBeVisible();
  await expect(page.getByText("Best streak")).toBeVisible();
  await expect(page.getByText("Time per flag")).toBeVisible();
  await expect(page.getByText("By continent")).toBeVisible();

  const missed = page
    .getByText("Flags to practise")
    .locator("..")
    .locator("li");
  await expect(missed).toHaveCount(4);
  for (const image of await missed.locator("img").all()) {
    await expectImageLoaded(image);
  }

  // One quiz is not a trend yet; a second one draws the score line.
  await expect(
    page.getByText("Finish another quiz to see your trend."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Play again" }).click();
  await playQuiz(page, TEN_ANSWERS);
  await expect(
    page.getByRole("img", { name: /Score for your last 2 quizzes/ }),
  ).toBeVisible();
});

test("is answered by swiping when the phone is held sideways", async ({
  page,
}) => {
  await page.setViewportSize({ width: 852, height: 393 });
  await page.goto("/quiz?count=10");
  await expect(page.getByText("1 / 10")).toBeVisible();

  // The whole card fits on screen, and the answer buttons are hidden.
  const card = page.locator("section .rounded-2xl").first();
  await expect(card).toBeInViewport({ ratio: 1 });
  await expect(
    page.getByRole("button", { name: "Correct answer", exact: true }),
  ).toBeHidden();

  // Swiping right marks the flag correct.
  const box = (await card.boundingBox())!;
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width / 2, y);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 200, y, { steps: 10 });
  await page.mouse.up();
  await expect(page.getByText("2 / 10")).toBeVisible();
  await expect(page.getByText("✓ 1")).toBeVisible();
});

test("answers with the arrow keys", async ({ page }) => {
  await page.goto("/quiz?count=10");
  await expect(page.getByText("1 / 10")).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(page.getByText("2 / 10")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByText("3 / 10")).toBeVisible();
  await expect(page.getByText("✓ 1")).toBeVisible();
  await expect(page.getByText("✗ 1")).toBeVisible();
});

test("celebrates a perfect score", async ({ page }) => {
  await page.goto("/quiz?count=10");
  await playQuiz(page, Array(10).fill(true));
  await expect(page.getByText("100%")).toBeVisible();
  await expect(page.getByText("Perfect score!")).toBeVisible();
});

test("celebrates a new personal best", async ({ page }) => {
  await page.goto("/quiz?count=10");
  // First quiz: 60%, with nothing earlier to beat.
  await playQuiz(page, TEN_ANSWERS);
  await expect(page.getByText("New personal best!")).toBeHidden();

  // Second quiz: 90% beats it.
  await page.getByRole("button", { name: "Play again" }).click();
  await playQuiz(page, [...Array(9).fill(true), false]);
  await expect(page.getByText("New personal best!")).toBeVisible();

  // Third quiz: 60% again is not a best.
  await page.getByRole("button", { name: "Play again" }).click();
  await playQuiz(page, TEN_ANSWERS);
  await expect(page.getByText("New personal best!")).toBeHidden();
});

test("hides the flag details until the card is tapped", async ({ page }) => {
  await page.goto("/quiz?count=10");
  await expect(page.getByText("1 / 10")).toBeVisible();

  const card = page.getByRole("button", { expanded: false });
  const prompt = page.getByText("Tap to reveal");
  const name = page.locator("section .font-bold");
  await expect(prompt).toBeVisible();
  await expect(name).toBeHidden();

  // Tapping shows the details, and tapping again hides them.
  await card.click();
  await expect(name).toBeVisible();
  await expect(prompt).toBeHidden();
  await page.getByRole("button", { expanded: true }).click();
  await expect(name).toBeHidden();

  // Enter works too, and the next flag starts hidden again.
  await page.getByRole("button", { expanded: false }).press("Enter");
  await expect(name).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByText("2 / 10")).toBeVisible();
  await expect(name).toBeHidden();
  await expect(prompt).toBeVisible();
});
