import { test, expect, type Page } from "@playwright/test";

// Board menu navigation. The menu (src/features/menu) swaps the main panel via
// the `m` search param: castles -> CastleBoard, mines -> Mines,
// resources -> Resources, laws -> Laws. Only one panel is mounted at a time, so
// each panel's marker element is present only while its tab is active.

const tab = (page: Page, id: string) => page.getByTestId(`tab-${id}`);
const building = (page: Page, id: string) => page.locator(`#${id}`);

// Marker element unique to each tab's panel.
const castlesPanel = (page: Page) => building(page, "id20");
const minesPanel = (page: Page) => page.getByTestId("mine-gold");
const resourcesPanel = (page: Page) => page.getByTestId("resource-gold");
const lawsPanel = (page: Page) => page.getByTestId("law-l00");

test.beforeEach(async ({ page }) => {
  await page.goto("/faction/hive");
  // castles is the default tab; wait for the hydrated grid before interacting
  await castlesPanel(page).waitFor();
});

test("castles is the default panel", async ({ page }) => {
  await expect(castlesPanel(page)).toBeVisible();
  await expect(minesPanel(page)).toHaveCount(0);
  await expect(resourcesPanel(page)).toHaveCount(0);
  await expect(lawsPanel(page)).toHaveCount(0);
});

test("each menu item swaps in its own panel", async ({ page }) => {
  await tab(page, "mines").click();
  await expect(page).toHaveURL(/m=mines/);
  await expect(minesPanel(page)).toBeVisible();
  await expect(castlesPanel(page)).toHaveCount(0);

  await tab(page, "resources").click();
  await expect(page).toHaveURL(/m=resources/);
  await expect(resourcesPanel(page)).toBeVisible();
  await expect(minesPanel(page)).toHaveCount(0);

  await tab(page, "laws").click();
  await expect(page).toHaveURL(/m=laws/);
  await expect(lawsPanel(page)).toBeVisible();
  await expect(resourcesPanel(page)).toHaveCount(0);

  await tab(page, "castles").click();
  await expect(page).toHaveURL(/m=castles/);
  await expect(castlesPanel(page)).toBeVisible();
  await expect(lawsPanel(page)).toHaveCount(0);
});

test("the active tab survives a page reload via the URL", async ({ page }) => {
  await tab(page, "laws").click();
  await expect(lawsPanel(page)).toBeVisible();

  await page.reload();

  await expect(lawsPanel(page)).toBeVisible();
  await expect(castlesPanel(page)).toHaveCount(0);
});

test("returning to castles does not spawn an extra castle tab", async ({
  page,
}) => {
  // one starting castle => exactly one tab
  await expect(page.getByRole("tab")).toHaveCount(1);

  // leaving and re-entering the castles panel remounts the board; the castle's
  // id must stay stable (it comes from the route loader) so no duplicate tab is
  // registered. Round-trip a few times to be sure it doesn't accumulate.
  for (const other of ["mines", "resources", "laws"]) {
    await tab(page, other).click();
    await tab(page, "castles").click();
    await expect(castlesPanel(page)).toBeVisible();
    await expect(page.getByRole("tab")).toHaveCount(1);
  }
});
