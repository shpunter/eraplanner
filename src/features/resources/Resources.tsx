import { useMemo } from "react";
import { useHistoryStore } from "../history/history.store";
import type { BuildingID } from "#/routes/castle/$id";

const Resources = () => {
  const initGold = useHistoryStore((state) => state.resources.gold);
  const initWood = useHistoryStore((state) => state.resources.wood);
  const initOre = useHistoryStore((state) => state.resources.ore);

  const currDay = useHistoryStore((state) => state.currDay);
  const currWeek = useHistoryStore((state) => state.currWeek);
  const currMonth = useHistoryStore((state) => state.currMonth);

  const currCastle = useHistoryStore(
    (state) => state.castles[state.currCastleUUID],
  );
  const historyState = useHistoryStore((state) => state.history);

  const resourceTimelineResult = useMemo(() => {
    if (!currCastle) return { gold: initGold, wood: initWood, ore: initOre };

    const fullHistoryPeriod = currMonth * 7 * 4 + currWeek * 7 + currDay;
    const historyAll = Object.values(historyState ?? []);

    let gold = initGold;
    let wood = initWood;
    let ore = initOre;
    let idx = 0;

    const preIncome = currCastle?.preBuilds.reduce((acc, buildingID) => {
      return acc + currCastle.buildings[buildingID].produces.gold;
    }, 0);

    let income = preIncome;

    while (idx <= fullHistoryPeriod) {
      const spentPerDay = historyAll.reduce(
        (acc, history) => {
          const buildingID = history?.[idx] as BuildingID;

          if (!buildingID) return acc;

          return {
            spentGold: acc.spentGold + currCastle.buildings[buildingID].cost.gold,
            spentWood: acc.spentWood + currCastle.buildings[buildingID].cost.wood,
            spentOre: acc.spentOre + currCastle.buildings[buildingID].cost.ore,
            income: acc.income + currCastle.buildings[buildingID].produces.gold,
          };
        },
        { spentGold: 0, spentWood: 0, spentOre: 0, income },
      );

      gold = gold - spentPerDay.spentGold + income;
      wood = wood - spentPerDay.spentWood;
      ore = ore - spentPerDay.spentOre;
      income = spentPerDay.income;

      idx += 1;
    }

    return { gold: gold - preIncome, wood, ore };
  }, [
    initGold,
    initOre,
    initWood,
    currDay,
    currWeek,
    currMonth,
    historyState,
    currCastle,
  ]);

  return (
    <div>
      <div>gold: {resourceTimelineResult.gold}</div>
      <div>wood: {resourceTimelineResult.wood}</div>
      <div>ore: {resourceTimelineResult.ore}</div>
    </div>
  );
};

export default Resources;
