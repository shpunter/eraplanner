import type { ResourceKey, ResourceRecord } from "#/shared/types";
import { RESOURCE_KEYS } from "#/shared/constants";
import type { Mine, useHistoryStore } from "../history/history.store";
import {
  addResources,
  calcMineIncome,
  calcResourceGain,
  sumLawEntries,
  ZERO_RESOURCES,
} from "./resources.utils";

// Per-day bus income: `resource[day]` = one-off grants, `mine[day]` = recurring daily rate.
type LawEntry = { resID: string; amount: number };
export type BusLaws = { resource: LawEntry[][]; mine: LawEntry[][] };

// Full calendar grid: 7 months × 4 weeks × 7 days.
export const TOTAL_DAYS = 7 * 4 * 7;

/**
 * Walks the whole calendar once, recording a per-day snapshot of available
 * resources, income rate and negativity. Single source of truth for both the
 * resource bar (current day) and the day/week/month overspend flags.
 *
 * Castle building costs and income come pre-computed from the castles remote
 * via `busCastles` (`resource[day]` = costs as negatives, `mine[0]` = daily
 * income). Law grants arrive the same way via `busLaws`.
 */
export const buildTimeline = ({
  iniRes,
  mines,
  resources,
  busLaws,
  busCastles,
}: TimelineInput): DaySnapshot[] => {
  const days: DaySnapshot[] = new Array(TOTAL_DAYS);

  let available: ResourceRecord = iniRes;
  let incomePerDay: ResourceRecord = { ...ZERO_RESOURCES };

  for (let day = 0; day < TOTAL_DAYS; day++) {
    const law = {
      once: sumLawEntries(busLaws?.resource?.[day] ?? []),
      daily: sumLawEntries(busLaws?.mine?.[day] ?? []),
    };
    const castles = {
      once: sumLawEntries(busCastles?.resource?.[day] ?? []),
      daily: sumLawEntries(busCastles?.mine?.[day] ?? []),
    };

    // apply all recurring income from previous days
    available = addResources(available, incomePerDay);

    // one-time gains: resource piles, law grants, castle building costs (pre-negated by remote)
    available = addResources(available, calcResourceGain(resources?.[day] ?? []));
    available = addResources(available, law.once);
    available = addResources(available, castles.once);

    // recurring producers that start from the next day: tile mines, law daily, castle daily income
    incomePerDay = addResources(incomePerDay, calcMineIncome(mines?.[day] ?? []));
    incomePerDay = addResources(incomePerDay, law.daily);
    incomePerDay = addResources(incomePerDay, castles.daily);

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
  busCastles: BusLaws,
): Timeline => {
  const keys = [state.iniRes, mines, resources, busLaws, busCastles];

  if (cache && keys.every((key, i) => key === cache?.keys[i])) {
    return cache.value;
  }

  const days = buildTimeline({ iniRes: state.iniRes, mines, resources, busLaws, busCastles });
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
type TimelineInput = {
  iniRes: State["iniRes"];
  mines: Mine[][];
  resources: ResourceKey[][];
  busLaws?: BusLaws;
  busCastles?: BusLaws;
};
