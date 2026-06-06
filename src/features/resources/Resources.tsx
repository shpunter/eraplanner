import type { ResourceKey } from "#/shared/types";
import { useHistoryStore } from "../history/history.store";
import Resource from "./resource/Resource";
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
  const addResources = useHistoryStore((state) => state.addResources);

  const onClick = (resource: ResourceKey) => () => {
    addResources(resource);
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
