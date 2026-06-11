import { state$ } from "#/shared/lawBus";
import type { ResourceRecord } from "#/shared/types";
import { useObservable } from "#/shared/useObservable";
import { useHistoryStore } from "../history/history.store";
import { useMinesStore } from "../mines/mines.store";
import { useResourcesStore } from "../resources/resources.store";
import { selectTimeline, TOTAL_DAYS } from "./timeline.utils";

/**
 * Resources available and per-day income on the currently selected day
 * (`historyIDX`). Reads the shared timeline (see {@link buildTimeline}), so
 * navigating days is an index lookup, not a recompute.
 */
export const useResources = (): {
  available: ResourceRecord;
  incomePerDay: ResourceRecord;
} => {
  const mines = useMinesStore((state) => state.history);
  const resources = useResourcesStore((state) => state.history);
  const busLaws = useObservable(state$, state$.getValue()).laws;

  const days = useHistoryStore(
    (state) => selectTimeline(state, mines, resources, busLaws).days,
  );
  const historyIDX = useHistoryStore((state) => state.historyIDX);

  const { available, incomePerDay } =
    days[Math.min(historyIDX, TOTAL_DAYS - 1)];

  return { available, incomePerDay };
};
