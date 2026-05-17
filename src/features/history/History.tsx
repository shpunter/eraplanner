import { classnames } from "#/shared/classnames";
import { useHistoryStore, type CurrDay, type CurrWeek } from "./history.store";
import css from "./styles.module.css";

const History = () => {
  const setDay = useHistoryStore((state) => state.setDay);
  const setWeek = useHistoryStore((state) => state.setWeek);
  const setMonth = useHistoryStore((state) => state.setMonth);
  const currDay = useHistoryStore((state) => state.currDay);
  const currWeek = useHistoryStore((state) => state.currWeek);
  const currMonth = useHistoryStore((state) => state.currMonth);
  const history = useHistoryStore((state) => state.history);

  const onDayClick = (currDay: CurrDay) => () => {
    setDay(currDay);
  };

  const onWeekClick = (currWeek: CurrWeek) => () => {
    setWeek(currWeek);
  };

  const onMonthClick = (currMonth: number) => () => {
    setMonth(currMonth);
  };

  return (
    <div className={css.calendar}>
      <div>
        {Array.from({ length: 6 }).map((_, idx) => {
          const month = idx;

          const classNames = classnames({
            [css.cell]: true,
            [css.active]: currMonth === month,
          });

          return (
            <div
              key={month}
              className={classNames}
              onClick={onMonthClick(month)}
            >
              {month + 1}
            </div>
          );
        })}
      </div>
      <div>
        {Array.from({ length: 4 }).map((_, idx) => {
          const week = idx as CurrWeek;

          const classNames = classnames({
            [css.cell]: true,
            [css.active]: currWeek === week,
          });

          return (
            <div key={week} className={classNames} onClick={onWeekClick(week)}>
              {week + 1}
            </div>
          );
        })}
      </div>

      <div>
        {Array.from({ length: 7 }).map((_, idx) => {
          const idxInHistory = currMonth * 4 + currWeek * 7 + idx;
          const day = idx as CurrDay;

          const classNames = classnames({
            [css.cell]: true,
            [css.action]: !!history[idxInHistory],
            [css.active]: currDay === idx,
          });

          return (
            <div key={day} onClick={onDayClick(day)} className={classNames}>
              {day + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
