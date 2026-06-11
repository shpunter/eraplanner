import { describe, expect, it } from "vitest";
import type { BuildingType, Mine } from "#/features/history/history.store";
import type { BuildingID, CastleID } from "#/routes/faction/$id";
import type { ResourceRecord } from "#/shared/types";
import { ZERO_RESOURCES } from "../resources.utils";
import { buildTimeline, TOTAL_DAYS } from "../timeline.utils";

type Input = Parameters<typeof buildTimeline>[0];

const res = (partial: Partial<ResourceRecord>): ResourceRecord => ({
  ...ZERO_RESOURCES,
  ...partial,
});

const building = (
  id: BuildingID,
  {
    cost = {},
    produces = {},
  }: { cost?: BuildingType["cost"]; produces?: BuildingType["produces"] } = {},
): BuildingType => ({
  id,
  name: id,
  prev: null,
  next: null,
  pos: [0, 0],
  cost,
  produces,
});

// a built timeline with the given building ids placed on the given days
const builtOn = (
  entries: Record<number, BuildingID>,
): (BuildingID | undefined)[] => {
  const arr: (BuildingID | undefined)[] = [];
  for (const [day, id] of Object.entries(entries)) arr[Number(day)] = id;
  return arr;
};

const makeInput = (over: Partial<Input> = {}): Input => ({
  iniRes: res({ gold: 10_000 }),
  history: {},
  castles: {},
  mines: [],
  castleMines: {},
  resources: [],
  ...over,
});

