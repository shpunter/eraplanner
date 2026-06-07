import { useHistoryStore } from "#/features/history/history.store";
import { RESOURCE_GAIN_RANGES } from "#/features/resourceBar/resources.utils";
import type { ResourceKey } from "#/shared/types";
import css from "./resource.module.css";

const RESOURCE_IMAGES = {
  gold: "/img/resource/gold.webp",
  wood: "/img/resource/wood.webp",
  ore: "/img/resource/ore.webp",
  crystals: "/img/resource/crystal.webp",
  gems: "/img/resource/gems.webp",
  mercury: "/img/resource/mercury.webp",
  dust: "/img/resource/dust.webp",
} satisfies Partial<Record<ResourceKey, string>>;

const Resource = ({ type, onClick }: ResourceProps) => {
  const count = useHistoryStore((state) => {
    const list = state.resources[state.historyIDX] ?? [];
    let total = 0;

    for (let i = 0; i < list.length; i++) {
      if (list[i] === type) {
        total++;
      }
    }

    return total;
  });

  return (
    <div onClick={onClick} className={css.container}>
      <img
        alt={type}
        src={RESOURCE_IMAGES[type]}
        draggable={false}
        className={css.image}
      />
      {count > 0 && (
        <div className={css.text}>
          <div>{`+${count}`}</div>
          <div>
            {`+(${count * RESOURCE_GAIN_RANGES[type].min}-${count * RESOURCE_GAIN_RANGES[type].max})`}
          </div>
        </div>
      )}
    </div>
  );
};

export default Resource;

type ResourceProps = {
  type: ResourceType;
  onClick: () => void;
};

export type ResourceType = keyof typeof RESOURCE_IMAGES;
