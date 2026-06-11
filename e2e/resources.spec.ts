import { test, expect, type Page } from "@playwright/test";

// Resource-calculation coverage for the timeline in
// src/features/resourceBar/timeline.utils.ts. The bar (always in the header)
// shows the available amount and the per-day income rate for the *selected*
// day, so every assertion here is "navigate to a day, read the snapshot".
//
// Baseline (difficulty 3, the default) on a fresh /faction/hive load:
//   available -> gold 10000, wood 10, ore 10, crystals 5, gems 5, mercury 5,
//                dust 50, law 0, astrology 0
//   income    -> gold 500, law 500, astrology 500 (the rest 0)
// The income comes from hive's pre-builds (id01 produces 500/500/500), which
// start emitting on their found day (D1 for the starting castle).
//
// The model that drives the expected numbers below:
//  - recurring producers (buildings' `produces`, castle mines, tile mines,
//    "daily" laws, pre-builds) pay out the day AFTER they appear;
//  - one-off gains (resource piles, "once" laws) land the SAME day;
//  - a building's `cost` is paid the day it's built.

const available = (page: Page, key: string) =>
  page.getByTestId(`available-${key}`);

const income = (page: Page, key: string) => page.getByTestId(`income-${key}`);

const day = (page: Page, index: number) =>
  page.getByTestId("day").nth(index);

const next = (page: Page) => page.locator('[data-testid="next"]');
const tab = (page: Page, id: string) => page.getByTestId(`tab-${id}`);
const building = (page: Page, id: string) => page.locator(`#${id}`);

const expectAvailable = async (
  page: Page,
  values: Record<string, number>,
): Promise<void> => {
  for (const [key, value] of Object.entries(values)) {
    await expect(available(page, key)).toHaveText(String(value));
  }
};

const expectIncome = async (
  page: Page,
  values: Record<string, number>,
): Promise<void> => {
  for (const [key, value] of Object.entries(values)) {
    await expect(income(page, key)).toHaveText(`+${value}`);
  }
};

test.beforeEach(async ({ page }) => {
  await page.goto("/faction/hive");
  // #id20 only renders once the deferred castle data resolves; waiting on it
  // means the grid is hydrated and the starting castle has been registered.
  await building(page, "id20").waitFor();
});

test("D1 reflects the starting castle's pre-build income", async ({ page }) => {
  await expectAvailable(page, {
    gold: 10000,
    wood: 10,
    ore: 10,
    crystals: 5,
    gems: 5,
    mercury: 5,
    dust: 50,
    law: 0,
    astrology: 0,
  });
  await expectIncome(page, {
    gold: 500,
    law: 500,
    astrology: 500,
    wood: 0,
    ore: 0,
  });

  // income accrues on the next day: +500 gold/law/astrology
  await next(page).click();
  await expectAvailable(page, { gold: 10500, law: 500, astrology: 500 });
  await expectIncome(page, { gold: 500, law: 500, astrology: 500 });
});

test("adding a building pays its cost today and its income tomorrow", async ({
  page,
}) => {
  // id11 (Apiary's Heart II): cost gold 2500 / wood 5 / ore 5,
  // produces gold 250 / law 250 / astrology 250. Its prereq id01 is a pre-build.
  await building(page, "id11").click();

  // cost is paid on D1; income rate jumps by the produces amount
  await expectAvailable(page, { gold: 7500, wood: 5, ore: 5 });
  await expectIncome(page, { gold: 750, law: 750, astrology: 750 });

  // tomorrow the higher rate accrues: 7500 + 750 gold, 0 + 750 law/astrology
  await next(page).click();
  await expectAvailable(page, { gold: 8250, wood: 5, ore: 5, law: 750, astrology: 750 });
});

