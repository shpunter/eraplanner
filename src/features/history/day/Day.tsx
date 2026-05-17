import { classnames } from "#/shared/classnames";
import { useHistoryStore, type CurrDay } from "../history.store";
import css from "../styles.module.css";

const Day = ({ day, castleUUID }: DayProps) => {
  const setDay = useHistoryStore((state) => state.setDay);
  const currDay = useHistoryStore((state) => state.currDay);

  const hasAction = useHistoryStore((state) => {
    const idxInHistory = state.currMonth * 4 * 7+ state.currWeek * 7 + day;

    return !!state.history[castleUUID]?.[idxInHistory];
  });

  const onDayClick = (currDay: CurrDay) => () => {
    setDay(currDay);
  };

  const classNames = classnames({
    [css.cell]: true,
    [css.action]: hasAction,
    [css.active]: currDay === day,
  });

  return (
    <div key={day} onClick={onDayClick(day)} className={classNames}>
      {day + 1}
    </div>
  );
};

export default Day;

type DayProps = {
  castleUUID: string;
  day: CurrDay;
};
