import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test("shows the welcome screen once, on first open", async ({ page }) => {
  await page.goto("/");
  const welcome = page.getByRole("dialog", { name: /Hey T/ });
  await expect(welcome).toBeVisible();

  await welcome.getByRole("button").click();
  await expect(welcome).toBeHidden();

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Flags of the World" }),
  ).toBeVisible();
  await expect(welcome).toBeHidden();
});

test("throws confetti when the welcome button is pressed", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("dialog").getByRole("button").click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.locator(".confetti-piece").first()).toBeAttached();
  // The home page underneath is usable straight away.
  await page.getByRole("link", { name: "10", exact: true }).click();
  await expect(page.getByText("1 / 10")).toBeVisible();
});
