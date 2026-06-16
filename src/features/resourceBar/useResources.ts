import { state$ as lawState$ } from "#/shared/lawBus";
import { state$ as minesState$ } from "#/shared/minesBus";
import { state$ as resourcesState$ } from "#/shared/resourcesBus";
import { state$ as castlesState$ } from "#/shared/castlesBus";
import type { ResourceRecord } from "#/shared/types";
import { useObservable } from "#/shared/useObservable";
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
  const mines = useObservable(minesState$, minesState$.getValue()).up.history;
  const resources = useObservable(resourcesState$, resourcesState$.getValue()).up.history;
  const busLaws = useObservable(lawState$, lawState$.getValue()).up;
  const busCastles = useObservable(castlesState$, castlesState$.getValue()).up;

  const days = useHistoryStore(
    (state) => selectTimeline(state, mines, resources, busLaws, busCastles).days,
  );
  const historyIDX = useHistoryStore((state) => state.historyIDX);

  const { available, incomePerDay } =
    days[Math.min(historyIDX, TOTAL_DAYS - 1)];

  return { available, incomePerDay };
};
