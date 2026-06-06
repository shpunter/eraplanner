import { useHistoryStore } from "#/features/history/history.store";
import type { ResourceKey } from "#/shared/types";
import css from "./resource.module.css";

const RESOURCES = {
  gold: { img: "/img/resource/gold.webp", min: 400, max: 900 },
  wood: { img: "/img/resource/wood.webp", min: 4, max: 6 },
  ore: { img: "/img/resource/ore.webp", min: 4, max: 6 },
  crystals: { img: "/img/resource/crystal.webp", min: 2, max: 4 },
  gems: { img: "/img/resource/gems.webp", min: 2, max: 4 },
  mercury: { img: "/img/resource/mercury.webp", min: 2, max: 4 },
  dust: { img: "/img/resource/dust.webp", min: 8, max: 12 },
} satisfies Partial<
  Record<ResourceKey, { img: string; min: number; max: number }>
>;

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
        src={RESOURCES[type].img}
        draggable={false}
        className={css.image}
      />
      <div className={css.text}>
        <div>
          {count > 0 ? `+${count}` : 0}
        </div>
        <div>
          {count > 0
            ? `+(${count * RESOURCES[type].min}-${count * RESOURCES[type].max})`
            : 0}
        </div>
      </div>
    </div>
  );
};

export default Resource;

type ResourceProps = {
  type: ResourceType;
  onClick: () => void;
};

export type ResourceType = keyof typeof RESOURCES;
