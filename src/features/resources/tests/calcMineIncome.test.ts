import { describe, expect, it } from "vitest";
import type { Mine } from "#/features/history/history.store";
import type { ResourceKey } from "#/shared/types";
import { calcMineIncome, ZERO_RESOURCES } from "../resources.utils";

describe("calcMineIncome", () => {
  // input: the mine id — expected: the resource key + rate it produces
  const MINES = [
    { mine: "gold", produces: "gold", rate: 1000 },
    { mine: "wood", produces: "wood", rate: 2 },
    { mine: "ore", produces: "ore", rate: 2 },
    { mine: "crystal", produces: "crystals", rate: 1 },
    { mine: "gem", produces: "gems", rate: 1 },
    { mine: "mercury", produces: "mercury", rate: 1 },
  ] as const satisfies ReadonlyArray<{
    mine: Mine;
    produces: ResourceKey;
    rate: number;
  }>;

  it("returns all-zero resources for no mines", () => {
    expect(calcMineIncome([])).toEqual(ZERO_RESOURCES);
  });

  it.each(MINES)(
    "maps a single $mine mine to $produces +$rate",
    ({ mine, produces, rate }) => {
      expect(calcMineIncome([mine])).toEqual({
        ...ZERO_RESOURCES,
        [produces]: rate,
      });
    },
  );

  it("accumulates repeated mines of the same type", () => {
    expect(calcMineIncome(["gold", "gold", "gold"]).gold).toBe(3000);
    expect(calcMineIncome(["ore", "ore"]).ore).toBe(4);
  });

  it("sums different mine types into their own keys", () => {
    const result = calcMineIncome(["gold", "wood", "wood", "gem"]);

    expect(result).toEqual({
      ...ZERO_RESOURCES,
      gold: 1000,
      wood: 4,
      gems: 1,
    });
  });

  it("handles all mine types at once", () => {
    const result = calcMineIncome(MINES.map((m) => m.mine));

    expect(result).toEqual({
      ...ZERO_RESOURCES,
      gold: 1000,
      wood: 2,
      ore: 2,
      crystals: 1,
      gems: 1,
      mercury: 1,
    });
  });

  it("leaves non-mine resources (law, astrology, dust) at zero", () => {
    const result = calcMineIncome(["gold", "ore", "gem", "mercury"]);

    expect(result.law).toBe(0);
    expect(result.astrology).toBe(0);
    expect(result.dust).toBe(0);
  });

  it("does not mutate ZERO_RESOURCES between calls", () => {
    calcMineIncome(["gold"]);

    expect(ZERO_RESOURCES.gold).toBe(0);
    expect(calcMineIncome([])).toEqual(ZERO_RESOURCES);
  });
});
