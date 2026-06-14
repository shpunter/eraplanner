import { useHistoryStore } from "#/features/history/history.store";
import type { MenuTab } from "#/routes/faction/$id";
import { state$ as lawState$ } from "#/shared/lawBus";
import { state$ as minesState$ } from "#/shared/minesBus";
import { state$ as resourcesState$ } from "#/shared/resourcesBus";
import { useObservable } from "#/shared/useObservable";

export const useDayChangeCount = (id: MenuTab): number => {
  const historyIDX = useHistoryStore((state) => state.historyIDX);

  const minesCount =
    useObservable(minesState$, minesState$.getValue()).up.history[historyIDX]
      ?.length ?? 0;
  const resourcesCount =
    useObservable(resourcesState$, resourcesState$.getValue()).up.history[historyIDX]
      ?.length ?? 0;

  // buildings constructed on the selected day across all castles
  const castlesCount = useHistoryStore(
    (state) =>
      Object.values(state.history).filter((entry) => entry?.built?.[historyIDX])
        .length,
  );

  // law changes on the selected day, published by the law remote over the bus
  const { up } = useObservable(lawState$, lawState$.getValue());
  const lawCount = up.history[historyIDX]?.length ?? 0;

  if (id === "mines") return minesCount;
  if (id === "resources") return resourcesCount;
  if (id === "castles") return castlesCount;
  if (id === "law") return lawCount;

  return 0;
};
