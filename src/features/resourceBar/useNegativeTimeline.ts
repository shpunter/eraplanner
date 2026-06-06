import { useHistoryStore } from "../history/history.store";
import { selectTimeline } from "./timeline.utils";

/**
 * For every day in the calendar, whether the available resources would be
 * negative on that day. Reads the same shared timeline as {@link useResources}
 * (computed once, see {@link buildTimeline}), so the day/week/month cells stay
 * consistent with the resource bar and don't each recompute the grid.
 */
export const useNegativeTimeline = (): boolean[] => {
  return useHistoryStore((state) => selectTimeline(state).negativeByDay);
};
