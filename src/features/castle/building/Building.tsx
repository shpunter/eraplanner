import type { CastleID, TBuilding } from "#/routes/castle/$id";
import { classnames } from "#/shared/classnames";
import css from "./building.module.css";
import { trace } from "./utils";
import { useHistoryStore } from "#/features/history/history.store";
import { useBuildingStatus } from "./useBuildingStatus";
import BuildingActions from "./buildingActions/BuildingActions";
import BuildingLabel from "./buildingLabel/BuildingLabel";
import { useMarkedStore } from "../useMarked.store";

const Building = ({ building, castleID }: BuildingProps) => {
  const setMarked = useMarkedStore((state) => state.setMarked);
  const addBuilding = useHistoryStore((state) => state.addBuilding);

  const { isBuiltByCurDay, isBuiltThisDay, isInTheHistory, isAvailable } =
    useBuildingStatus(building.id);

  const isMarked = useMarkedStore((state) => {
    return state.marked.includes(building.id);
  });

  const isMarkedAny = useMarkedStore((state) => {
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
        alt={building.name}
        className={css.image}
      />
      <BuildingActions
        castleID={castleID}
        buildingID={building.id}
        isAvailable={isAvailable && !isBuiltThisDay && !isBuiltByCurDay}
      />
      <BuildingLabel
        name={building.name}
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
