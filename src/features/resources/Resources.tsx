import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useHistoryStore } from "../history/history.store";
import type { BuildingID } from "#/routes/castle/$id";
import css from "./styles.module.css";

const Resources = () => {
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

  const resourceTimelineResult = useMemo(() => {
    const activeCastleConfig = castlesConfig[currCastleUUID];

    if (!activeCastleConfig) {
      return {
        available: initResources,
        incomePerDay: {
          crystals: 0,
          gems: 0,
          gold: 0,
          mercury: 0,
          ore: 0,
          wood: 0,
        },
      };
    }

    let availableResources = {
      gold: initResources.gold,
      wood: initResources.wood,
      ore: initResources.ore,
      crystals: initResources.crystals,
      gems: initResources.gems,
      mercury: initResources.mercury,
    };

    const preIncome = (activeCastleConfig.preBuilds ?? []).reduce(
      (acc, buildingID) => {
        const goldProduction =
          activeCastleConfig.buildings[buildingID]?.produces?.gold ?? 0;
        return acc + goldProduction;
      },
      0,
    );

    let incomePerDay = {
      gold: preIncome,
      wood: 0,
      ore: 0,
      crystals: 0,
      gems: 0,
      mercury: 0,
    };

    for (let idx = 0; idx <= historyIDX; idx++) {
      let dailySpentGold = 0;
      let dailySpentWood = 0;
      let dailySpentOre = 0;
      let dailySpentCrystals = 0;
      let dailySpentGems = 0;
      let dailySpentMercury = 0;

      for (const [castleUUID, timelineArray] of Object.entries(
        historyState ?? {},
      )) {
        const buildingID = timelineArray?.[idx] as BuildingID | undefined;

        if (!buildingID) continue;

        const targetedCastleMetadata = castlesConfig[castleUUID];
        const buildingConfig = targetedCastleMetadata?.buildings?.[buildingID];

        if (!buildingConfig) continue;

        const cost = buildingConfig.cost ?? {};
        const produces = buildingConfig.produces ?? {};

        dailySpentGold += cost.gold ?? 0;
        dailySpentWood += cost.wood ?? 0;
        dailySpentOre += cost.ore ?? 0;
        dailySpentCrystals += cost.crystals ?? 0;
        dailySpentGems += cost.gems ?? 0;
        dailySpentMercury += cost.mercury ?? 0;

        incomePerDay = {
          ...incomePerDay,
          gold: incomePerDay.gold + (produces.gold ?? 0),
          crystals: incomePerDay.crystals + (produces.crystals ?? 0),
        };
      }

      const goldFromMines =
        (hMines?.[idx] ?? []).filter((mine) => mine === "gold").length * 1000;
      const woodFromMines = (hMines?.[idx] ?? []).filter(
        (mine) => mine === "wood",
      ).length * 2;
      const oreFromMines = (hMines?.[idx] ?? []).filter(
        (mine) => mine === "ore",
      ).length * 2;
      const crystalFromMines = (hMines?.[idx] ?? []).filter(
        (mine) => mine === "crystal",
      ).length;
      const gemsFromMines = (hMines?.[idx] ?? []).filter(
        (mine) => mine === "gem",
      ).length;
      const mercuryFromMines = (hMines?.[idx] ?? []).filter(
        (mine) => mine === "mercury",
      ).length;

      availableResources = {
        gold: availableResources.gold - dailySpentGold + incomePerDay.gold,
        wood: availableResources.wood - dailySpentWood + incomePerDay.wood,
        ore: availableResources.ore - dailySpentOre + incomePerDay.ore,
        crystals:
          availableResources.crystals -
          dailySpentCrystals +
          incomePerDay.crystals,
        gems: availableResources.gems - dailySpentGems + incomePerDay.gems,
        mercury:
          availableResources.mercury - dailySpentMercury + incomePerDay.mercury,
      };

      incomePerDay = {
        gold: incomePerDay.gold + goldFromMines,
        wood: incomePerDay.wood + woodFromMines,
        ore: incomePerDay.ore + oreFromMines,
        crystals: incomePerDay.crystals + crystalFromMines,
        gems: incomePerDay.gems + gemsFromMines,
        mercury: incomePerDay.mercury + mercuryFromMines,
      };
    }

    return {
      available: {
        gold: availableResources.gold - preIncome,
        wood: availableResources.wood,
        ore: availableResources.ore,
        crystals: availableResources.crystals,
        gems: availableResources.gems,
        mercury: availableResources.mercury,
      },
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

  return (
    <div className={css.wrapper}>
      {(["gold", "wood", "ore", "crystals", "gems", "mercury"] as const).map(
        (el) => {
          return (
            <div key={el}>
              <div>
                {el}: {resourceTimelineResult.available[el]}
              </div>
              <div>+{resourceTimelineResult.incomePerDay[el]}</div>
            </div>
          );
        },
      )}
    </div>
  );
};

export default Resources;
