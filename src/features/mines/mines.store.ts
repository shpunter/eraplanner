import { create } from "zustand";
import { useHistoryStore, type Mine } from "../history/history.store";

type Store = {
  // Mines placed per timeline day (index = historyIDX), mirroring the laws
  // store. Records every change; not consumed anywhere yet.
  history: Mine[][];
};

type Action = {
  addMine: (mine: Mine) => void;
};

export const useMinesStore = create<Store & Action>((set) => ({
  history: [],

  addMine: (mine) => {
    set((state) => {
      const { historyIDX } = useHistoryStore.getState();
      const history = structuredClone(state.history);

      history[historyIDX] ??= [];
      history[historyIDX].push(mine);

      return { ...state, history };
    });
  },
}));
