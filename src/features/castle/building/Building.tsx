import type { TBuilding } from "#/routes/castle/$id";
import { classnames } from "#/shared/classnames";
import css from "./styles.module.css";
import { useParams } from "@tanstack/react-router";
import { trace } from "./utils";
import { useHistoryStore } from "#/features/history/history.store";

const Building = ({ building }: BuildingProps) => {
  const { id: castleID } = useParams({ from: "/castle/$id" });
  const { cost } = building;

  const setMarked = useHistoryStore((state) => state.setMarked);
  const addBuilding = useHistoryStore((state) => state.addBuilding);

  const isBuiltByCurDay = useHistoryStore((state) => {
    const { history, currCastleUUID, castles, historyIDX } = state;
    const currBuiltHistory = history?.[currCastleUUID]?.built ?? [];

    const isInHistory = [
      ...(castles?.[currCastleUUID]?.preBuilds ?? []),
      ...currBuiltHistory.slice(0, historyIDX + 1),
    ].includes(building.id);

    return isInHistory;
  });

  const isInTheHistory = useHistoryStore((state) => {
    const { history, currCastleUUID, historyIDX } = state;
    const currBuiltHistory = history?.[currCastleUUID]?.built ?? [];

    return currBuiltHistory.slice(historyIDX).includes(building.id);
  });

  const isBuiltThisDay = useHistoryStore((state) => {
    const { history, currCastleUUID, historyIDX } = state;
    const currBuiltHistory = history?.[currCastleUUID]?.built ?? [];

    return currBuiltHistory[historyIDX] === building.id;
  });

  const isAvailable = useHistoryStore((state) => {
    const { castles, history, currCastleUUID, historyIDX } = state;
    const currBuiltHistory = history?.[currCastleUUID]?.built ?? [];
    const prev = castles[currCastleUUID]?.buildings?.[building.id]?.prev ?? [];
    const isActionAvailableThisDay = !currBuiltHistory[historyIDX];
    const isConstructionDisabled =
      !!history?.[currCastleUUID]?.disabled?.[historyIDX];

    return (
      !isConstructionDisabled &&
      isActionAvailableThisDay &&
      prev.every((prevBuildingID) => {
        return [
          ...(castles?.[currCastleUUID]?.preBuilds ?? []),
          ...currBuiltHistory.slice(0, historyIDX + 1),
        ].includes(prevBuildingID);
      })
    );
  });

  const isMarked = useHistoryStore((state) => {
    return state.marked.includes(building.id);
  });

  const onMouseEnter = () => {
    const buildingIDs = trace(castleID, building.id, "prev");

    setMarked(buildingIDs);
  };

  const onMouseLeave = () => {
    setMarked([]);
  };

  const onClick = () => {
    if (!isAvailable || isBuiltByCurDay) return;

    addBuilding(building.id);
  };

  const classNames = classnames({
    [css.builtInTheFuture]:
      !isBuiltThisDay && !isBuiltByCurDay && isInTheHistory,
    [css.unavailable]: !isAvailable,
    [css.built]: isBuiltByCurDay,
    [css.marked]: isMarked,
    [css.available]: isAvailable,
    [css.action]: isBuiltThisDay,
    [css.item]: true,
  });

  return (
    <div
      className={classNames}
      id={building.id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <p>{building.name}</p>
      {"gold" in cost ? <p>gold: {cost.gold}</p> : null}
      {"ore" in cost ? <p>ore: {cost.ore}</p> : null}
      {"wood" in cost ? <p>wood: {cost.wood}</p> : null}
      {"gems" in cost ? <p>gems: {cost.gems}</p> : null}
      {"crystals" in cost ? <p>crystals: {cost.crystals}</p> : null}
      {"mercury" in cost ? <p>mercury: {cost.mercury}</p> : null}
      {"dust" in cost ? <p>dust: {cost.dust}</p> : null}
      ------
      {"gold" in building.produces ? (
        <p>gold: {building.produces.gold}</p>
      ) : null}
      {"mercury" in building.produces ? (
        <p>mercury: {building.produces.mercury}</p>
      ) : null}
      {"dust" in building.produces ? (
        <p>dust: {building.produces.dust}</p>
      ) : null}
    </div>
  );
};

export default Building;

type BuildingProps = {
  building: { uuid: string } & TBuilding;
};
