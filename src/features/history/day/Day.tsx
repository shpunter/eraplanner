import { classnames } from "#/shared/classnames";
import { useNegativeTimeline } from "#/features/resourceBar/useNegativeTimeline";
import { state$ as castlesState$ } from "#/shared/castlesBus";
import { useObservable } from "#/shared/useObservable";
import { useHistoryStore, type CurrDay } from "../history.store";
import css from "../history.module.css";

const Day = ({ day }: DayProps) => {
  const setDay = useHistoryStore((state) => state.setDay);
  const isActive = useHistoryStore((state) => state.currDay === day);
  const idxInHistory = useHistoryStore(
    (state) => state.currMonth * 4 * 7 + state.currWeek * 7 + day,
  );

  const castlesHistory = useObservable(castlesState$, castlesState$.getValue())
    .up.history;
  const hasAction = (castlesHistory[idxInHistory]?.length ?? 0) > 0;

  const negativeByDay = useNegativeTimeline();
  const isNegative = negativeByDay[idxInHistory] ?? false;

  const onDayClick = (currDay: CurrDay) => () => {
    setDay(currDay);
  };

  const classNames = classnames({
    [css.cell]: true,
    [css.action]: hasAction,
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
      data-action={hasAction}
      data-negative={isNegative}
    >
      D{day + 1}
    </div>
  );
};

export default Day;

type DayProps = {
  day: CurrDay;
};
