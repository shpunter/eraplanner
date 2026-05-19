import { classnames } from "#/shared/classnames";
import { useHistoryStore } from "../history.store";
import css from "../styles.module.css";

const Month = ({ month }: MonthProps) => {
  const setMonth = useHistoryStore((state) => state.setMonth);
  const isActive = useHistoryStore((state) => state.currMonth === month);

  const hasAction = useHistoryStore((state) => {
    const { history, currCastleUUID } = state;
    const idxInHistoryStart = month * 4 * 7;

    return history[currCastleUUID]
      ?.slice(idxInHistoryStart, idxInHistoryStart + 4 * 7)
      .some((el) => !!el);
  });

  const onMonthClick = (currMonth: number) => () => {
    setMonth(currMonth);
  };

  const classNames = classnames({
    [css.cell]: true,
    [css.active]: isActive,
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
};
