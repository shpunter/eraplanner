import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useHistoryStore } from "../history/history.store";
import type { BuildingID } from "#/routes/castle/$id";

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
      return { ...initResources };
    }

    let gold = initResources.gold;
    let wood = initResources.wood;
    let ore = initResources.ore;
    let crystals = initResources.crystals;
    let gems = initResources.gems;
    let mercury = initResources.mercury;

    const preIncome = (activeCastleConfig.preBuilds ?? []).reduce(
      (acc, buildingID) => {
        const goldProduction =
          activeCastleConfig.buildings[buildingID]?.produces?.gold ?? 0;
        return acc + goldProduction;
      },
      0,
    );

    let incomeGold = preIncome;
    let incomeCrystals = 0;
    let incomeWood = 0;
    let incomeOre = 0;
    let incomeGems = 0;
    let incomeMercury = 0;

    for (let idx = 0; idx <= historyIDX; idx++) {
      let dailySpentGold = 0;
      let dailySpentWood = 0;
      let dailySpentOre = 0;
      let dailySpentCrystals = 0;
      let dailySpentGems = 0;
      let dailySpentMercury = 0;
      let goldFromCastle = incomeGold;
      let woodFromCastle = incomeWood;
      let oreFromCastle = incomeOre;
      let gemsFromCastle = incomeGems;
      let mercuryFromCastle = incomeMercury;
      let crystalFromCastle = incomeCrystals;

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

        goldFromCastle += produces.gold ?? 0;
        crystalFromCastle += produces.crystals ?? 0;
      }

      const goldFromMines = (hMines?.[idx] ?? []).filter((mine) => mine === "gold").length * 1000;
      const woodFromMines = (hMines?.[idx] ?? []).filter((mine) => mine === "wood").length;
      const oreFromMines = (hMines?.[idx] ?? []).filter((mine) => mine === "ore").length;
      const crystalFromMines = (hMines?.[idx] ?? []).filter((mine) => mine === "crystal").length;
      const gemsFromMines = (hMines?.[idx] ?? []).filter((mine) => mine === "gem").length;
      const mercuryFromMines = (hMines?.[idx] ?? []).filter((mine) => mine === "mercury").length;


      gold = gold - dailySpentGold + incomeGold;
      wood = wood - dailySpentWood + incomeWood;
      ore = ore - dailySpentOre + incomeOre;
      crystals = crystals - dailySpentCrystals + incomeCrystals;
      gems = gems - dailySpentGems + incomeGems;
      mercury = mercury - dailySpentMercury + incomeMercury;

      incomeGold = goldFromCastle + goldFromMines;
      incomeWood = woodFromCastle + woodFromMines;
      incomeOre = oreFromCastle + oreFromMines;
      incomeCrystals = crystalFromCastle + crystalFromMines;
      incomeGems = gemsFromCastle +gemsFromMines;
      incomeMercury = mercuryFromCastle + mercuryFromMines;

    }

    return {
      gold: gold - preIncome,
      wood,
      ore,
      crystals,
      gems,
      mercury,
    };
  }, [initResources, currCastleUUID, historyState, castlesConfig, historyIDX, hMines]);

  return (
    <div>
      <div>gold: {resourceTimelineResult.gold}</div>
      <div>wood: {resourceTimelineResult.wood}</div>
      <div>ore: {resourceTimelineResult.ore}</div>
      <div>crystals: {resourceTimelineResult.crystals}</div>
      <div>gems: {resourceTimelineResult.gems}</div>
      <div>mercury: {resourceTimelineResult.mercury}</div>
    </div>
  );
};

export default Resources;
