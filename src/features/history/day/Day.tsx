import { classnames } from "#/shared/classnames";
import { useNegativeTimeline } from "#/features/resourceBar/useNegativeTimeline";
import { useHistoryStore, type CurrDay } from "../history.store";
import { useChangesInRange } from "../useChangesInRange";
import ArcRings from "../ArcRings";
import css from "../history.module.css";

const Day = ({ day }: DayProps) => {
  const setDay = useHistoryStore((state) => state.setDay);
  const isActive = useHistoryStore((state) => state.currDay === day);
  const idxInHistory = useHistoryStore(
    (state) => state.currMonth * 4 * 7 + state.currWeek * 7 + day,
  );

  const changes = useChangesInRange(idxInHistory, 1);

  const negativeByDay = useNegativeTimeline();
  const isNegative = negativeByDay[idxInHistory] ?? false;

  const onDayClick = (currDay: CurrDay) => () => {
    setDay(currDay);
  };

  const classNames = classnames({
    [css.cell]: true,
    [css.active]: isActive,
    [css.negative]: isNegative,
  });

  return (
    <div
      key={day}
      onClick={onDayClick(day)}
      className={classNames}
      data-testid="day"
      data-day={day}
      data-active={isActive}
      data-action={changes.castles}
      data-negative={isNegative}
    >
      D{day + 1}
      <ArcRings changes={changes} id={`d${day}`} />
    </div>
  );
};

export default Day;

type DayProps = {
  day: CurrDay;
};
