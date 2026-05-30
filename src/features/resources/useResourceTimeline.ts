import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useHistoryStore } from "../history/history.store";
import {
  addResources,
  calcMineIncome,
  subtractResources,
  ZERO_RESOURCES,
  type ResourceRecord,
} from "./resources.helpers";

export function useResourceTimeline(): {
  available: ResourceRecord;
  incomePerDay: ResourceRecord;
} {
  const initResources = useHistoryStore(
    useShallow((state) => ({
      gold: state.resources.gold,
      wood: state.resources.wood,
      ore: state.resources.ore,
      crystals: state.resources.crystals,
      gems: state.resources.gems,
      mercury: state.resources.mercury,
    })),
  );

  const historyIDX = useHistoryStore((state) => state.historyIDX);
  const hMines = useHistoryStore((state) => state.mines);
  const currCastleUUID = useHistoryStore((state) => state.currCastleUUID);
  const castlesConfig = useHistoryStore(useShallow((state) => state.castles));
  const historyState = useHistoryStore(useShallow((state) => state.history));

  return useMemo(() => {
    const activeCastleConfig = castlesConfig[currCastleUUID];

    if (!activeCastleConfig) {
      return { available: initResources, incomePerDay: { ...ZERO_RESOURCES } };
    }

    const preIncome = Object.values(castlesConfig).reduce(
      (total, castleConfig) => {
        if (!castleConfig) return total;

        return (
          total +
          (castleConfig.preBuilds ?? []).reduce(
            (acc, buildingID) =>
              acc + (castleConfig.buildings[buildingID]?.produces?.gold ?? 0),
            0,
          )
        );
      },
      0,
    );

    let available = initResources;
    let incomePerDay = { ...ZERO_RESOURCES, gold: preIncome };

    for (let idx = 0; idx <= historyIDX; idx++) {
      let dailyCost = ZERO_RESOURCES;

      for (const [castleUUID, timelineArray] of Object.entries(
        historyState ?? {},
      )) {
        if (!timelineArray?.built?.[idx]) continue;

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
        });

        incomePerDay = {
          ...incomePerDay,
          gold: incomePerDay.gold + (building.produces.gold ?? 0),
          crystals: incomePerDay.crystals + (building.produces.crystals ?? 0),
        };
      }

      available = addResources(
        subtractResources(available, dailyCost),
        incomePerDay,
      );

      incomePerDay = addResources(
        incomePerDay,
        calcMineIncome(hMines?.[idx] ?? []),
      );
    }

    return {
      available: { ...available, gold: available.gold - preIncome },
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