test("a build survives leaving and returning to the castles tab", async ({
  page,
}) => {
  // The castles tab remounts CastleGrid on every visit, which re-registers the
  // castle. Registration must be idempotent (see addCastle): re-entering must
  // NOT wipe the built list. Regression for the "building disappears" bug.
  await building(page, "id11").click();
  await expectIncome(page, { gold: 750, law: 750, astrology: 750 });

  await tab(page, "mines").click();
  await tab(page, "castles").click();

  // still built: income reflects id11, not the bare pre-build baseline of 500
  await expectIncome(page, { gold: 750, law: 750, astrology: 750 });
  await expectAvailable(page, { gold: 7500, wood: 5, ore: 5 });
});

test("removing a building reverts its cost and income", async ({ page }) => {
  await building(page, "id11").click();
  await expectAvailable(page, { gold: 7500 });
  await expectIncome(page, { gold: 750 });

  // the red "X" appears on built dwellings; removing id11 also removes its
  // (here unbuilt) descendants, clearing D1
  await building(page, "id11").getByRole("button", { name: "X" }).click();

  await expectAvailable(page, { gold: 10000, wood: 10, ore: 10 });
  await expectIncome(page, { gold: 500, law: 500, astrology: 500 });
});

test("a castle mine adds its output to the dwelling's income", async ({
  page,
}) => {
  await building(page, "id11").click();
  // id11's castle mine produces 500 of the chosen resource per day
  await building(page, "id11").getByTitle("law").click();

  // gold/astrology unchanged (750), law gets the extra +500 -> 1250
  await expectIncome(page, { gold: 750, law: 1250, astrology: 750 });
  await expectAvailable(page, { gold: 7500 });

  // the boosted law income accrues the next day
  await next(page).click();
  await expectAvailable(page, { gold: 8250, law: 1250, astrology: 750 });
});

test("adding a tile mine increases daily income from the next day", async ({
  page,
}) => {
  await tab(page, "mines").click();
  await page.getByTestId("mine-gold").click();

  // a gold mine is +1000/day; available unchanged on the placement day
  await expectIncome(page, { gold: 1500 });
  await expectAvailable(page, { gold: 10000 });

  await next(page).click();
  await expectAvailable(page, { gold: 11500 });
});

test("dropping a resource pile lands the same day (conservative minimum)", async ({
  page,
}) => {
  await tab(page, "resources").click();
  await page.getByTestId("resource-gold").click();

  // gold pile minimum is 400, added immediately; income rate is untouched
  await expectAvailable(page, { gold: 10400 });
  await expectIncome(page, { gold: 500 });

  await page.getByTestId("resource-dust").click();
  await expectAvailable(page, { gold: 10400, dust: 58 }); // 50 + 8 (dust min)
});

// test("a 'once' law lands today and a 'daily' law raises income", async ({
//   page,
// }) => {
//   await tab(page, "law").click();

//   // l000 is a one-off: gold 2500 / wood 5 / ore 5, granted the same day.
//   // .first() because the tree is mirrored onto both halves of the scroll.
//   await page.getByTestId("law-l000").first().click();
//   await expectAvailable(page, { gold: 12500, wood: 15, ore: 15 });
//   await expectIncome(page, { gold: 500 });

//   // l100 is "daily": +250 gold/day, so the income rate goes 500 -> 750
//   await page.getByTestId("law-l100").first().click();
//   await expectIncome(page, { gold: 750 });

//   // next day the once-gain stays banked and the daily rate accrues
//   await next(page).click();
//   await expectAvailable(page, { gold: 13250 }); // 12500 + 750
// });

test("adding castles on different days stacks their pre-build income", async ({
  page,
}) => {
  // add a second hive on D1: another id01 pre-build -> income doubles to 1000
  await tab(page, "castles").click();
  await page.getByRole("button", { name: "+" }).click();
  await expectIncome(page, { gold: 1000, law: 1000, astrology: 1000 });

  // jump to D3 and add a third castle there (found day = D3, not D1)
  await day(page, 2).click();
  await expectIncome(page, { gold: 1000, law: 1000, astrology: 1000 });
  await expectAvailable(page, { gold: 12000, law: 2000, astrology: 2000 });

  await page.getByRole("button", { name: "+" }).click();
  // the third castle's pre-build income kicks in from D3: 1000 -> 1500
  await expectIncome(page, { gold: 1500, law: 1500, astrology: 1500 });
  // available on D3 is unchanged (the new rate only accrues from D4)
  await expectAvailable(page, { gold: 12000, law: 2000, astrology: 2000 });

  await next(page).click();
  await expectAvailable(page, { gold: 13500, law: 3500, astrology: 3500 });
});

