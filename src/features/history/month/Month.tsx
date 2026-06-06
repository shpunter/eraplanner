import { classnames } from "#/shared/classnames";
import { useNegativeTimeline } from "#/features/resourceBar/useNegativeTimeline";
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

  const negativeByDay = useNegativeTimeline();
  const monthStart = month * 4 * 7;
  const hasNegative = negativeByDay
    .slice(monthStart, monthStart + 4 * 7)
    .some(Boolean);

  const onMonthClick = (currMonth: number) => () => {
    setMonth(currMonth);
  };

  const classNames = classnames({
    [css.cell]: true,
    [css.active]: isActive,
    [css.action]: hasAction,
    [css.negative]: hasNegative,
  });

  return (
    <div
      key={month}
      className={classNames}
      onClick={onMonthClick(month)}
      data-testid="month"
      data-month={month}
      data-active={isActive}
      data-action={hasAction}
      data-negative={hasNegative}
    >
      M{month + 1}
    </div>
  );
};

export default Month;

type MonthProps = {
  month: number;
};
