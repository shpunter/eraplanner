import { test, expect, type Page } from "@playwright/test";

// Week cells live inside <History>, which renders immediately on the castle
// route. The first castle is auto-added by <CastleGrid> once its (deferred)
// data resolves, so several cases wait for a building to appear first.

const week = (page: Page, index: number) =>
  page.locator('[data-testid="week"]').nth(index);

const weeks = (page: Page) => page.locator('[data-testid="week"]');

const day = (page: Page, index: number) =>
  page.locator('[data-testid="day"]').nth(index);

// a building that is buildable on day 0 but not pre-built: its only
// prerequisite (id10) is in the castle's pre-builds, so it can be constructed.
const BUILDABLE = "#id20";

test.beforeEach(async ({ page }) => {
  await page.goto("/castle/hive");
});

test("renders 4 week cells labelled W1–W4", async ({ page }) => {
  await expect(weeks(page)).toHaveCount(4);

  for (let i = 0; i < 4; i++) {
    await expect(week(page, i)).toHaveText(`W${i + 1}`);
  }
});

test("first week is active by default", async ({ page }) => {
  await expect(week(page, 0)).toHaveAttribute("data-active", "true");

  for (let i = 1; i < 4; i++) {
    await expect(week(page, i)).toHaveAttribute("data-active", "false");
  }
});

test("clicking a week activates it exclusively", async ({ page }) => {
  await week(page, 2).click();

  await expect(week(page, 2)).toHaveAttribute("data-active", "true");
  await expect(week(page, 0)).toHaveAttribute("data-active", "false");

  // switching again moves the active marker
  await week(page, 3).click();

  await expect(week(page, 3)).toHaveAttribute("data-active", "true");
  await expect(week(page, 2)).toHaveAttribute("data-active", "false");
});

test("selecting a week resets the active day to the first", async ({
  page,
}) => {
  // move off the first day, then switch weeks — the day selection rewinds
  await day(page, 4).click();
  await expect(day(page, 4)).toHaveAttribute("data-active", "true");

  await week(page, 1).click();

  await expect(day(page, 0)).toHaveAttribute("data-active", "true");
  await expect(day(page, 4)).toHaveAttribute("data-active", "false");
});

test("a week with a constructed building gets the action state", async ({
  page,
}) => {
  // wait for the castle grid (auto-adds the castle) and build on the current
  // day, which falls inside the first week
  await page.locator(BUILDABLE).click();

  await expect(week(page, 0)).toHaveAttribute("data-action", "true");
  // other weeks stay unmarked
  await expect(week(page, 1)).toHaveAttribute("data-action", "false");
});

test("weeks fully before a castle's start are disabled and ignore clicks", async ({
  page,
}) => {
  // ensure the first castle exists before changing the selected week
  await expect(page.locator(BUILDABLE)).toBeVisible();

  // move to week 2 (index 1), then add a castle — its history is disabled for
  // every day before the current one, so the now-complete first week (days
  // 1–7) is fully disabled
  await week(page, 1).click();
  await page.getByRole("button", { name: "+", exact: true }).click();

  await expect(week(page, 0)).toHaveAttribute("data-disabled", "true");
  await expect(week(page, 1)).toHaveAttribute("data-active", "true");

  // clicking a disabled week is a no-op — the active week does not move
  await week(page, 0).click();

  await expect(week(page, 0)).toHaveAttribute("data-active", "false");
  await expect(week(page, 1)).toHaveAttribute("data-active", "true");
});
