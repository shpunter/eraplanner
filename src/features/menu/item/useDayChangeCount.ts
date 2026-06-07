import { useHistoryStore } from "#/features/history/history.store";
import { useLawsStore } from "#/features/laws/laws.store";
import { useMinesStore } from "#/features/mines/mines.store";
import { useResourcesStore } from "#/features/resources/resources.store";
import type { MenuTab } from "#/routes/faction/$id";

// Number of changes made on the currently selected day for a given menu tab,
// shown as the tab's badge. Each feature owns its own per-day history store.
export const useDayChangeCount = (id: MenuTab): number => {
  const historyIDX = useHistoryStore((state) => state.historyIDX);

  const minesCount = useMinesStore(
    (state) => state.history[historyIDX]?.length ?? 0,
  );
  const resourcesCount = useResourcesStore(
    (state) => state.history[historyIDX]?.length ?? 0,
  );
  const lawsCount = useLawsStore(
    (state) => state.history[historyIDX]?.length ?? 0,
  );

  // buildings constructed on the selected day across all castles
  const castlesCount = useHistoryStore(
    (state) =>
      Object.values(state.history).filter((entry) => entry?.built?.[historyIDX])
        .length,
  );

  if (id === "mines") return minesCount;
  if (id === "resources") return resourcesCount;
  if (id === "laws") return lawsCount;
  if (id === "castles") return castlesCount;

  return 0;
};
