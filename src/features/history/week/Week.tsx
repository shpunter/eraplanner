import { classnames } from "#/shared/classnames";
import { useNegativeTimeline } from "#/features/resourceBar/useNegativeTimeline";
import { useHistoryStore, type CurrWeek } from "../history.store";
import { useChangesInRange } from "../useChangesInRange";
import ArcRings from "../ArcRings";
import css from "../history.module.css";

const Week = ({ week }: WeekProps) => {
  const setWeek = useHistoryStore((state) => state.setWeek);
  const isActive = useHistoryStore((state) => state.currWeek === week);
  const storeHydrated = useHistoryStore((state) => state.hydrated);
  const weekStart = useHistoryStore(
    (state) => state.currMonth * 4 * 7 + week * 7,
  );

  const changes = useChangesInRange(weekStart, 7);
  const isLoading = !storeHydrated || !changes.hydrated;

  const negativeByDay = useNegativeTimeline();
  const hasNegative = negativeByDay
    .slice(weekStart, weekStart + 7)
    .some(Boolean);

  const classNames = classnames({
    [css.cell]: true,
    [css.active]: isActive && !isLoading,
    [css.negative]: hasNegative && !isLoading,
    [css.skeleton]: isLoading,
  });

  const onWeekClick = (currWeek: CurrWeek) => () => {
    setWeek(currWeek);
  };

  return (
    <div
      key={week}
      className={classNames}
      onClick={isLoading ? undefined : onWeekClick(week)}
      data-testid="week"
      data-week={week}
      data-active={isActive}
      data-action={changes.castles}
      data-negative={hasNegative}
    >
      {!isLoading && `W${week + 1}`}
      <ArcRings changes={changes} id={`w${week}`} spin={isLoading} />
    </div>
  );
};

export default Week;

type WeekProps = {
  week: CurrWeek;
};
