import { classnames } from "#/shared/classnames";
import { useHistoryStore } from "../history.store";
import css from "../styles.module.css";

const Month = ({ month, castleUUID }: MonthProps) => {
  const setMonth = useHistoryStore((state) => state.setMonth);
  const currMonth = useHistoryStore((state) => state.currMonth);

  const hasAction = useHistoryStore((state) => {
    const idxInHistoryStart = month * 4 * 7;

    return state.history[castleUUID]
      ?.slice(idxInHistoryStart, idxInHistoryStart + 4 * 7)
      .some((el) => !!el);
  });

  const onMonthClick = (currMonth: number) => () => {
    setMonth(currMonth);
  };

  const classNames = classnames({
    [css.cell]: true,
    [css.active]: currMonth === month,
    [css.action]: hasAction,
  });

  return (
    <div key={month} className={classNames} onClick={onMonthClick(month)}>
      {month + 1}
    </div>
  );
};

export default Month;

type MonthProps = {
  month: number;
  castleUUID: string;
};
