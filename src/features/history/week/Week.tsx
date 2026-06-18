import { classnames } from "#/shared/classnames";
import { useNegativeTimeline } from "#/features/resourceBar/useNegativeTimeline";
import { state$ as castlesState$ } from "#/shared/castlesBus";
import { useObservable } from "#/shared/useObservable";
import { useHistoryStore, type CurrWeek } from "../history.store";
import css from "../history.module.css";

const Week = ({ week }: WeekProps) => {
  const setWeek = useHistoryStore((state) => state.setWeek);
  const isActive = useHistoryStore((state) => state.currWeek === week);
  const weekStart = useHistoryStore(
    (state) => state.currMonth * 4 * 7 + week * 7,
  );

  const castlesHistory = useObservable(castlesState$, castlesState$.getValue()).up.history;
  const hasAction = castlesHistory.slice(weekStart, weekStart + 7).some((d) => d.length > 0);

  const negativeByDay = useNegativeTimeline();
  const hasNegative = negativeByDay
    .slice(weekStart, weekStart + 7)
    .some(Boolean);

  const classNames = classnames({
    [css.cell]: true,
    [css.active]: isActive,
    [css.action]: hasAction,
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
      data-action={hasAction}
      data-negative={hasNegative}
    >
      W{week + 1}
    </div>
  );
};

export default Week;

type WeekProps = {
  week: CurrWeek;
};
