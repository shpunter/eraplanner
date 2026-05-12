import type { TBuilding } from "#/routes/castle/$id";
import { classnames } from "#/shared/classnames";
import { useCastleStore } from "../castle.store";
import css from "./styles.module.css";
import { useParams } from "@tanstack/react-router";
import { trace } from "./utils";

const Building = ({ building, castleUUID }: BuildingProps) => {
  const { id: castleID } = useParams({ from: "/castle/$id" });
  const { gold, ore, wood, gems, crystals, mercury } = building.cost;

  const setMarked = useCastleStore((state) => state.setMarked);
  const setBuilt = useCastleStore((state) => state.setBuilt);

  const isBuilt = useCastleStore((state) => {
    return state.castles[castleUUID]?.[building.id].isBuilt ?? false;
  });

  const isAvailable = useCastleStore((state) => {
    const prev = state.castles[castleUUID]?.[building.id].prev ?? [];

    return prev.every((prevBuildingID) => {
      return state.castles[castleUUID][prevBuildingID].isBuilt;
    });
  });

  const isMarked = useCastleStore((state) => {
    return state.castles[castleUUID]?.[building.id].isMarked;
  });

  const onMouseEnter = () => {
    const buildingIDs = trace(castleID, building.id, "prev");

    buildingIDs.forEach((buildingID) => {
      setMarked(castleUUID, buildingID, true);
    });
  };

  const onMouseLeave = () => {
    const buildingIDs = trace(castleID, building.id, "prev");

    buildingIDs.forEach((buildingID) => {
      setMarked(castleUUID, buildingID, false);
    });
  };

  const onClick = () => {
    if (!isAvailable) return;

    if (isAvailable) {
      setBuilt(castleUUID, building.id, true);
    }

    if (isBuilt) {
      const destroyIDs = trace(castleID, building.id, "next");

      console.log(destroyIDs);

      destroyIDs.forEach((id) => {
        setBuilt(castleUUID, id, false);
      });
    }
  };

  const classNames = classnames({
    [css.unavailable]: !isMarked && !isAvailable,
    [css.built]: !isMarked && isBuilt,
    [css.marked]: isMarked,
    [css.available]: !isMarked && isAvailable,
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
