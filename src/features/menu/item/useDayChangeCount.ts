import { useHistoryStore } from "#/features/history/history.store";
import type { MenuTab } from "#/routes/faction/$id";
import { state$ as castlesState$ } from "#/shared/castlesBus";
import { state$ as lawState$ } from "#/shared/lawBus";
import { state$ as minesState$ } from "#/shared/minesBus";
import { state$ as resourcesState$ } from "#/shared/resourcesBus";
import { useObservable } from "#/shared/useObservable";

export const useDayChangeCount = (
  id: MenuTab,
): { count: number; hydrated: boolean } => {
  const historyIDX = useHistoryStore((state) => state.historyIDX);
  const historyHydrated = useHistoryStore((state) => state.hydrated);

  const minesState = useObservable(minesState$, minesState$.getValue());
  const resourcesState = useObservable(
    resourcesState$,
    resourcesState$.getValue(),
  );
  const castlesState = useObservable(castlesState$, castlesState$.getValue());
  const lawState = useObservable(lawState$, lawState$.getValue());

  const minesCount = minesState.up.history[historyIDX]?.length ?? 0;
  const resourcesCount = resourcesState.up.history[historyIDX]?.length ?? 0;
  const castlesCount = castlesState.up.history[historyIDX]?.length ?? 0;
  const lawCount = lawState.up.history[historyIDX]?.length ?? 0;

  if (id === "mines")
    return {
      count: minesCount,
      hydrated: historyHydrated && minesState.up.hydrated,
    };
  if (id === "resources")
    return {
      count: resourcesCount,
      hydrated: historyHydrated && resourcesState.up.hydrated,
    };
  if (id === "castles")
    return {
      count: castlesCount,
      hydrated: historyHydrated && castlesState.up.hydrated,
    };
  if (id === "law")
    return {
      count: lawCount,
      hydrated: historyHydrated && lawState.up.hydrated,
    };

  return { count: 0, hydrated: true };
};
