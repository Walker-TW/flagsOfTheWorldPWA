import { expect, test } from "@playwright/test";
import {
  HOME_SCREEN_NAME,
  IS_GIFT,
  WELCOME_MESSAGE,
  WELCOME_TITLE,
} from "../src/edition";

test.use({ storageState: { cookies: [], origins: [] } });

test("names the app for this edition", async ({ request }) => {
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.short_name).toBe(HOME_SCREEN_NAME);
});

test.describe("gift edition", () => {
  test.skip(!IS_GIFT, "Run with NEXT_PUBLIC_EDITION=gift");

  test("shows the welcome screen once, on first open", async ({ page }) => {
    await page.goto("/");
    const welcome = page.getByRole("dialog", { name: WELCOME_TITLE });
    await expect(welcome).toBeVisible();
    await expect(welcome.getByText(WELCOME_MESSAGE)).toBeVisible();

    await welcome.getByRole("button").click();
    await expect(welcome).toBeHidden();

    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Flags of the World" }),
    ).toBeVisible();
    await expect(welcome).toBeHidden();
  });

  test("throws confetti when the welcome button is pressed", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("dialog").getByRole("button").click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page.locator(".confetti-piece").first()).toBeAttached();
    // The home page underneath is usable straight away.
    await page.getByRole("link", { name: "10", exact: true }).click();
    await expect(page.getByText("1 / 10")).toBeVisible();
  });
});

test.describe("public edition", () => {
  test.skip(IS_GIFT, "Run without NEXT_PUBLIC_EDITION=gift");

  test("has no welcome screen or gift words", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Flags of the World" }),
    ).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    // CI sets the gift words for this build too (e2e/gift.env), so this
    // checks they never reach the public site.
    expect(await page.content()).not.toContain("Test ");
  });
});
