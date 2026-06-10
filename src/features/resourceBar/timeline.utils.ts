import type { ResourceKey, ResourceRecord } from "#/shared/types";
import { RESOURCE_KEYS } from "#/shared/constants";
import type { Mine, useHistoryStore } from "../history/history.store";
import {
  addResources,
  calcCastleMineIncome,
  calcMineIncome,
  calcResourceGain,
  subtractResources,
  sumLawEntries,
  ZERO_RESOURCES,
} from "./resources.utils";

// Per-day law income published by the micro remote: `resource[day]` are one-off
// grants ("once"), `mine[day]` are recurring rates ("daily").
type LawEntry = { resID: string; amount: number };
export type BusLaws = { resource: LawEntry[][]; mine: LawEntry[][] };

// Full calendar grid: 7 months × 4 weeks × 7 days.
export const TOTAL_DAYS = 7 * 4 * 7;

// Fills in the missing keys so a `cost`/`produces` becomes a full record.
const toRecord = (partial: Partial<ResourceRecord>): ResourceRecord => ({
  ...ZERO_RESOURCES,
  ...partial,
});

/**
 * Walks the whole calendar once, recording a per-day snapshot of available
 * resources, income rate and negativity. Single source of truth for both the
 * resource bar (current day) and the day/week/month overspend flags (every
 * day). Every recurring producer pays out the day after it appears (build
 * today → income tomorrow): built buildings (`cost` then `produces`), the
 * chosen output of a built id11/id21 (castle mines), tile mines, a castle's
 * free pre-builds (from its found day) and "daily" laws. One-off gains land the
 * same day: dropped resource piles and "once" laws.
 */
export const buildTimeline = ({
  iniRes,
  history,
  castles,
  castleMines,
  mines,
  resources,
  busLaws,
}: TimelineInput): DaySnapshot[] => {
  const days: DaySnapshot[] = new Array(TOTAL_DAYS);

  // pre-build income each castle starts emitting on its found day
  const preIncomeByFoundDay = new Map<number, ResourceRecord>();

  for (const castle of Object.values(castles)) {
    if (!castle) continue;

    const produce = castle.preBuilds.reduce(
      (acc, id) =>
        addResources(acc, toRecord(castle.buildings[id]?.produces ?? {})),
      ZERO_RESOURCES,
    );

    preIncomeByFoundDay.set(
      castle.foundDay,
      addResources(
        preIncomeByFoundDay.get(castle.foundDay) ?? ZERO_RESOURCES,
        produce,
      ),
    );
  }

  let available: ResourceRecord = iniRes;
  let incomePerDay: ResourceRecord = ZERO_RESOURCES;

  for (let day = 0; day < TOTAL_DAYS; day++) {
    // law income from the micro remote: resource -> once, mine -> daily
    const law = {
      once: sumLawEntries(busLaws?.resource?.[day] ?? []),
      daily: sumLawEntries(busLaws?.mine?.[day] ?? []),
    };

    // income produced by everything that appeared on earlier days
    available = addResources(available, incomePerDay);

    // one-time gains land the same day: resource piles and "once" laws
    available = addResources(
      available,
      calcResourceGain(resources?.[day] ?? []),
    );
    available = addResources(available, law.once);

    // pre-builds found today start producing from the next day
    const preIncome = preIncomeByFoundDay.get(day);
    if (preIncome) incomePerDay = addResources(incomePerDay, preIncome);

    for (const [castleUUID, timeline] of Object.entries(history)) {
      const buildingID = timeline?.built?.[day];
      if (!buildingID) continue;

      const building = castles[castleUUID]?.buildings?.[buildingID];
      if (!building) continue;

      // pay the build cost on the day it's built
      available = subtractResources(available, toRecord(building.cost));

      // building output + the dwelling's chosen mine start the next day
      incomePerDay = addResources(incomePerDay, toRecord(building.produces));
      incomePerDay = addResources(
        incomePerDay,
        calcCastleMineIncome(
          castleMines?.[castleUUID]?.[buildingID as "id11" | "id21"],
        ),
      );
    }

    // tile mines and "daily" laws placed today start producing from the next day
    incomePerDay = addResources(
      incomePerDay,
      calcMineIncome(mines?.[day] ?? []),
    );
    incomePerDay = addResources(incomePerDay, law.daily);

    days[day] = {
      available,
      incomePerDay,
      isNegative: RESOURCE_KEYS.some((key) => available[key] < 0),
    };
  }

  return days;
};

// Single-slot memo so the bar and all calendar cells share one computation;
// the stores are singletons, so identical input refs ⇒ a cache hit for everyone.
let cache: { keys: unknown[]; value: Timeline } | null = null;

export const selectTimeline = (
  state: State,
  mines: Mine[][],
  resources: ResourceKey[][],
  busLaws: BusLaws,
): Timeline => {
  const keys = [
    state.iniRes,
    state.history,
    state.castles,
    state.castleMines,
    mines,
    resources,
    busLaws,
  ];

  if (cache && keys.every((key, i) => key === cache?.keys[i])) {
    return cache.value;
  }

  const days = buildTimeline({
    iniRes: state.iniRes,
    history: state.history,
    castles: state.castles,
    castleMines: state.castleMines,
    mines,
    resources,
    busLaws,
  });
  const value: Timeline = {
    days,
    negativeByDay: days.map((d) => d.isNegative),
  };

  cache = { keys, value };

  return value;
};

export type Timeline = {
  days: DaySnapshot[];
  negativeByDay: boolean[];
};

export type DaySnapshot = {
  /** resources available on that day */
  available: ResourceRecord;
  /** per-day income rate as of that day */
  incomePerDay: ResourceRecord;
  /** whether any resource is negative on that day */
  isNegative: boolean;
};

type State = ReturnType<typeof useHistoryStore.getState>;
type TimelineInput = Pick<
  State,
  "iniRes" | "history" | "castles" | "castleMines"
> & {
  mines: Mine[][];
  resources: ResourceKey[][];
  // Optional so callers/tests that don't use the micro remote still work.
  busLaws?: BusLaws;
};
