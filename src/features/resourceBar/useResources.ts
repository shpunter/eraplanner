import type { ResourceRecord } from "#/shared/types";
import { useHistoryStore } from "../history/history.store";
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
  const days = useHistoryStore((state) => selectTimeline(state).days);
  const historyIDX = useHistoryStore((state) => state.historyIDX);

  const { available, incomePerDay } =
    days[Math.min(historyIDX, TOTAL_DAYS - 1)];

  return { available, incomePerDay };
};
