import { useHistoryStore } from "#/features/history/history.store";
import type { Mine as TMine } from "#/features/history/history.store";
import { useMinesStore } from "../mines.store";
import css from "./mine.module.css";

const MINE_ASSET_PATHS: Record<TMine, string> = {
  gold: "/img/mines/gold_mine.webp",
  wood: "/img/mines/wood_mine.webp",
  ore: "/img/mines/ore_mine.webp",
  gem: "/img/mines/gem_mine.webp",
  crystals: "/img/mines/crystal_mine.webp",
  mercury: "/img/mines/mercury_mine.webp",
};

const MULTIPLIER_MAP = {
  gold: 1000,
  ore: 2,
  wood: 2,
  crystals: 1,
  gem: 1,
  mercury: 1,
} as const;

const Mine = ({ type, onClick }: { type: TMine; onClick: () => void }) => {
  const historyIDX = useHistoryStore((state) => state.historyIDX);
  const currentMines = useMinesStore((state) => {
    const currentMinesList = state.history[historyIDX] ?? [];
    let mineCount = 0;

    for (let i = 0; i < currentMinesList.length; i++) {
      if (currentMinesList[i] === type) {
        mineCount++;
      }
    }

    return mineCount * MULTIPLIER_MAP[type];
  });

  return (
    <div
      onClick={onClick}
      className={css.container}
      data-testid={`mine-${type}`}
    >
      <img
        alt={type}
        src={MINE_ASSET_PATHS[type]}
        draggable={false}
        className={css.image}
      />
      <div className={css.text}>
        {type}: {currentMines > 0 ? `+${currentMines}` : 0}
      </div>
    </div>
  );
};

export default Mine;
