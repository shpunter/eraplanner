import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { RESOURCE_KEYS } from "#/shared/constants";
import { useHistoryStore } from "../history/history.store";
import {
  addResources,
  calcMineIncome,
  subtractResources,
  ZERO_RESOURCES,
} from "./resources.utils";

// Full calendar grid: 7 months × 4 weeks × 7 days.
const TOTAL_DAYS = 7 * 4 * 7;

/**
 * For every day in the calendar, whether the available resources would be
 * negative on that day. Mirrors the accumulation in {@link useResourceTimeline}
 * but records a snapshot per day instead of only at the selected one, so the
 * day/week/month cells can flag overspending without selecting each day.
 */
export function useNegativeTimeline(): boolean[] {
  const initResources = useHistoryStore(useShallow((state) => state.resources));
  const hMines = useHistoryStore((state) => state.mines);
  const castlesConfig = useHistoryStore(useShallow((state) => state.castles));
  const historyState = useHistoryStore(useShallow((state) => state.history));

  return useMemo(() => {
    const negativeByDay = Array.from<boolean>({ length: TOTAL_DAYS }).fill(
      false,
    );

    const preIncome = Object.values(castlesConfig).reduce<typeof ZERO_RESOURCES>(
      (total, castleConfig) => {
        if (!castleConfig) return total;

        return (castleConfig.preBuilds ?? []).reduce((acc, buildingID) => {
          const produces = castleConfig.buildings[buildingID]?.produces;

          return addResources(acc, {
            ...ZERO_RESOURCES,
            gold: produces?.gold ?? 0,
            law: produces?.law ?? 0,
            astrology: produces?.astrology ?? 0,
          });
        }, total);
      },
      ZERO_RESOURCES,
    );

    let available = initResources;
    let incomePerDay = { ...ZERO_RESOURCES, ...preIncome };

    for (let idx = 0; idx < TOTAL_DAYS; idx++) {
      let dailyCost = ZERO_RESOURCES;
      let dailyProduces = ZERO_RESOURCES;

      for (const [castleUUID, timelineArray] of Object.entries(
        historyState ?? {},
      )) {
        const buildingID = timelineArray?.built?.[idx];
        if (!buildingID) continue;

        const building = castlesConfig?.[castleUUID]?.buildings?.[buildingID];
        if (!building) continue;

        dailyCost = addResources(dailyCost, {
          gold: building.cost.gold ?? 0,
          wood: building.cost.wood ?? 0,
          ore: building.cost.ore ?? 0,
          crystals: building.cost.crystals ?? 0,
          gems: building.cost.gems ?? 0,
          mercury: building.cost.mercury ?? 0,
          law: 0,
          astrology: 0,
          dust: building.cost.dust ?? 0,
        });

        dailyProduces = addResources(dailyProduces, {
          ...ZERO_RESOURCES,
          gold: building.produces.gold ?? 0,
          crystals: building.produces.crystals ?? 0,
          gems: building.produces.gems ?? 0,
          mercury: building.produces.mercury ?? 0,
          law: building.produces.law ?? 0,
          astrology: building.produces.astrology ?? 0,
        });
      }

      // Apply the income earned so far (excluding buildings built today),
      // then deduct today's build costs.
      available = addResources(
        subtractResources(available, dailyCost),
        incomePerDay,
      );

      // Buildings built today and mines start producing from the next day.
      incomePerDay = addResources(incomePerDay, dailyProduces);
      incomePerDay = addResources(
        incomePerDay,
        calcMineIncome(hMines?.[idx] ?? []),
      );

      // Match the displayed "available" for this day (see useResourceTimeline).
      const snapshot = subtractResources(available, preIncome);
      negativeByDay[idx] = RESOURCE_KEYS.some((key) => snapshot[key] < 0);
    }

    return negativeByDay;
  }, [initResources, historyState, castlesConfig, hMines]);
}
