import { useHistoryStore } from "#/features/history/history.store";
import type { BuildingID, CastleID } from "#/routes/castle/$id";
import { trace } from "../utils";
import css from "./styles.module.css";

const BuildingActions = ({ castleID, buildingID }: BuildingActionsProps) => {
  const removeBuildings = useHistoryStore((state) => state.removeBuildings);

  const isBuilt = useHistoryStore((state) => {
    const currBuiltHistory = state.history?.[state.currCastleUUID]?.built ?? [];

    return currBuiltHistory.includes(buildingID);
  });

  const onRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    removeBuildings(trace(castleID, buildingID, "next"));
  };

  if (!isBuilt) return null;

  return (
    <button type="button" className={css.remove} onClick={onRemove}>
      ×
    </button>
  );
};

export default BuildingActions;

type BuildingActionsProps = {
  castleID: CastleID;
  buildingID: BuildingID;
};
