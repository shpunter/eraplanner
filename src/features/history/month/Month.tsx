import { classnames } from "#/shared/classnames";
import { useNegativeTimeline } from "#/features/resourceBar/useNegativeTimeline";
import { useHistoryStore } from "../history.store";
import { useChangesInRange } from "../useChangesInRange";
import ArcRings from "../ArcRings";
import css from "../history.module.css";

const Month = ({ month }: MonthProps) => {
  const setMonth = useHistoryStore((state) => state.setMonth);
  const isActive = useHistoryStore((state) => state.currMonth === month);

  const monthStart = month * 4 * 7;
  const changes = useChangesInRange(monthStart, 28);

  const negativeByDay = useNegativeTimeline();
  const hasNegative = negativeByDay
    .slice(monthStart, monthStart + 28)
    .some(Boolean);

  const onMonthClick = (currMonth: number) => () => {
    setMonth(currMonth);
  };

  const classNames = classnames({
    [css.cell]: true,
    [css.active]: isActive,
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
      data-action={changes.castles}
      data-negative={hasNegative}
    >
      M{month + 1}
      <ArcRings changes={changes} id={`m${month}`} />
    </div>
  );
};

export default Month;

type MonthProps = {
  month: number;
};
