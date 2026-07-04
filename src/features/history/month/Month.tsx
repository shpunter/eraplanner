import { classnames } from "#/shared/classnames";
import { useNegativeTimeline } from "#/features/resourceBar/useNegativeTimeline";
import { useHistoryStore } from "../history.store";
import { useChangesInRange } from "../useChangesInRange";
import ArcRings from "../ArcRings";
import css from "../history.module.css";

const Month = ({ month }: MonthProps) => {
  const setMonth = useHistoryStore((state) => state.setMonth);
  const isActive = useHistoryStore((state) => state.currMonth === month);
  const storeHydrated = useHistoryStore((state) => state.hydrated);

  const monthStart = month * 4 * 7;
  const changes = useChangesInRange(monthStart, 28);
  const isLoading = !storeHydrated || !changes.hydrated;

  const negativeByDay = useNegativeTimeline();
  const hasNegative = negativeByDay
    .slice(monthStart, monthStart + 28)
    .some(Boolean);

  const onMonthClick = (currMonth: number) => () => {
    setMonth(currMonth);
  };

  const classNames = classnames({
    [css.cell]: true,
    [css.active]: isActive && !isLoading,
    [css.negative]: hasNegative && !isLoading,
    [css.skeleton]: isLoading,
  });

  return (
    <div
      key={month}
      className={classNames}
      onClick={isLoading ? undefined : onMonthClick(month)}
      data-testid="month"
      data-month={month}
      data-active={isActive}
      data-action={changes.castles}
      data-negative={hasNegative}
    >
      {!isLoading && `M${month + 1}`}
      <ArcRings changes={changes} id={`m${month}`} spin={isLoading} />
    </div>
  );
};

export default Month;

type MonthProps = {
  month: number;
};
