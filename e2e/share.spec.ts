import { test, expect, type Page } from "@playwright/test";

// Share-feature coverage:
//   - Share button copies a valid #s= URL to the clipboard and shows a popup
//   - Opening a share URL in a fresh session (no IDB data) applies state silently
//   - Opening a share URL when data already exists shows a confirmation modal
//   - Cancelling the modal keeps the existing state untouched
//   - Confirming the modal replaces IDB with the shared state and reloads
//   - A building added on day N is restored only to that day, not earlier days
//     (regression for the null→[] bug that made every slot truthy)

const building = (page: Page, id: string) => page.locator(`#${id}`);
const day = (page: Page, index: number) => page.getByTestId("day").nth(index);
const income = (page: Page, key: string) => page.getByTestId(`income-${key}`);
const available = (page: Page, key: string) =>
  page.getByTestId(`available-${key}`);

// Patches clipboard.writeText, clicks Share, waits for the "Link copied!"
// popup, then returns the URL that was written to the clipboard.
const getShareURL = async (page: Page): Promise<string> => {
  await page.evaluate(() => {
    (window as unknown as Record<string, unknown>).__shareURL = null;
    navigator.clipboard.writeText = async (text: string) => {
      (window as unknown as Record<string, unknown>).__shareURL = text;
    };
  });
  await page.getByRole("button", { name: "Share" }).click();
  await expect(page.getByText("Link copied!")).toBeVisible();
  return page.evaluate<string>(
    () => (window as unknown as Record<string, unknown>).__shareURL as string,
  );
};

test.beforeEach(async ({ page }) => {
  await page.goto("/faction/hive");
  // id20 appears once the castle grid is hydrated and the starting castle registered
  await building(page, "id20").waitFor();
});

test("Share button copies a URL with a #s= hash and shows a popup", async ({
  page,
}) => {
  const url = await getShareURL(page);
  expect(url).toMatch(/#s=[A-Za-z0-9_-]+/);
  await expect(page.getByText("Paste it anywhere to share your build.")).toBeVisible();
});

test("loading a share URL in a fresh session applies state silently", async ({
  page,
  browser,
}) => {
  // Build id11 on D1 so there is something non-trivial in the share URL
  await building(page, "id11").click();
  await expect(income(page, "gold")).toHaveText("+750");

  const shareUrl = await getShareURL(page);

  // Fresh browser context = empty IDB
  const ctx = await browser.newContext();
  const freshPage = await ctx.newPage();

  // Navigate to the share URL. applyPendingShare writes IDB then calls
  // location.replace, triggering a second navigation. waitFor polls through it.
  await freshPage.goto(shareUrl);
  await building(freshPage, "id20").waitFor({ timeout: 15_000 });

  // No confirmation modal for a user with no prior data
  await expect(freshPage.getByRole("heading", { name: /load shared build/i })).not.toBeVisible();

  // Shared state (id11 built) should be reflected in the income
  await expect(income(freshPage, "gold")).toHaveText("+750");

  await ctx.close();
});

test("loading a share URL with existing data shows the confirmation modal", async ({
  page,
}) => {
  // Capture baseline URL before any user builds
  const baselineUrl = await getShareURL(page);
  await page.getByText("Got it").click();

  // Create existing data so the load would overwrite something
  await building(page, "id11").click();

  // Full reload with the share hash → initShare saves to sessionStorage → modal
  await page.goto(baselineUrl);
  await building(page, "id20").waitFor();

  await expect(
    page.getByRole("heading", { name: /load shared build/i }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Load build" })).toBeVisible();
});

test("cancelling the modal keeps the current build intact", async ({ page }) => {
  const baselineUrl = await getShareURL(page);
  await page.getByText("Got it").click();

  await building(page, "id11").click();
  await expect(income(page, "gold")).toHaveText("+750");

  await page.goto(baselineUrl);
  await building(page, "id20").waitFor();
  await expect(
    page.getByRole("heading", { name: /load shared build/i }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Cancel" }).click();

  await expect(
    page.getByRole("heading", { name: /load shared build/i }),
  ).not.toBeVisible();
  // id11 is still active — existing state was not replaced
  await expect(income(page, "gold")).toHaveText("+750");
});

test("confirming the modal loads the shared state and reloads the page", async ({
  page,
}) => {
  // Capture baseline URL (no user builds)
  const baselineUrl = await getShareURL(page);
  await page.getByText("Got it").click();

  // Build id11 so the current state differs from the baseline
  await building(page, "id11").click();
  await expect(income(page, "gold")).toHaveText("+750");

  await page.goto(baselineUrl);
  await building(page, "id20").waitFor();
  await page.getByRole("button", { name: "Load build" }).click();

  // applyPendingShare calls location.replace → full reload
  await building(page, "id20").waitFor({ timeout: 15_000 });

  // Baseline (no id11): income back to pre-build rate
  await expect(income(page, "gold")).toHaveText("+500");
});

test("a building added on day 5 is not active on days 1–4 after share load", async ({
  page,
  browser,
}) => {
  // Navigate to D5 (0-indexed: index 4) and build id11 there
  await day(page, 4).click();
  await building(page, "id11").click();

  // Sanity check: D5 income reflects id11
  await expect(income(page, "gold")).toHaveText("+750");
  // D5 available: 10000 starting + 4*500 (D1-D4 pre-build) - 2500 (id11 cost)
  await expect(available(page, "gold")).toHaveText("9500");

  const shareUrl = await getShareURL(page);

  const ctx = await browser.newContext();
  const freshPage = await ctx.newPage();
  await freshPage.goto(shareUrl);
  await building(freshPage, "id20").waitFor({ timeout: 15_000 });

  // D1 (default after reload): no id11 yet — baseline income and starting gold
  await expect(income(freshPage, "gold")).toHaveText("+500");
  await expect(available(freshPage, "gold")).toHaveText("10000");

  // Navigate to D5: id11 is active from this day
  await day(freshPage, 4).click();
  await expect(income(freshPage, "gold")).toHaveText("+750");
  await expect(available(freshPage, "gold")).toHaveText("9500");

  await ctx.close();
});
