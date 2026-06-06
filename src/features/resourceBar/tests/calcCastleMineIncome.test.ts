import { describe, expect, it } from "vitest";
import {
  calcCastleMineIncome,
  type CastleMine,
  ZERO_RESOURCES,
} from "../resources.utils";

describe("calcCastleMineIncome", () => {
  // the resources a castle mine can be set to produce
  const RESOURCES: ReadonlyArray<CastleMine["resource"]> = [
    "gold",
    "law",
    "astrology",
  ];

  it("returns all-zero resources when no mine is set", () => {
    expect(calcCastleMineIncome(undefined)).toEqual(ZERO_RESOURCES);
  });

  it.each(RESOURCES)("puts the amount into %s", (resource) => {
    expect(calcCastleMineIncome({ resource, amount: 750 })).toEqual({
      ...ZERO_RESOURCES,
      [resource]: 750,
    });
  });

  it("supports an amount of zero", () => {
    expect(calcCastleMineIncome({ resource: "gold", amount: 0 })).toEqual(
      ZERO_RESOURCES,
    );
  });

  it("leaves the other resources at zero", () => {
    const result = calcCastleMineIncome({ resource: "law", amount: 500 });

    expect(result.law).toBe(500);
    expect(result.gold).toBe(0);
    expect(result.astrology).toBe(0);
    expect(result.dust).toBe(0);
  });
});
