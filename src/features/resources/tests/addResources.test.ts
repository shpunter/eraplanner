import { describe, expect, it } from "vitest";
import { addResources, ZERO_RESOURCES } from "../resources.utils";

describe("addResources", () => {
  it("adds every resource key independently", () => {
    const a = {
      gold: 1,
      wood: 2,
      ore: 3,
      crystals: 4,
      gems: 5,
      mercury: 6,
      law: 7,
      astrology: 8,
      dust: 9,
    };
    const b = {
      gold: 10,
      wood: 20,
      ore: 30,
      crystals: 40,
      gems: 50,
      mercury: 60,
      law: 70,
      astrology: 80,
      dust: 90,
    };

    expect(addResources(a, b)).toEqual({
      gold: 11,
      wood: 22,
      ore: 33,
      crystals: 44,
      gems: 55,
      mercury: 66,
      law: 77,
      astrology: 88,
      dust: 99,
    });
  });

  it("treats ZERO_RESOURCES as the identity", () => {
    const record = { ...ZERO_RESOURCES, gold: 100, dust: 7 };

    expect(addResources(record, ZERO_RESOURCES)).toEqual(record);
    expect(addResources(ZERO_RESOURCES, record)).toEqual(record);
  });

  it("handles negative amounts", () => {
    const result = addResources(
      { ...ZERO_RESOURCES, gold: 100 },
      { ...ZERO_RESOURCES, gold: -150, ore: -2 },
    );

    expect(result.gold).toBe(-50);
    expect(result.ore).toBe(-2);
  });

  it("is commutative", () => {
    const a = { ...ZERO_RESOURCES, gold: 5, wood: 3 };
    const b = { ...ZERO_RESOURCES, gold: 2, ore: 9 };

    expect(addResources(a, b)).toEqual(addResources(b, a));
  });

  it("does not mutate its inputs", () => {
    const a = { ...ZERO_RESOURCES, gold: 100 };
    const b = { ...ZERO_RESOURCES, gold: 50 };

    addResources(a, b);

    expect(a.gold).toBe(100);
    expect(b.gold).toBe(50);
  });
});
