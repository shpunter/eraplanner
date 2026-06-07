import type { MenuTab } from "#/routes/faction/$id";
import css from "./item.module.css";
import { useDayChangeCount } from "./useDayChangeCount";

const Item = ({ label, id }: ItemProps) => {
  const count = useDayChangeCount(id);

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
