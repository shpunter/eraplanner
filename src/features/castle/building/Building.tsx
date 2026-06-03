import type { CastleID, TBuilding } from "#/routes/castle/$id";
import { classnames } from "#/shared/classnames";
import css from "./building.module.css";
import { trace } from "./utils";
import { useHistoryStore } from "#/features/history/history.store";
import BuildingActions from "./buildingActions/BuildingActions";
import BuildingLabel from "./buildingLabel/BuildingLabel";

const Building = ({ building, castleID }: BuildingProps) => {
  const { name } = building;

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

  const isMarkedAny = useHistoryStore((state) => {
    return state.marked.length > 0;
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
    [css.builtThisDay]: isBuiltThisDay,
    [css.item]: true,
    [css.notMarked]: isMarkedAny && !isMarked,
    [css.disabled]:
      !isAvailable && !isMarked && !isBuiltThisDay && !isBuiltByCurDay,
  });

  return (
    <div
      className={classNames}
      id={building.id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <img
        src={`/img/factions/buildings/${castleID}/${building.id}.webp`}
        alt={name}
        className={css.image}
      />
      <BuildingActions
        castleID={castleID}
        buildingID={building.id}
        isAvailable={isAvailable && !isBuiltThisDay && !isBuiltByCurDay}
      />
      {/* {"gold" in cost ? <p>gold: {cost.gold}</p> : null}
      {"ore" in cost ? <p>ore: {cost.ore}</p> : null}
      {"wood" in cost ? <p>wood: {cost.wood}</p> : null}
      {"gems" in cost ? <p>gems: {cost.gems}</p> : null}
      {"crystals" in cost ? <p>crystals: {cost.crystals}</p> : null}
      {"mercury" in cost ? <p>mercury: {cost.mercury}</p> : null}
      {"dust" in cost ? <p>dust: {cost.dust}</p> : null} */}
      {/* ------
      {"gold" in building.produces ? (
        <p>gold: {building.produces.gold}</p>
      ) : null}
      {"mercury" in building.produces ? (
        <p>mercury: {building.produces.mercury}</p>
      ) : null}
      {"crystals" in building.produces ? (
        <p>crystals: {building.produces.crystals}</p>
      ) : null}
      {"dust" in building.produces ? (
        <p>dust: {building.produces.dust}</p>
      ) : null}
      {"law" in building.produces ? <p>law: {building.produces.law}</p> : null}
      {"astrology" in building.produces ? (
        <p>astrology: {building.produces.astrology}</p>
      ) : null} */}
      <BuildingLabel
        name={name}
        isMarked={isMarked}
        isBuilt={isBuiltByCurDay || isBuiltThisDay}
        isAvailable={isAvailable}
        isBuiltThisDay={isBuiltThisDay}
      />
    </div>
  );
};

export default Building;

type BuildingProps = {
  building: { uuid: string } & TBuilding;
  castleID: CastleID;
};
