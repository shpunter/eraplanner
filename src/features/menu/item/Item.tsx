import { useHistoryStore } from "#/features/history/history.store";
import type { MenuTab } from "#/routes/faction/$id";
import css from "./item.module.css";

const Item = ({ label, id }: ItemProps) => {
  const count = useHistoryStore((state) => {
    const { historyIDX } = state;

    if (id === "mines") {
      return state.mines[historyIDX]?.length ?? 0;
    }

    if (id === "resources") {
      return state.resources[historyIDX]?.length ?? 0;
    }

    if (id === "laws") {
      return  0;
    }


    // castles: buildings constructed on the selected day across all castles
    return Object.values(state.history).filter(
      (entry) => entry?.built?.[historyIDX],
    ).length;
  });

  return (
    <div className={css.item}>
      <span>{label}</span>
      {count > 0 && <div className={css.badge}>{count}</div>}
    </div>
  );
};

export default Item;

type ItemProps = {
  label: string;
  id: MenuTab;
};
