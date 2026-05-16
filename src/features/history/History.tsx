import { classnames } from "#/shared/classnames";
import { useHistoryStore, type CurrDay, type CurrWeek } from "./history.store";
import css from "./styles.module.css";

const History = () => {
  const setDay = useHistoryStore((state) => state.setDay);
  const setWeek = useHistoryStore((state) => state.setWeek);
  const currDay = useHistoryStore((state) => state.currDay);
  const currWeek = useHistoryStore((state) => state.currWeek);

  const onDayClick = (currDay: CurrDay) => () => {
    setDay(currDay);
  };

  const onWeekClick = (currWeek: CurrWeek) => () => {
    setWeek(currWeek);
  };

  return (
    <div className={css.calendar}>
      <div>
        {[1, 2, 3, 4].map((num) => {
          const week = num as CurrWeek;

          const classNames = classnames({
            [css.cell]: true,
            [css.active]: currWeek === week,
          });

          return (
            <div key={week} className={classNames} onClick={onWeekClick(week)}>
              {week}
            </div>
          );
        })}
      </div>

      <div>
        {Array.from({ length: 8 }).map((_, idx) => {
          const classNames = classnames({
            [css.cell]: true,
            [css.active]: currDay === idx,
          });

          const day = (idx - ((idx / 7) >> 1)) as CurrDay;

          return (
            <div key={day} onClick={onDayClick(day)} className={classNames}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
