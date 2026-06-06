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
  crystal: { key: "crystals", rate: 1 },
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

export type CastleMine = {
  resource: "gold" | "law" | "astrology";
  amount: number;
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
