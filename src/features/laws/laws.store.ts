import type { ResourceKey } from "#/shared/types";
import { create } from "zustand";
import { useHistoryStore } from "../history/history.store";
import type { FactionLaws, LawID, LawType } from "./laws.config";

export const useLawsStore = create<Store & Action>((set) => ({
  config: {},
  history: [],
  resource: [],
  mine: [],

  setConfig: (config) => {
    set((state) => {
      return {
        ...state,
        config: config.flat().reduce<Record<LawID, LawType>>((acc, law) => {
          acc[law.id] = law;

          return acc;
        }, {}),
      };
    });
  },

  addLaw: (lawID) => {
    set((state) => {
      const { historyIDX } = useHistoryStore.getState();
      const history = structuredClone(state.history);

      history[historyIDX] ??= [];
      history[historyIDX].push(lawID);

      const law = state.config[lawID];

      let { resource, mine } = state;

      if (law && "income" in law && law.income) {
        const entries = Object.entries(law.income).map(([resID, amount]) => ({
          resID: resID as ResourceKey,
          amount,
        }));

        // "once" income is a one-off resource gain; "daily" recurs like a mine
        if (law.incomeType === "once") resource = [...resource, ...entries];
        if (law.incomeType === "daily") mine = [...mine, ...entries];
      }

      return {
        ...state,
        history,
        resource,
        mine,
      };
    });
  },
}));

type Store = {
  resource: { resID: ResourceKey; amount: number }[];
  mine: { resID: ResourceKey; amount: number }[];

  // The current faction's laws, keyed by law id, set on init via setConfig.
  config: Record<LawID, LawType>;
  // Law upgrades recorded per timeline day (index = historyIDX), mirroring the
  // built-buildings timeline in useHistoryStore. Each entry is one upgrade of
  // that law, so a law's level on a given day is how many times it appears up
  // to that day. Used later to sum up the law resource spent.
  history: LawID[][];
};

type Action = {
  setConfig: (config: FactionLaws) => void;
  addLaw: (lawID: LawID) => void;
};
