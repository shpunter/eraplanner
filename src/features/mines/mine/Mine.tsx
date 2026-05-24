import {
  useHistoryStore,
  type Mine as TMine,
} from "#/features/history/history.store";
import { useMemo } from "react";
import css from "./styles.module.css";

const Mine = ({ type, onClick }: { type: TMine; onClick: () => void }) => {
  const historyIDX = useHistoryStore((state) => state.historyIDX);
  const currentMines = useHistoryStore((state) => state.mines[historyIDX]);

  const count = useMemo(() => {
    return (
      (currentMines ?? []).filter((mine) => mine === type).length *
      (type === "gold" ? 1000 : 1)
    );
  }, [type, currentMines]);

  return (
    <div onClick={onClick} className={css[type]}>
      {type}: {count > 0 ? `+${count}` : 0}{" "}
    </div>
  );
};

export default Mine;
