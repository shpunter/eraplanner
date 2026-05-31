import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useHistoryStore } from "../history/history.store";
import {
  addResources,
  calcMineIncome,
  subtractResources,
  ZERO_RESOURCES,
} from "./resources.utils";
import type { ResourceRecord } from "#/shared/types";

export function useResourceTimeline(): {
  available: ResourceRecord;
  incomePerDay: ResourceRecord;
} {
  const initResources = useHistoryStore(useShallow((state) => state.resources));
  const historyIDX = useHistoryStore((state) => state.historyIDX);
  const hMines = useHistoryStore((state) => state.mines);
  const currCastleUUID = useHistoryStore((state) => state.currCastleUUID);
  const castlesConfig = useHistoryStore(useShallow((state) => state.castles));
  const historyState = useHistoryStore(useShallow((state) => state.history));

  return useMemo(() => {
    const activeCastleConfig = castlesConfig[currCastleUUID];

    if (!activeCastleConfig) {
      return { available: initResources, incomePerDay: ZERO_RESOURCES };
    }

    const preIncome = Object.values(castlesConfig).reduce<ResourceRecord>(
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

    for (let idx = 0; idx <= historyIDX; idx++) {
      let dailyCost = ZERO_RESOURCES;
      let dailyProduces = ZERO_RESOURCES;

      if (!historyState) continue;

      for (const [castleUUID, timelineArray] of Object.entries(historyState)) {
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
    }

    return {
      available: subtractResources(available, preIncome),
      incomePerDay,
    };
  }, [
    initResources,
    currCastleUUID,
    historyState,
    castlesConfig,
    historyIDX,
    hMines,
  ]);
}
