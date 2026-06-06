import { test, expect, type Page } from "@playwright/test";

// Month cells live inside <History>, which renders immediately on the castle
// route. The first castle is auto-added by <CastleGrid> once its (deferred)
// data resolves, so several cases wait for a building to appear first.

const month = (page: Page, index: number) =>
  page.locator('[data-testid="month"]').nth(index);

const months = (page: Page) => page.locator('[data-testid="month"]');

const week = (page: Page, index: number) =>
  page.locator('[data-testid="week"]').nth(index);

const day = (page: Page, index: number) =>
  page.locator('[data-testid="day"]').nth(index);

// a building that is buildable on day 0 but not pre-built: its only
// prerequisite (id10) is in the castle's pre-builds, so it can be constructed.
const BUILDABLE = "#id20";

test.beforeEach(async ({ page }) => {
  await page.goto("/faction/hive");
  // wait for client hydration: BUILDABLE only renders after the deferred
  // castle data resolves, so handlers are attached before we interact
  await page.locator(BUILDABLE).waitFor();
});

test("renders 7 month cells labelled M1–M7", async ({ page }) => {
  await expect(months(page)).toHaveCount(7);

  for (let i = 0; i < 7; i++) {
    await expect(month(page, i)).toHaveText(`M${i + 1}`);
  }
});

test("first month is active by default", async ({ page }) => {
  await expect(month(page, 0)).toHaveAttribute("data-active", "true");

  for (let i = 1; i < 7; i++) {
    await expect(month(page, i)).toHaveAttribute("data-active", "false");
  }
});

test("clicking a month activates it exclusively", async ({ page }) => {
  await month(page, 3).click();

  await expect(month(page, 3)).toHaveAttribute("data-active", "true");
  await expect(month(page, 0)).toHaveAttribute("data-active", "false");

  // switching again moves the active marker
  await month(page, 5).click();

  await expect(month(page, 5)).toHaveAttribute("data-active", "true");
  await expect(month(page, 3)).toHaveAttribute("data-active", "false");
});

test("selecting a month resets the active week and day to the first", async ({
  page,
}) => {
  // move off the first week and day, then switch months — both rewind
  await week(page, 2).click();
  await day(page, 4).click();
  await expect(week(page, 2)).toHaveAttribute("data-active", "true");
  await expect(day(page, 4)).toHaveAttribute("data-active", "true");

  await month(page, 1).click();

  await expect(week(page, 0)).toHaveAttribute("data-active", "true");
  await expect(week(page, 2)).toHaveAttribute("data-active", "false");
  await expect(day(page, 0)).toHaveAttribute("data-active", "true");
  await expect(day(page, 4)).toHaveAttribute("data-active", "false");
});

test("a month with a constructed building gets the action state", async ({
  page,
}) => {
  // wait for the castle grid (auto-adds the castle) and build on the current
  // day, which falls inside the first month
  await page.locator(BUILDABLE).click();

  await expect(month(page, 0)).toHaveAttribute("data-action", "true");
  // other months stay unmarked
  await expect(month(page, 1)).toHaveAttribute("data-action", "false");
});
