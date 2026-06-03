import { useHistoryStore } from "#/features/history/history.store";
import css from "../buildingActions.module.css";

const CastleMine = ({ value, buildingID }: CastleMineProps) => {
  const addCastleMines = useHistoryStore((state) => state.addCastleMines);

  const onClick = (res: "gold" | "law" | "astrology") => () => {
    addCastleMines(buildingID, res, value);
  };

  return (
    <div className={css.resources}>
      <button type="button" onClick={onClick("gold")}>
        gold
      </button>
      <button type="button" onClick={onClick("law")}>
        law
      </button>
      <button type="button" onClick={onClick("astrology")}>
        astrology
      </button>
    </div>
  );
};

export default CastleMine;

type CastleMineProps = {
  value: number;
  buildingID: "id11" | "id21";
};
