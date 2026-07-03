import { useHistoryStore } from "../../history/history.store";
import { classnames } from "#/shared/classnames";
import css from "./difficulty.module.css";

const difficulties = ["♟", "♞", "♝", "♜", "♛", "♚"];

const Difficulty = () => {
  const difficulty = useHistoryStore((state) => state.difficulty);
  const setDifficulty = useHistoryStore((state) => state.setDifficulty);

  return (
    <div className={css.difficulties}>
      {difficulties.map((label, idx) => {
        const onClick = () => setDifficulty(idx as 0 | 1 | 2 | 3 | 4 | 5);
        const classNames = classnames({
          [css.difficulty]: true,
          [css.active]: difficulty === idx,
        });

        return (
          <div key={label} onClick={onClick} className={classNames}>
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default Difficulty;
