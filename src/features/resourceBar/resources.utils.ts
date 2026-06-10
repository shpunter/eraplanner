import type { ResourceKey, ResourceRecord } from "#/shared/types";
import type { Mine } from "../history/history.store";

export const ZERO_RESOURCES: ResourceRecord = {
  gold: 0,
  wood: 0,
  ore: 0,
  crystals: 0,
  gems: 0,
  mercury: 0,
  law: 0,
  astrology: 0,
  dust: 0,
};

const MINE_INCOME: Record<Mine, { key: ResourceKey; rate: number }> = {
  gold: { key: "gold", rate: 1000 },
  wood: { key: "wood", rate: 2 },
  ore: { key: "ore", rate: 2 },
  crystals: { key: "crystals", rate: 1 },
  gem: { key: "gems", rate: 1 },
  mercury: { key: "mercury", rate: 1 },
};

export const calcMineIncome = (mines: Mine[]): ResourceRecord => {
  const income = { ...ZERO_RESOURCES };

  for (const mine of mines) {
    const { key, rate } = MINE_INCOME[mine];

    income[key] += rate;
  }

  return income;
};

// A castle mine is the player-chosen production attached to a dwelling
// (see addCastleMines in the history store). Like other producers, the amount
// is added to daily income from the day after the dwelling is built.
export const calcCastleMineIncome = (
  mine: CastleMine | undefined,
): ResourceRecord => {
  if (!mine) return ZERO_RESOURCES;

  return { ...ZERO_RESOURCES, [mine.resource]: mine.amount };
};

// One-time resource piles the player drops on a day. Each gives an amount in a
// min–max range; the timeline uses the conservative minimum.
export const RESOURCE_GAIN_RANGES = {
  gold: { min: 400, max: 900 },
  wood: { min: 4, max: 6 },
  ore: { min: 4, max: 6 },
  crystals: { min: 2, max: 4 },
  gems: { min: 2, max: 4 },
  mercury: { min: 2, max: 4 },
  dust: { min: 8, max: 12 },
} satisfies Partial<Record<ResourceKey, { min: number; max: number }>>;

export type ResourceGainKey = keyof typeof RESOURCE_GAIN_RANGES;

// Sums the one-time gains for resources dropped on a single day, using each
// resource's minimum (conservative) amount.
export const calcResourceGain = (resources: ResourceKey[]): ResourceRecord => {
  const gain = { ...ZERO_RESOURCES };

  for (const key of resources) {
    const range = RESOURCE_GAIN_RANGES[key as ResourceGainKey];
    if (range) gain[key] += range.min;
  }

  return gain;
};

// Sums law income entries published by the micro remote over the bus into a
// resource record. `resID` arrives as a plain string (the bus is domain
// agnostic), so unknown keys are ignored.
export const sumLawEntries = (
  entries: { resID: string; amount: number }[],
): ResourceRecord => {
  const out = { ...ZERO_RESOURCES };

  for (const { resID, amount } of entries) {
    if (resID in out) out[resID as ResourceKey] += amount;
  }

  return out;
};

export const addResources = (
  a: ResourceRecord,
  b: ResourceRecord,
): ResourceRecord => {
  return {
    gold: a.gold + b.gold,
    wood: a.wood + b.wood,
    ore: a.ore + b.ore,
    crystals: a.crystals + b.crystals,
    gems: a.gems + b.gems,
    mercury: a.mercury + b.mercury,
    law: a.law + b.law,
    astrology: a.astrology + b.astrology,
    dust: a.dust + b.dust,
  };
};

export const subtractResources = (
  a: ResourceRecord,
  b: ResourceRecord,
): ResourceRecord => {
  return {
    gold: a.gold - b.gold,
    wood: a.wood - b.wood,
    ore: a.ore - b.ore,
    crystals: a.crystals - b.crystals,
    gems: a.gems - b.gems,
    mercury: a.mercury - b.mercury,
    law: a.law - b.law,
    astrology: a.astrology - b.astrology,
    dust: a.dust - b.dust,
  };
};

export type CastleMine = {
  resource: "gold" | "law" | "astrology";
  amount: number;
};
