import type { ResourceKey } from "#/shared/types";
import { create } from "zustand";
import { useHistoryStore } from "../history/history.store";

type Store = {
  // Resources added per timeline day (index = historyIDX), mirroring the laws
  // and mines stores. Records every change; not consumed anywhere yet.
  history: ResourceKey[][];
};

type Action = {
  addResource: (resource: ResourceKey) => void;
};

export const useResourcesStore = create<Store & Action>((set) => ({
  history: [],

  addResource: (resource) => {
    set((state) => {
      const { historyIDX } = useHistoryStore.getState();
      const history = structuredClone(state.history);

      history[historyIDX] ??= [];
      history[historyIDX].push(resource);

      return { ...state, history };
    });
  },
}));
