import { describe, expect, it } from "vitest";
import type { Mine } from "#/features/history/history.store";
import type { ResourceRecord } from "#/shared/types";
import { ZERO_RESOURCES } from "../resources.utils";
import { buildTimeline, TOTAL_DAYS } from "../timeline.utils";

type Input = Parameters<typeof buildTimeline>[0];

const res = (partial: Partial<ResourceRecord>): ResourceRecord => ({
  ...ZERO_RESOURCES,
  ...partial,
});

const makeInput = (over: Partial<Input> = {}): Input => ({
  iniRes: res({ gold: 10_000 }),
  mines: [],
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
    const resource: { resID: string; amount: number }[][] = [];
    resource[2] = [{ resID: "gold", amount: -500 }];

    const days = buildTimeline(
      makeInput({ busCastles: { resource, mine: [] } }),
    );

    expect(days[1].available.gold).toBe(10_000);
    expect(days[2].available.gold).toBe(9_500);
    expect(days[3].available.gold).toBe(9_500);
  });

  it("accrues a building's produces from the next day", () => {
    const mine: { resID: string; amount: number }[][] = [];
    mine[0] = [{ resID: "gold", amount: 100 }];

    const days = buildTimeline(
      makeInput({ busCastles: { resource: [], mine } }),
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
    const mine: { resID: string; amount: number }[][] = [];
    mine[0] = [{ resID: "law", amount: 750 }];

    const days = buildTimeline(
      makeInput({ busCastles: { resource: [], mine } }),
    );

    expect(days[0].available.law).toBe(0);
    expect(days[0].incomePerDay.law).toBe(750);
    expect(days[1].available.law).toBe(750);
  });

  it("emits castle income as a recurring daily rate from busCastles.mine", () => {
    // 700 gold/day total (e.g. two pre-built structures), recurring from day 1
    const mine: { resID: string; amount: number }[][] = [];
    mine[0] = [{ resID: "gold", amount: 700 }];

    const days = buildTimeline(
      makeInput({ busCastles: { resource: [], mine } }),
    );

    expect(days[0].available.gold).toBe(10_000); // income accrues from next day
    expect(days[1].available.gold).toBe(10_700);
    expect(days[5].available.gold).toBe(13_500); // 10_000 + 5 × 700
    expect(days[6].available.gold).toBe(14_200);
  });

  it("flags days where a resource goes negative", () => {
    const resource: { resID: string; amount: number }[][] = [];
    resource[0] = [{ resID: "gold", amount: -15_000 }];

    const days = buildTimeline(
      makeInput({ busCastles: { resource, mine: [] } }),
    );

    expect(days[0].available.gold).toBe(-5_000);
    expect(days[0].isNegative).toBe(true);
  });

  it("pools costs across all castles", () => {
    const resource: { resID: string; amount: number }[][] = [];
    resource[0] = [
      { resID: "gold", amount: -500 },
      { resID: "gold", amount: -500 },
    ];

    const days = buildTimeline(
      makeInput({ busCastles: { resource, mine: [] } }),
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

    // Castle building costs and mine income via bus:
    //   d2: Heart II (id11) costs 2500 gold, 5 wood, 5 ore; its law mine (+750/day) starts d3
    //   d3: Heart III (id21) costs 5000 gold, 10 wood, 10 ore; its law mine (+750/day) starts d4
    const castleResource: { resID: string; amount: number }[][] = [];
    castleResource[2] = [
      { resID: "gold", amount: -2500 },
      { resID: "wood", amount: -5 },
      { resID: "ore", amount: -5 },
    ];
    castleResource[3] = [
      { resID: "gold", amount: -5000 },
      { resID: "wood", amount: -10 },
      { resID: "ore", amount: -10 },
    ];
    const castleMine: { resID: string; amount: number }[][] = [];
    castleMine[2] = [{ resID: "law", amount: 750 }];
    castleMine[3] = [{ resID: "law", amount: 750 }];

    const days = buildTimeline(
      makeInput({
        iniRes: res({ gold: 100_000, wood: 100, ore: 100 }),
        mines,
        busLaws: { resource: lawRes, mine: lawMine },
        busCastles: { resource: castleResource, mine: castleMine },
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
