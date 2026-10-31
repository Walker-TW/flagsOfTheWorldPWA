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
