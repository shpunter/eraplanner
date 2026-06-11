# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: resources.spec.ts >> a build survives leaving and returning to the castles tab
- Location: e2e/resources.spec.ts:100:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByTestId('income-gold')
Expected: "+750"
Received: "+500"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" with timeout 5000ms
  - waiting for getByTestId('income-gold')
    14 × locator resolved to <div class="_income_1rudg_52" data-testid="income-gold" data-tsd-source="/src/features/resourceBar/ResourceBar.tsx:67:17">+500</div>
       - unexpected value "+500"

```

```yaml
- text: "+500"
```

# Test source

```ts
  1   | import { test, expect, type Page } from "@playwright/test";
  2   | 
  3   | // Resource-calculation coverage for the timeline in
  4   | // src/features/resourceBar/timeline.utils.ts. The bar (always in the header)
  5   | // shows the available amount and the per-day income rate for the *selected*
  6   | // day, so every assertion here is "navigate to a day, read the snapshot".
  7   | //
  8   | // Baseline (difficulty 3, the default) on a fresh /faction/hive load:
  9   | //   available -> gold 10000, wood 10, ore 10, crystals 5, gems 5, mercury 5,
  10  | //                dust 50, law 0, astrology 0
  11  | //   income    -> gold 500, law 500, astrology 500 (the rest 0)
  12  | // The income comes from hive's pre-builds (id01 produces 500/500/500), which
  13  | // start emitting on their found day (D1 for the starting castle).
  14  | //
  15  | // The model that drives the expected numbers below:
  16  | //  - recurring producers (buildings' `produces`, castle mines, tile mines,
  17  | //    "daily" laws, pre-builds) pay out the day AFTER they appear;
  18  | //  - one-off gains (resource piles, "once" laws) land the SAME day;
  19  | //  - a building's `cost` is paid the day it's built.
  20  | 
  21  | const available = (page: Page, key: string) =>
  22  |   page.getByTestId(`available-${key}`);
  23  | 
  24  | const income = (page: Page, key: string) => page.getByTestId(`income-${key}`);
  25  | 
  26  | const day = (page: Page, index: number) =>
  27  |   page.getByTestId("day").nth(index);
  28  | 
  29  | const next = (page: Page) => page.locator('[data-testid="next"]');
  30  | const tab = (page: Page, id: string) => page.getByTestId(`tab-${id}`);
  31  | const building = (page: Page, id: string) => page.locator(`#${id}`);
  32  | 
  33  | const expectAvailable = async (
  34  |   page: Page,
  35  |   values: Record<string, number>,
  36  | ): Promise<void> => {
  37  |   for (const [key, value] of Object.entries(values)) {
  38  |     await expect(available(page, key)).toHaveText(String(value));
  39  |   }
  40  | };
  41  | 
  42  | const expectIncome = async (
  43  |   page: Page,
  44  |   values: Record<string, number>,
  45  | ): Promise<void> => {
  46  |   for (const [key, value] of Object.entries(values)) {
> 47  |     await expect(income(page, key)).toHaveText(`+${value}`);
      |                                     ^ Error: expect(locator).toHaveText(expected) failed
  48  |   }
  49  | };
  50  | 
  51  | test.beforeEach(async ({ page }) => {
  52  |   await page.goto("/faction/hive");
  53  |   // #id20 only renders once the deferred castle data resolves; waiting on it
  54  |   // means the grid is hydrated and the starting castle has been registered.
  55  |   await building(page, "id20").waitFor();
  56  | });
  57  | 
  58  | test("D1 reflects the starting castle's pre-build income", async ({ page }) => {
  59  |   await expectAvailable(page, {
  60  |     gold: 10000,
  61  |     wood: 10,
  62  |     ore: 10,
  63  |     crystals: 5,
  64  |     gems: 5,
  65  |     mercury: 5,
  66  |     dust: 50,
  67  |     law: 0,
  68  |     astrology: 0,
  69  |   });
  70  |   await expectIncome(page, {
  71  |     gold: 500,
  72  |     law: 500,
  73  |     astrology: 500,
  74  |     wood: 0,
  75  |     ore: 0,
  76  |   });
  77  | 
  78  |   // income accrues on the next day: +500 gold/law/astrology
  79  |   await next(page).click();
  80  |   await expectAvailable(page, { gold: 10500, law: 500, astrology: 500 });
  81  |   await expectIncome(page, { gold: 500, law: 500, astrology: 500 });
  82  | });
  83  | 
  84  | test("adding a building pays its cost today and its income tomorrow", async ({
  85  |   page,
  86  | }) => {
  87  |   // id11 (Apiary's Heart II): cost gold 2500 / wood 5 / ore 5,
  88  |   // produces gold 250 / law 250 / astrology 250. Its prereq id01 is a pre-build.
  89  |   await building(page, "id11").click();
  90  | 
  91  |   // cost is paid on D1; income rate jumps by the produces amount
  92  |   await expectAvailable(page, { gold: 7500, wood: 5, ore: 5 });
  93  |   await expectIncome(page, { gold: 750, law: 750, astrology: 750 });
  94  | 
  95  |   // tomorrow the higher rate accrues: 7500 + 750 gold, 0 + 750 law/astrology
  96  |   await next(page).click();
  97  |   await expectAvailable(page, { gold: 8250, wood: 5, ore: 5, law: 750, astrology: 750 });
  98  | });
  99  | 
  100 | test("a build survives leaving and returning to the castles tab", async ({
  101 |   page,
  102 | }) => {
  103 |   // The castles tab remounts CastleGrid on every visit, which re-registers the
  104 |   // castle. Registration must be idempotent (see addCastle): re-entering must
  105 |   // NOT wipe the built list. Regression for the "building disappears" bug.
  106 |   await building(page, "id11").click();
  107 |   await expectIncome(page, { gold: 750, law: 750, astrology: 750 });
  108 | 
  109 |   await tab(page, "mines").click();
  110 |   await tab(page, "castles").click();
  111 | 
  112 |   // still built: income reflects id11, not the bare pre-build baseline of 500
  113 |   await expectIncome(page, { gold: 750, law: 750, astrology: 750 });
  114 |   await expectAvailable(page, { gold: 7500, wood: 5, ore: 5 });
  115 | });
  116 | 
  117 | test("removing a building reverts its cost and income", async ({ page }) => {
  118 |   await building(page, "id11").click();
  119 |   await expectAvailable(page, { gold: 7500 });
  120 |   await expectIncome(page, { gold: 750 });
  121 | 
  122 |   // the red "X" appears on built dwellings; removing id11 also removes its
  123 |   // (here unbuilt) descendants, clearing D1
  124 |   await building(page, "id11").getByRole("button", { name: "X" }).click();
  125 | 
  126 |   await expectAvailable(page, { gold: 10000, wood: 10, ore: 10 });
  127 |   await expectIncome(page, { gold: 500, law: 500, astrology: 500 });
  128 | });
  129 | 
  130 | test("a castle mine adds its output to the dwelling's income", async ({
  131 |   page,
  132 | }) => {
  133 |   await building(page, "id11").click();
  134 |   // id11's castle mine produces 500 of the chosen resource per day
  135 |   await building(page, "id11").getByTitle("law").click();
  136 | 
  137 |   // gold/astrology unchanged (750), law gets the extra +500 -> 1250
  138 |   await expectIncome(page, { gold: 750, law: 1250, astrology: 750 });
  139 |   await expectAvailable(page, { gold: 7500 });
  140 | 
  141 |   // the boosted law income accrues the next day
  142 |   await next(page).click();
  143 |   await expectAvailable(page, { gold: 8250, law: 1250, astrology: 750 });
  144 | });
  145 | 
  146 | test("adding a tile mine increases daily income from the next day", async ({
  147 |   page,
```