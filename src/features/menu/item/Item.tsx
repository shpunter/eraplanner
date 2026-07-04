import type { MenuTab } from "#/routes/faction/$id";
import { TAB_COLORS } from "#/shared/tabColors";
import css from "./item.module.css";
import { useDayChangeCount } from "./useDayChangeCount";

const Item = ({ label, id }: ItemProps) => {
  const { count, hydrated } = useDayChangeCount(id);

  return (
    <div className={css.item} data-testid={`tab-${id}`}>
      <div className={css.labelWrapper}>
        <div className={css.dot} style={{ background: TAB_COLORS[id] }} />
        <span className={css.label}>{label}</span>
      </div>
      {!hydrated && <div className={css.spinner} />}
      {hydrated && count > 0 && <div className={css.badge}>{count}</div>}
    </div>
  );
};

export default Item;

type ItemProps = {
  label: string;
  id: MenuTab;
};
