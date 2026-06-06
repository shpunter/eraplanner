import { test, expect, type Page } from "@playwright/test";

// Day cells live inside <History>, which renders immediately on the castle
// route. The first castle is auto-added by <CastleGrid> once its (deferred)
// data resolves, so several cases wait for a building to appear first.

const day = (page: Page, index: number) =>
  page.locator('[data-testid="day"]').nth(index);

const days = (page: Page) => page.locator('[data-testid="day"]');

// a building that is buildable on day 0 but not pre-built: its only
// prerequisite (id10) is in the castle's pre-builds, so it can be constructed.
const BUILDABLE = "#id20";

test.beforeEach(async ({ page }) => {
  await page.goto("/faction/hive");
  // wait for client hydration: BUILDABLE only renders after the deferred
  // castle data resolves, so handlers are attached before we interact
  await page.locator(BUILDABLE).waitFor();
});

test("renders 7 day cells labelled D1–D7", async ({ page }) => {
  await expect(days(page)).toHaveCount(7);

  for (let i = 0; i < 7; i++) {
    await expect(day(page, i)).toHaveText(`D${i + 1}`);
  }
});

test("first day is active by default", async ({ page }) => {
  await expect(day(page, 0)).toHaveAttribute("data-active", "true");

  for (let i = 1; i < 7; i++) {
    await expect(day(page, i)).toHaveAttribute("data-active", "false");
  }
});

test("clicking a day activates it exclusively", async ({ page }) => {
  await day(page, 3).click();

  await expect(day(page, 3)).toHaveAttribute("data-active", "true");
  await expect(day(page, 0)).toHaveAttribute("data-active", "false");

  // switching again moves the active marker
  await day(page, 5).click();

  await expect(day(page, 5)).toHaveAttribute("data-active", "true");
  await expect(day(page, 3)).toHaveAttribute("data-active", "false");
});

test("a day with a constructed building gets the action state", async ({
  page,
}) => {
  // wait for the castle grid (auto-adds the castle) and build on the current day
  await page.locator(BUILDABLE).click();

  await expect(day(page, 0)).toHaveAttribute("data-action", "true");
  // other days stay unmarked
  await expect(day(page, 1)).toHaveAttribute("data-action", "false");
});
