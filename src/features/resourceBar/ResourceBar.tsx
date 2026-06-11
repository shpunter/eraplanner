import { useEffect } from "react";
import css from "./resourceBar.module.css";
import { RESOURCE_KEYS } from "#/shared/constants";
import { classnames } from "#/shared/classnames";
import { useHistoryStore } from "../history/history.store";
import { useResources } from "./useResources";
import { patchState } from "#/shared/lawBus";

const RESOURCE_ICONS: Partial<Record<ResourceKey, string>> = {
  gold: "/img/resource/gold.webp",
  wood: "/img/resource/wood.webp",
  ore: "/img/resource/ore.webp",
  crystals: "/img/resource/crystal.webp",
  gems: "/img/resource/gems.webp",
  mercury: "/img/resource/mercury.webp",
  dust: "/img/resource/dust.webp",
  law: "/img/resource/law.png",
  astrology: "/img/resource/astrology.png",
};

const difficulties = ["♟", "♞", "♝", "♜", "♛", "♚"];

const ResourceBar = () => {
  const setDifficulty = useHistoryStore((state) => state.setDifficulty);
  const difficulty = useHistoryStore((state) => state.difficulty);
  const { available, incomePerDay } = useResources();

  useEffect(() => {
    patchState({ resLaw: available.law });
  }, [available.law]);

  return (
    <div className={css.bar}>
      <div className={css.difficulties}>
        {difficulties.map((currDifficulty, idx) => {
          const onClick = () => setDifficulty(idx as 0 | 1 | 2 | 3 | 4 | 5);

          const className = classnames({
            [css.difficulty]: true,
            [css.active]: difficulty === idx,
          });

          return (
            <div key={currDifficulty} onClick={onClick} className={className}>
              {currDifficulty}
            </div>
          );
        })}
      </div>

      <div className={css.resources}>
        {RESOURCE_KEYS.map((key) => {
          const icon = RESOURCE_ICONS[key];

          const className = classnames({
            [css.available]: true,
            [css.negative]: available[key] < 0,
          });

          return (
            <div key={key} className={css.item}>
              <img className={css.icon} src={icon} alt={key} />
              <div className={css.resource}>
                <div className={className} data-testid={`available-${key}`}>
                  {available[key]}
                </div>
                <div className={css.income} data-testid={`income-${key}`}>
                  +{incomePerDay[key]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceBar;

type ResourceKey = (typeof RESOURCE_KEYS)[number];
