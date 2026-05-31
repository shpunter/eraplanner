import { useResourceTimeline } from "./useResourceTimeline";
import css from "./styles.module.css";
import { RESOURCE_KEYS } from "#/shared/constants";

type ResourceKey = (typeof RESOURCE_KEYS)[number];

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

const Resources = () => {
  const { available, incomePerDay } = useResourceTimeline();

  return (
    <div className={css.bar}>
      {RESOURCE_KEYS.map((key) => {
        const icon = RESOURCE_ICONS[key];

        return (
          <div key={key} className={css.item}>
            <img className={css.icon} src={icon} alt={key} />
            <div className={css.resource}>
              <div className={css.available}>{available[key]}</div>
              <div className={css.income}>+{incomePerDay[key]}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Resources;
