import { state$ } from "#/shared/lawBus";
import { useObservable } from "#/shared/useObservable";
import { useHistoryStore } from "../history/history.store";
import { useMinesStore } from "../mines/mines.store";
import { useResourcesStore } from "../resources/resources.store";
import { selectTimeline } from "./timeline.utils";

/**
 * For every day in the calendar, whether the available resources would be
 * negative on that day. Reads the same shared timeline as {@link useResources}
 * (computed once, see {@link buildTimeline}), so the day/week/month cells stay
 * consistent with the resource bar and don't each recompute the grid.
 */
export const useNegativeTimeline = (): boolean[] => {
  const mines = useMinesStore((state) => state.history);
  const resources = useResourcesStore((state) => state.history);
  const busLaws = useObservable(state$, state$.getValue()).laws;

  return useHistoryStore(
    (state) => selectTimeline(state, mines, resources, busLaws).negativeByDay,
  );
};
