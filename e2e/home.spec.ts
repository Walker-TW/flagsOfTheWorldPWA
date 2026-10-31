import { expect, test } from "@playwright/test";
import { expectImageLoaded } from "./helpers";

const mosaic = "main > div[aria-hidden=true]";

test("shows the flag mosaic on the home page", async ({ page }) => {
  await page.goto("/");
  const flags = page.locator(`${mosaic} img`);
  await expect(flags).toHaveCount(24);
  for (const flag of await flags.all()) {
    await expectImageLoaded(flag);
  }
  await expect(page.locator(mosaic)).toBeInViewport({ ratio: 1 });
});

test("hides the flag mosaic on a phone held sideways", async ({ page }) => {
  await page.setViewportSize({ width: 852, height: 393 });
  await page.goto("/");
  await expect(page.locator(mosaic)).toBeHidden();
  await expect(page.getByRole("link", { name: /All/ })).toBeInViewport({
    ratio: 1,
  });
});
