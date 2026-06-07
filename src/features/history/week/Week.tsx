import { classnames } from "#/shared/classnames";
import { useNegativeTimeline } from "#/features/resourceBar/useNegativeTimeline";
import { useHistoryStore, type CurrWeek } from "../history.store";
import css from "../history.module.css";

const Week = ({ week }: WeekProps) => {
  const setWeek = useHistoryStore((state) => state.setWeek);
  const isActive = useHistoryStore((state) => state.currWeek === week);

  const hasAction = useHistoryStore((state) => {
    const idxInHistoryStart = state.currMonth * 4 * 7 + week * 7;
    const { history, currCastleUUID } = state;

    return (history?.[currCastleUUID]?.built ?? [])
      .slice(idxInHistoryStart, idxInHistoryStart + 7)
      .some((el) => !!el);
  });

  const negativeByDay = useNegativeTimeline();
  const weekStart = useHistoryStore(
    (state) => state.currMonth * 4 * 7 + week * 7,
  );
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
