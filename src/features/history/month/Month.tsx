import { classnames } from "#/shared/classnames";
import { useNegativeTimeline } from "#/features/resourceBar/useNegativeTimeline";
import { state$ as castlesState$ } from "#/shared/castlesBus";
import { useObservable } from "#/shared/useObservable";
import { useHistoryStore } from "../history.store";
import css from "../history.module.css";

const Month = ({ month }: MonthProps) => {
  const setMonth = useHistoryStore((state) => state.setMonth);
  const isActive = useHistoryStore((state) => state.currMonth === month);

  const castlesHistory = useObservable(castlesState$, castlesState$.getValue()).up.history;
  const monthStart = month * 4 * 7;
  const hasAction = castlesHistory.slice(monthStart, monthStart + 4 * 7).some((d) => d.length > 0);

  const negativeByDay = useNegativeTimeline();
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
