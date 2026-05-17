import type { TBuilding } from "#/routes/castle/$id";
import { classnames } from "#/shared/classnames";
import css from "./styles.module.css";
import { useParams } from "@tanstack/react-router";
import { trace } from "./utils";
import { useHistoryStore } from "#/features/history/history.store";

const Building = ({ building, castleUUID }: BuildingProps) => {
  const { id: castleID } = useParams({ from: "/castle/$id" });
  const { gold, ore, wood, gems, crystals, mercury } = building.cost;

  const setMarked = useHistoryStore((state) => state.setMarked);
  const addBuilding = useHistoryStore((state) => state.addBuilding);

  const isBuilt = useHistoryStore((state) => {
    const idx = state.currDay + state.currWeek * 7;

    const isInHistory = state.castles?.[castleUUID]?.preBuilds
      .concat(state.history.slice(0, idx + 1))
      .includes(building.id);

    return isInHistory;
  });

  const isBuiltThisDay = useHistoryStore((state) => {
    const idx = state.currDay + state.currWeek * 7;

    return state.history[idx] === building.id;
  });

  const isAvailable = useHistoryStore((state) => {
    const prev = state.castles[castleUUID]?.buildings[building.id].prev ?? [];
    const idx = state.currDay + state.currWeek * 7;
    const isActionAvailableThisDay = !state.history[idx];

    return (
      isActionAvailableThisDay &&
      prev.every((prevBuildingID) => {
        return state.castles[castleUUID].preBuilds
          .concat(state.history)
          .includes(prevBuildingID);
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
    if (!isAvailable || isBuilt) return;

    addBuilding(building.id);
  };

  const classNames = classnames({
    [css.unavailable]: !isAvailable,
    [css.built]: isBuilt,
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

      {gold ? <p>gold: {gold}</p> : null}
      {ore ? <p>ore: {ore}</p> : null}
      {wood ? <p>wood: {wood}</p> : null}
      {gems ? <p>gems: {gems}</p> : null}
      {crystals ? <p>crystals: {crystals}</p> : null}
      {mercury ? <p>mercury: {mercury}</p> : null}
    </div>
  );
};

export default Building;

type BuildingProps = {
  building: { uuid: string } & TBuilding;
  castleUUID: string;
};
