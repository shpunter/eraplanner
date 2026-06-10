import { useHistoryStore } from "#/features/history/history.store";
import { useMinesStore } from "#/features/mines/mines.store";
import { useResourcesStore } from "#/features/resources/resources.store";
import type { MenuTab } from "#/routes/faction/$id";
import { state$ } from "#/shared/microBus";
import { useObservable } from "#/shared/useObservable";

export const useDayChangeCount = (id: MenuTab): number => {
  const historyIDX = useHistoryStore((state) => state.historyIDX);

  const minesCount = useMinesStore(
    (state) => state.history[historyIDX]?.length ?? 0,
  );
  const resourcesCount = useResourcesStore(
    (state) => state.history[historyIDX]?.length ?? 0,
  );

  // buildings constructed on the selected day across all castles
  const castlesCount = useHistoryStore(
    (state) =>
      Object.values(state.history).filter((entry) => entry?.built?.[historyIDX])
        .length,
  );

  // law changes on the selected day, published by the micro remote over the bus
  const { laws } = useObservable(state$, state$.getValue());
  const microCount = laws.history[historyIDX]?.length ?? 0;

  if (id === "mines") return minesCount;
  if (id === "resources") return resourcesCount;
  if (id === "castles") return castlesCount;
  if (id === "micro") return microCount;

  return 0;
};
