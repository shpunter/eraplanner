import { state$ as castlesState$ } from "#/shared/castlesBus";
import { state$ as lawState$ } from "#/shared/lawBus";
import { state$ as minesState$ } from "#/shared/minesBus";
import { state$ as resourcesState$ } from "#/shared/resourcesBus";
import { useObservable } from "#/shared/useObservable";

const hasAny = <T>(history: T[][], start: number, len: number): boolean =>
  history
    .slice(start, start + len)
    .some((d) => Array.isArray(d) && d.length > 0);

export const useChangesInRange = (start: number, len: number) => {
  const castlesState = useObservable(castlesState$, castlesState$.getValue());
  const minesState = useObservable(minesState$, minesState$.getValue());
  const resourcesState = useObservable(
    resourcesState$,
    resourcesState$.getValue(),
  );
  const lawState = useObservable(lawState$, lawState$.getValue());

  return {
    castles: hasAny(castlesState.up.history, start, len),
    mines: hasAny(minesState.up.history, start, len),
    resources: hasAny(resourcesState.up.history, start, len),
    law: hasAny(lawState.up.history, start, len),
    hydrated:
      castlesState.up.hydrated &&
      minesState.up.hydrated &&
      resourcesState.up.hydrated &&
      lawState.up.hydrated,
  };
};

export type Changes = ReturnType<typeof useChangesInRange>;
