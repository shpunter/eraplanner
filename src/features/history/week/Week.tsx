import { classnames } from "#/shared/classnames";
import { useHistoryStore, type CurrWeek } from "../history.store";
import css from "../styles.module.css";

const Week = ({ week, castleUUID }: WeekProps) => {
  const setWeek = useHistoryStore((state) => state.setWeek);
  const currWeek = useHistoryStore((state) => state.currWeek);

  const hasAction = useHistoryStore((state) => {
    const idxInHistoryStart = state.currMonth * 4 * 7 + week * 7;

    return state.history[castleUUID]
      ?.slice(idxInHistoryStart, idxInHistoryStart + 7)
      .some((el) => !!el);
  });

  const classNames = classnames({
    [css.cell]: true,
    [css.active]: currWeek === week,
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
  castleUUID: string;
  week: CurrWeek;
};
