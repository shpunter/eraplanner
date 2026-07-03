import { useHistoryStore } from "../../history/history.store";
import Popover from "#/components/popover/Popover";
import css from "./difficulty.module.css";
import { classnames } from "#/shared/classnames";

const difficulties = ["♟", "♞", "♝", "♜", "♛", "♚"] as const;

const Difficulty = () => {
  const difficulty = useHistoryStore((state) => state.difficulty);
  const setDifficulty = useHistoryStore((state) => state.setDifficulty);

  return (
    <Popover>
      <Popover.Trigger className={css.difficulty}>
        {difficulties[difficulty]}
      </Popover.Trigger>

      <Popover.Content>
        {({ close }) => (
          <div className={css.list}>
            {difficulties.map((label, idx) => {
              const className = classnames({
                [css.option]: true,
                [css.active]: difficulty === idx,
              });

              const onClick = () => {
                setDifficulty(idx as 0 | 1 | 2 | 3 | 4 | 5);
                close();
              };

              return (
                <div key={label} className={className} onClick={onClick}>
                  {label}
                </div>
              );
            })}
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};

export default Difficulty;
