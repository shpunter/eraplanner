import { classnames } from "#/shared/classnames";
import { useHistoryStore, type CurrWeek } from "../history.store";
import css from "../styles.module.css";

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

  const isDisabled = useHistoryStore((state) => {
    const idxInHistoryEnd = state.currMonth * 4 * 7 + week * 7 + 6;
    const { history, currCastleUUID } = state;

    return !!history?.[currCastleUUID]?.disabled?.[idxInHistoryEnd];
  });

  const classNames = classnames({
    [css.cell]: true,
    [css.active]: isActive,
    [css.action]: hasAction,
    [css.disabled]: isDisabled,
  });

  const onWeekClick = (currWeek: CurrWeek) => () => {
    if (isDisabled) return;

    setWeek(currWeek);
  };

  return (
    <div key={week} className={classNames} onClick={onWeekClick(week)}>
      {week + 1}
    </div>
  );
};

export default Week;

type WeekProps = {
  week: CurrWeek;
};
