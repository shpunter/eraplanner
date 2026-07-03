import { useEffect } from "react";
import css from "./resourceBar.module.css";
import { RESOURCE_KEYS } from "#/shared/constants";
import { classnames } from "#/shared/classnames";
import { useResources } from "./useResources";
import { patchDown } from "#/shared/lawBus";
import Difficulty from "./difficulty/Difficulty";

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

const ResourceBar = () => {
  const { available, incomePerDay } = useResources();

  useEffect(() => {
    patchDown({ resLaw: available.law });
  }, [available.law]);

  return (
    <div className={css.bar}>
      <Difficulty />

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