test("calendar navigation isolates a build to its day and later", async ({
  page,
}) => {
  // build id11 on D3
  await day(page, 2).click();
  await building(page, "id11").click();
  await expectAvailable(page, { gold: 8500, wood: 5, ore: 5, law: 1000, astrology: 1000 });
  await expectIncome(page, { gold: 750, law: 750, astrology: 750 });

  // earlier days are untouched: D1 still shows the pre-build-only baseline
  await day(page, 0).click();
  await expectAvailable(page, { gold: 10000, wood: 10, ore: 10, law: 0, astrology: 0 });
  await expectIncome(page, { gold: 500, law: 500, astrology: 500 });

  // D4 carries the post-build rate forward
  await day(page, 3).click();
  await expectAvailable(page, { gold: 9250, law: 1750, astrology: 1750 });
  await expectIncome(page, { gold: 750 });
});

test("mixed on D1, then a daily law unlocks once honor + spent allow it", async ({
  page,
}) => {
  // --- D1: building + castle mine + tile mine + pile (all valid same-day) ---
  // A "daily" law can't be enacted yet: on D1 there's no law-honor (resLaw),
  // and even with honor a law stays disabled until enough has been `spent` on
  // cheaper laws (l100's `limit` is 5). So the law work happens later, below.
  //
  await tab(page, "resources").click();
  await page.getByTestId("resource-gold").click(); // +400 gold today

  await tab(page, "mines").click();
  await page.getByTestId("mine-gold").click(); // +1000 gold/day

  await tab(page, "castles").click();
  await building(page, "id11").click(); // -cost, +250/250/250 income
  await building(page, "id11").getByTitle("law").click(); // +500 law/day

  // D1 snapshot (no law yet):
  //   available gold = 10000 + 400 (pile) - 2500 (id11 cost) = 7900
  //   income gold = 500 (pre) + 250 (id11) + 1000 (mine) = 1750
  //   income law  = 500 (pre) + 250 (id11) + 500 (castle mine) = 1250
  await expectAvailable(page, { gold: 7900, wood: 5, ore: 5 });
  await expectIncome(page, { gold: 1750, law: 1250, astrology: 750 });

  // --- W4 D7: honor has accrued, but the daily law is still gated by `spent` ---
  // 27 days at the rates above bank: law = 1250 * 27 = 33750 (~level 23, plenty
  // for l100), gold = 7900 + 1750 * 27 = 55150.
  await tab(page, "law").click();
  await page.getByTestId("week").nth(3).click(); // W4
  await page.getByTestId("day").nth(6).click(); // D7 -> historyIDX 27
  await expectAvailable(page, { gold: 55150, law: 33750 });
  await expectIncome(page, { gold: 1750, law: 1250 });

  // l100 is affordable now (honor is high) but disabled: nothing has been spent,
  // and its `limit` requires spent >= 5. Clicking it is a no-op.
  await page.getByTestId("law-l100").first().click();
  await expectIncome(page, { gold: 1750 }); // unchanged — l100 did not enact

  // Enact l020 three times (cost 2, max 3, no resource income) -> spent = 6 >= 5.
  const l020 = page.getByTestId("law-l020").first();
  await l020.click();
  await l020.click();
  await l020.click();

  // With spent past l100's limit, the daily law finally enacts: +250 gold/day.
  await page.getByTestId("law-l100").first().click();
  await expectIncome(page, { gold: 2000, law: 1250 });
  await expectAvailable(page, { gold: 55150, law: 33750 }); // today's banked unchanged

  // next day everything accrues at the new rates (gold now includes the law)
  await next(page).click();
  await expectAvailable(page, { gold: 57150, law: 35000, astrology: 21000 });
});
