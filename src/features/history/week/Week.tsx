import { classnames } from "#/shared/classnames";
import { useNegativeTimeline } from "#/features/resourceBar/useNegativeTimeline";
import { useHistoryStore, type CurrWeek } from "../history.store";
import { useChangesInRange } from "../useChangesInRange";
import ArcRings from "../ArcRings";
import css from "../history.module.css";

const Week = ({ week }: WeekProps) => {
  const setWeek = useHistoryStore((state) => state.setWeek);
  const isActive = useHistoryStore((state) => state.currWeek === week);
  const weekStart = useHistoryStore(
    (state) => state.currMonth * 4 * 7 + week * 7,
  );

  const changes = useChangesInRange(weekStart, 7);

  const negativeByDay = useNegativeTimeline();
  const hasNegative = negativeByDay
    .slice(weekStart, weekStart + 7)
    .some(Boolean);

  const classNames = classnames({
    [css.cell]: true,
    [css.active]: isActive,
    [css.negative]: hasNegative,
  });

  const onWeekClick = (currWeek: CurrWeek) => () => {
    setWeek(currWeek);
  };

  return (
    <div
      key={week}
      className={classNames}
      onClick={onWeekClick(week)}
      data-testid="week"
      data-week={week}
      data-active={isActive}
      data-action={changes.castles}
      data-negative={hasNegative}
    >
      W{week + 1}
      <ArcRings changes={changes} id={`w${week}`} />
    </div>
  );
};

export default Week;

type WeekProps = {
  week: CurrWeek;
};
