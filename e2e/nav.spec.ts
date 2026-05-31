import { test, expect, type Page } from "@playwright/test";

// The prev/next nav buttons live inside <History> alongside the day, week and
// month cells. They walk a single "history index" backwards/forwards, so a
// step off the end of a day row rolls over into the next week, and off the end
// of a week row rolls over into the next month (and vice versa for prev).

const day = (page: Page, index: number) =>
  page.locator('[data-testid="day"]').nth(index);

const week = (page: Page, index: number) =>
  page.locator('[data-testid="week"]').nth(index);

const month = (page: Page, index: number) =>
  page.locator('[data-testid="month"]').nth(index);

const next = (page: Page) => page.locator('[data-testid="next"]');
const prev = (page: Page) => page.locator('[data-testid="prev"]');

test.beforeEach(async ({ page }) => {
  await page.goto("/castle/hive");
});

test("next advances the active day within the week", async ({ page }) => {
  await expect(day(page, 0)).toHaveAttribute("data-active", "true");

  await next(page).click();

  await expect(day(page, 1)).toHaveAttribute("data-active", "true");
  await expect(day(page, 0)).toHaveAttribute("data-active", "false");
  await expect(week(page, 0)).toHaveAttribute("data-active", "true");
});

test("next from D7 rolls over to D1 of the next week", async ({ page }) => {
  // jump to the last day of the first week
  await day(page, 6).click();
  await expect(day(page, 6)).toHaveAttribute("data-active", "true");
  await expect(week(page, 0)).toHaveAttribute("data-active", "true");

  await next(page).click();

  // day wraps back to D1 and the week advances W1 -> W2
  await expect(day(page, 0)).toHaveAttribute("data-active", "true");
  await expect(day(page, 6)).toHaveAttribute("data-active", "false");
  await expect(week(page, 1)).toHaveAttribute("data-active", "true");
  await expect(week(page, 0)).toHaveAttribute("data-active", "false");
});

test("next from D7 of W4 rolls over to D1 of W1 in the next month", async ({
  page,
}) => {
  // jump to the last day of the last week of the first month
  await week(page, 3).click();
  await day(page, 6).click();
  await expect(day(page, 6)).toHaveAttribute("data-active", "true");
  await expect(week(page, 3)).toHaveAttribute("data-active", "true");
  await expect(month(page, 0)).toHaveAttribute("data-active", "true");

  await next(page).click();

  // everything wraps: D7 -> D1, W4 -> W1, M1 -> M2
  await expect(day(page, 0)).toHaveAttribute("data-active", "true");
  await expect(day(page, 6)).toHaveAttribute("data-active", "false");
  await expect(week(page, 0)).toHaveAttribute("data-active", "true");
  await expect(week(page, 3)).toHaveAttribute("data-active", "false");
  await expect(month(page, 1)).toHaveAttribute("data-active", "true");
  await expect(month(page, 0)).toHaveAttribute("data-active", "false");
});

test("prev steps the active day back within the week", async ({ page }) => {
  await day(page, 3).click();
  await expect(day(page, 3)).toHaveAttribute("data-active", "true");

  await prev(page).click();

  await expect(day(page, 2)).toHaveAttribute("data-active", "true");
  await expect(day(page, 3)).toHaveAttribute("data-active", "false");
  await expect(week(page, 0)).toHaveAttribute("data-active", "true");
});

test("prev from D1 rolls back to D7 of the previous week", async ({ page }) => {
  // start on the first day of the second week
  await week(page, 1).click();
  await expect(day(page, 0)).toHaveAttribute("data-active", "true");
  await expect(week(page, 1)).toHaveAttribute("data-active", "true");

  await prev(page).click();

  // day wraps forward to D7 and the week steps back W2 -> W1
  await expect(day(page, 6)).toHaveAttribute("data-active", "true");
  await expect(day(page, 0)).toHaveAttribute("data-active", "false");
  await expect(week(page, 0)).toHaveAttribute("data-active", "true");
  await expect(week(page, 1)).toHaveAttribute("data-active", "false");
});

test("prev from D1 of W1 rolls back to D7 of W4 in the previous month", async ({
  page,
}) => {
  // start on the first day of the first week of the second month
  await month(page, 1).click();
  await expect(day(page, 0)).toHaveAttribute("data-active", "true");
  await expect(week(page, 0)).toHaveAttribute("data-active", "true");
  await expect(month(page, 1)).toHaveAttribute("data-active", "true");

  await prev(page).click();

  // everything wraps back: D1 -> D7, W1 -> W4, M2 -> M1
  await expect(day(page, 6)).toHaveAttribute("data-active", "true");
  await expect(day(page, 0)).toHaveAttribute("data-active", "false");
  await expect(week(page, 3)).toHaveAttribute("data-active", "true");
  await expect(week(page, 0)).toHaveAttribute("data-active", "false");
  await expect(month(page, 0)).toHaveAttribute("data-active", "true");
  await expect(month(page, 1)).toHaveAttribute("data-active", "false");
});

test("prev on the very first day is a no-op", async ({ page }) => {
  await expect(day(page, 0)).toHaveAttribute("data-active", "true");
  await expect(week(page, 0)).toHaveAttribute("data-active", "true");
  await expect(month(page, 0)).toHaveAttribute("data-active", "true");

  await prev(page).click();

  await expect(day(page, 0)).toHaveAttribute("data-active", "true");
  await expect(week(page, 0)).toHaveAttribute("data-active", "true");
  await expect(month(page, 0)).toHaveAttribute("data-active", "true");
});
