import { describe, expect, it } from "vitest";
import { subtractResources, ZERO_RESOURCES } from "../resources.utils";

describe("subtractResources", () => {
  it("subtracts every resource key independently", () => {
    const a = {
      gold: 100,
      wood: 90,
      ore: 80,
      crystals: 70,
      gems: 60,
      mercury: 50,
      law: 40,
      astrology: 30,
      dust: 20,
    };
    const b = {
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

    expect(subtractResources(a, b)).toEqual({
      gold: 99,
      wood: 88,
      ore: 77,
      crystals: 66,
      gems: 55,
      mercury: 44,
      law: 33,
      astrology: 22,
      dust: 11,
    });
  });

  it("can go negative", () => {
    const result = subtractResources(
      { ...ZERO_RESOURCES, gold: 100 },
      { ...ZERO_RESOURCES, gold: 150 },
    );

    expect(result.gold).toBe(-50);
  });

  it("treats ZERO_RESOURCES as the right identity", () => {
    const record = { ...ZERO_RESOURCES, gold: 100, dust: 7 };

    expect(subtractResources(record, ZERO_RESOURCES)).toEqual(record);
  });

  it("negates the second record when subtracting from zero", () => {
    const result = subtractResources(ZERO_RESOURCES, {
      ...ZERO_RESOURCES,
      gold: 100,
      ore: 5,
    });

    expect(result.gold).toBe(-100);
    expect(result.ore).toBe(-5);
  });

  it("is not commutative (order matters)", () => {
    const a = { ...ZERO_RESOURCES, gold: 5, wood: 3 };
    const b = { ...ZERO_RESOURCES, gold: 2, ore: 9 };

    expect(subtractResources(a, b)).not.toEqual(subtractResources(b, a));
  });

  it("does not mutate its inputs", () => {
    const a = { ...ZERO_RESOURCES, gold: 100 };
    const b = { ...ZERO_RESOURCES, gold: 50 };

    subtractResources(a, b);

    expect(a.gold).toBe(100);
    expect(b.gold).toBe(50);
  });
});
