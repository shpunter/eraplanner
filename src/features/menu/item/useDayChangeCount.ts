import { useHistoryStore } from "#/features/history/history.store";
import { useLawsStore } from "#/features/laws/laws.store";
import type { MenuTab } from "#/routes/faction/$id";

// Number of changes made on the currently selected day for a given menu tab,
// shown as the tab's badge.
export const useDayChangeCount = (id: MenuTab): number => {
  const historyIDX = useHistoryStore((state) => state.historyIDX);

  // laws live in their own store
  const lawsCount = useLawsStore(
    (state) => state.history[historyIDX]?.length ?? 0,
  );

  const count = useHistoryStore((state) => {
    if (id === "mines") {
      return state.mines[historyIDX]?.length ?? 0;
    }

    if (id === "resources") {
      return state.resources[historyIDX]?.length ?? 0;
    }

    if (id === "castles") {
      // buildings constructed on the selected day across all castles
      return Object.values(state.history).filter(
        (entry) => entry?.built?.[historyIDX],
      ).length;
    }

    return 0;
  });

  return id === "laws" ? lawsCount : count;
};
