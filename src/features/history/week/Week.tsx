import { classnames } from "#/shared/classnames";
import { useHistoryStore, type CurrWeek } from "../history.store";
import css from "../styles.module.css";

const Week = ({ week }: WeekProps) => {
  const setWeek = useHistoryStore((state) => state.setWeek);
  const isActive = useHistoryStore((state) => state.currWeek === week);

  const hasAction = useHistoryStore((state) => {
    const idxInHistoryStart = state.currMonth * 4 * 7 + week * 7;
    const { history, currCastleUUID } = state;

    return (history?.[currCastleUUID] ?? [])
      .slice(idxInHistoryStart, idxInHistoryStart + 7)
      .some((el) => !!el);
  });

  const classNames = classnames({
    [css.cell]: true,
    [css.active]: isActive,
    [css.action]: hasAction,
  });

  const onWeekClick = (currWeek: CurrWeek) => () => {
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
