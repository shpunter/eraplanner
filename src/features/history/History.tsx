import Day from "./day/Day";
import { useHistoryStore, type CurrDay, type CurrWeek } from "./history.store";
import Month from "./month/Month";
import css from "./history.module.css";
import Week from "./week/Week";

const History = () => {
  const setNextDay = useHistoryStore((state) => state.setNextDay);
  const setPrevDay = useHistoryStore((state) => state.setPrevDay);

  return (
    <div className={css.calendar}>
      <div className={css.row}>
        {Array.from({ length: 7 }).map((_, idx) => {
          const month = idx;

          return <Month key={month} month={month} />;
        })}
      </div>
      <div className={css.row}>
        {Array.from({ length: 4 }).map((_, idx) => {
          const week = idx as CurrWeek;

          return <Week key={week} week={week} />;
        })}
      </div>

      <div className={css.row}>
        {Array.from({ length: 7 }).map((_, idx) => {
          const day = idx as CurrDay;

          return <Day key={day} day={day} />;
        })}

        <div className={css.nav}>
          <div className={css.next} onClick={setPrevDay} data-testid="prev">
            {"<<"}
          </div>
          <div className={css.next} onClick={setNextDay} data-testid="next">
            {">>"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
