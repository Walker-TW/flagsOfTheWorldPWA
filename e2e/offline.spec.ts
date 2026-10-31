import { expect, test } from "@playwright/test";
import { playQuiz, TEN_ANSWERS } from "./helpers";

// One online visit should be enough for the whole app to work offline.
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // `ready` resolves once the service worker is active, which is after
  // everything in the precache manifest has been downloaded.
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.context().setOffline(true);
});

test("plays a quiz offline from a link on the home page", async ({ page }) => {
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Flags of the World" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "10", exact: true }).click();
  await playQuiz(page, TEN_ANSWERS);
  await expect(page.getByText("6 correct")).toBeVisible();
});

test("opens a quiz URL directly while offline", async ({ page }) => {
  await page.goto("/quiz?count=20");
  await expect(page.getByText("1 / 20")).toBeVisible();
});
