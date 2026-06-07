import type { ResourceKey } from "#/shared/types";
import Resource from "./resource/Resource";
import { useResourcesStore } from "./resources.store";
import css from "./resources.module.css";

const RESOURCES = [
  "gold",
  "wood",
  "ore",
  "crystals",
  "gems",
  "mercury",
  "dust",
] as const satisfies readonly ResourceKey[];

const Resources = () => {
  const addResource = useResourcesStore((state) => state.addResource);

  const onClick = (resource: ResourceKey) => () => {
    addResource(resource);
  };

  return (
    <div className={css.resources}>
      {RESOURCES.map((item) => {
        return <Resource key={item} type={item} onClick={onClick(item)} />;
      })}
    </div>
  );
};

export default Resources;
