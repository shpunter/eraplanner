import { useHistoryStore } from "#/features/history/history.store";
import css from "./item.module.css";

const Item = ({ label, id }: ItemProps) => {
  const count = useHistoryStore((state) => {
    const { historyIDX } = state;

    if (id === "mines") {
      return state.mines[historyIDX]?.length ?? 0;
    }

    // castles: buildings constructed on the selected day across all castles
    return Object.values(state.history).filter(
      (entry) => entry?.built?.[historyIDX],
    ).length;
  });

  return (
    <span className={css.item}>
      <span>{label}</span>
      {count > 0 && <span className={css.badge}>{count}</span>}
    </span>
  );
};

export default Item;

type ItemProps = {
  label: string;
  id: "castles" | "mines";
};
