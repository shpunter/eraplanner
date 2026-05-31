import { classnames } from "#/shared/classnames";
import { useHistoryStore } from "../history.store";
import css from "../history.module.css";

const Month = ({ month }: MonthProps) => {
  const setMonth = useHistoryStore((state) => state.setMonth);
  const isActive = useHistoryStore((state) => state.currMonth === month);

  const hasAction = useHistoryStore((state) => {
    const { history, currCastleUUID } = state;
    const idxInHistoryStart = month * 4 * 7;

    return (history[currCastleUUID]?.built ?? [])
      .slice(idxInHistoryStart, idxInHistoryStart + 4 * 7)
      .some((el) => !!el);
  });

  const isDisabled = useHistoryStore((state) => {
    const { history, currCastleUUID } = state;
    const idxInHistoryEnd = month * 4 * 7 + (4 * 7 - 1);

    return !!history[currCastleUUID]?.disabled?.[idxInHistoryEnd];
  });

  const onMonthClick = (currMonth: number) => () => {
    if (isDisabled) return;

    setMonth(currMonth);
  };

  const classNames = classnames({
    [css.cell]: true,
    [css.active]: isActive,
    [css.action]: hasAction,
    [css.disabled]: isDisabled,
  });

  return (
    <div key={month} className={classNames} onClick={onMonthClick(month)}>
      M{month + 1}
    </div>
  );
};

export default Month;

type MonthProps = {
  month: number;
};
