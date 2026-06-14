import { state$ as lawState$ } from "#/shared/lawBus";
import { state$ as minesState$ } from "#/shared/minesBus";
import { state$ as resourcesState$ } from "#/shared/resourcesBus";
import { useObservable } from "#/shared/useObservable";
import { useHistoryStore } from "../history/history.store";
import { selectTimeline } from "./timeline.utils";

/**
 * For every day in the calendar, whether the available resources would be
 * negative on that day. Reads the same shared timeline as {@link useResources}
 * (computed once, see {@link buildTimeline}), so the day/week/month cells stay
 * consistent with the resource bar and don't each recompute the grid.
 */
export const useNegativeTimeline = (): boolean[] => {
  const mines = useObservable(minesState$, minesState$.getValue()).up.history;
  const resources = useObservable(resourcesState$, resourcesState$.getValue()).up.history;
  const busLaws = useObservable(lawState$, lawState$.getValue()).up;

  return useHistoryStore(
    (state) => selectTimeline(state, mines, resources, busLaws).negativeByDay,
  );
};