describe("buildTimeline", () => {
  it("returns a snapshot for every calendar day", () => {
    const days = buildTimeline(makeInput());

    expect(days).toHaveLength(TOTAL_DAYS);
  });

  it("keeps every day at the initial resources when nothing is built", () => {
    const iniRes = res({ gold: 10_000, wood: 5 });
    const days = buildTimeline(makeInput({ iniRes }));

    expect(days[0].available).toEqual(iniRes);
    expect(days[TOTAL_DAYS - 1].available).toEqual(iniRes);
    expect(days.every((day) => !day.isNegative)).toBe(true);
  });

  it("subtracts a building's cost on its build day and keeps it spent", () => {
    const days = buildTimeline(
      makeInput({
        castles: {
          c1: {
            buildings: { id20: building("id20", { cost: { gold: 500 } }) },
            preBuilds: [],
            castleID: "hive" as CastleID,
            foundDay: 0,
          },
        },
        history: { c1: { built: builtOn({ 2: "id20" }), disabled: [] } },
      }),
    );

    expect(days[1].available.gold).toBe(10_000);
    expect(days[2].available.gold).toBe(9_500);
    expect(days[3].available.gold).toBe(9_500);
  });

  it("accrues a building's produces from the next day", () => {
    const days = buildTimeline(
      makeInput({
        castles: {
          c1: {
            buildings: { id20: building("id20", { produces: { gold: 100 } }) },
            preBuilds: [],
            castleID: "hive" as CastleID,
            foundDay: 0,
          },
        },
        history: { c1: { built: builtOn({ 0: "id20" }), disabled: [] } },
      }),
    );

    expect(days[0].available.gold).toBe(10_000); // built today, no income yet
    expect(days[0].incomePerDay.gold).toBe(100);
    expect(days[1].available.gold).toBe(10_100);
    expect(days[2].available.gold).toBe(10_200);
  });

  it("accrues tile mines from the next day", () => {
    const mines: Mine[][] = [];
    mines[1] = ["gold"]; // a gold mine placed on day 1 (rate 1000)

    const days = buildTimeline(makeInput({ mines }));

    expect(days[1].available.gold).toBe(10_000);
    expect(days[1].incomePerDay.gold).toBe(1_000);
    expect(days[2].available.gold).toBe(11_000);
  });

  it("accrues a castle mine's chosen output from the next day", () => {
    const days = buildTimeline(
      makeInput({
        castles: {
          c1: {
            buildings: { id11: building("id11") },
            preBuilds: [],
            castleID: "hive" as CastleID,
            foundDay: 0,
          },
        },
        history: { c1: { built: builtOn({ 0: "id11" }), disabled: [] } },
        castleMines: { c1: { id11: { resource: "law", amount: 750 } } },
      }),
    );

    expect(days[0].available.law).toBe(0);
    expect(days[0].incomePerDay.law).toBe(750);
    expect(days[1].available.law).toBe(750);
  });

  it("emits pre-build income from each castle's found day (+1)", () => {
    const days = buildTimeline(
      makeInput({
        castles: {
          early: {
            buildings: { id01: building("id01", { produces: { gold: 500 } }) },
            preBuilds: ["id01"],
            castleID: "hive" as CastleID,
            foundDay: 0,
          },
          late: {
            buildings: { id01: building("id01", { produces: { gold: 200 } }) },
            preBuilds: ["id01"],
            castleID: "necropolis" as CastleID,
            foundDay: 5,
          },
        },
      }),
    );

    expect(days[0].available.gold).toBe(10_000); // early found, produces from day 1
    expect(days[1].available.gold).toBe(10_500);
    expect(days[5].available.gold).toBe(12_500); // 5 days of +500, late not yet
    expect(days[6].available.gold).toBe(13_200); // now +500 +200
  });

  it("flags days where a resource goes negative", () => {
    const days = buildTimeline(
      makeInput({
        iniRes: res({ gold: 10_000 }),
        castles: {
          c1: {
            buildings: { id20: building("id20", { cost: { gold: 15_000 } }) },
            preBuilds: [],
            castleID: "hive" as CastleID,
            foundDay: 0,
          },
        },
        history: { c1: { built: builtOn({ 0: "id20" }), disabled: [] } },
      }),
    );

    expect(days[0].available.gold).toBe(-5_000);
    expect(days[0].isNegative).toBe(true);
  });

  it("pools costs across all castles", () => {
    const days = buildTimeline(
      makeInput({
        castles: {
          c1: {
            buildings: { id20: building("id20", { cost: { gold: 500 } }) },
            preBuilds: [],
            castleID: "hive" as CastleID,
            foundDay: 0,
          },
          c2: {
            buildings: { id20: building("id20", { cost: { gold: 500 } }) },
            preBuilds: [],
            castleID: "necropolis" as CastleID,
            foundDay: 0,
          },
        },
        history: {
          c1: { built: builtOn({ 0: "id20" }), disabled: [] },
          c2: { built: builtOn({ 0: "id20" }), disabled: [] },
        },
      }),
    );

    expect(days[0].available.gold).toBe(9_000);
  });

  it("scenario: tile mines, Heart II/III law mines, then law res & mine changes", () => {
    // d1: place 3 ore + 3 wood tile mines (rate 2 each) -> +6 ore, +6 wood/day
    const mines: Mine[][] = [];
    mines[1] = ["ore", "ore", "ore", "wood", "wood", "wood"];

    // d4: a law "once" resource change (+1000 gold, lands the same day)
    const lawRes: { resID: string; amount: number }[][] = [];
    lawRes[4] = [{ resID: "gold", amount: 1000 }];

    // d5: a law "daily" mine change (+100 law/day, accrues from the next day)
    const lawMine: { resID: string; amount: number }[][] = [];
    lawMine[5] = [{ resID: "law", amount: 100 }];

    const days = buildTimeline(
      makeInput({
        iniRes: res({ gold: 100_000, wood: 100, ore: 100 }),
        castles: {
          c1: {
            buildings: {
              // Heart II / Heart III. The build-day cost is paid here; each
              // one's law output comes from its chosen castle mine below.
              id11: building("id11", { cost: { gold: 2500, wood: 5, ore: 5 } }),
              id21: building("id21", {
                cost: { gold: 5000, wood: 10, ore: 10 },
              }),
            },
            preBuilds: [],
            castleID: "hive" as CastleID,
            foundDay: 0,
          },
        },
        // d2: build Heart II (id11); d3: build Heart III (id21)
        history: {
          c1: { built: builtOn({ 2: "id11", 3: "id21" }), disabled: [] },
        },
        // each Heart's castle mine set to law (750/day), accrues from next day
        castleMines: {
          c1: {
            id11: { resource: "law", amount: 750 },
            id21: { resource: "law", amount: 750 },
          },
        },
        mines,
        busLaws: { resource: lawRes, mine: lawMine },
      }),
    );

    // d1: tile mines placed -> income starts next day, nothing accrued yet
    expect(days[1].incomePerDay.ore).toBe(6);
    expect(days[1].incomePerDay.wood).toBe(6);
    expect(days[1].available.law).toBe(0);

    // d2: Heart II built -> 2500 gold cost paid; its law mine starts d3
    expect(days[2].available.gold).toBe(97_500);
    expect(days[2].incomePerDay.law).toBe(750);

    // d3: Heart III built -> 5000 gold cost; both law mines now run (+1500/day)
    expect(days[3].available.gold).toBe(92_500);
    expect(days[3].available.law).toBe(750); // one day of the first law mine
    expect(days[3].incomePerDay.law).toBe(1_500);

    // d4: law "once" res change lands the same day (+1000 gold over accrual)
    expect(days[4].available.gold).toBe(93_500);
    expect(days[4].available.law).toBe(2_250); // 750 + 1500

    // d5: law "daily" mine change placed -> +100 law/day from d6
    expect(days[5].available.law).toBe(3_750); // 2250 + 1500
    expect(days[5].incomePerDay.law).toBe(1_600); // 1500 + 100

    // d6: the new law-mine rate now flows on top of the castle mines
    expect(days[6].available.law).toBe(5_350); // 3750 + 1600
    // ore kept flowing: 100 + 6/day×5 (d2..d6) − 15 spent on Heart II + III
    expect(days[6].available.ore).toBe(115);
  });
});
