import Day from "./day/Day";
import type { CurrDay, CurrWeek } from "./history.store";
import Month from "./month/Month";
import css from "./styles.module.css";
import Week from "./week/Week";

const History = ({ castleUUID }: HistoryProps) => {
  return (
    <div className={css.calendar}>
      <div>
        {Array.from({ length: 6 }).map((_, idx) => {
          const month = idx;

          return <Month key={month} month={month} castleUUID={castleUUID} />;
        })}
      </div>
      <div>
        {Array.from({ length: 4 }).map((_, idx) => {
          const week = idx as CurrWeek;

          return <Week key={week} week={week} castleUUID={castleUUID} />;
        })}
      </div>

      <div>
        {Array.from({ length: 7 }).map((_, idx) => {
          const day = idx as CurrDay;

          return <Day key={day} day={day} castleUUID={castleUUID} />;
        })}
      </div>
    </div>
  );
};

export default History;

type HistoryProps = {
  castleUUID: string;
};
