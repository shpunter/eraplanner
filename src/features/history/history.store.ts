import type { BuildingID, CastleID, TCastle } from "#/routes/castle/$id";
import { castles } from "#/routes/castle/castles.config";
import { create } from "zustand";

export const useHistoryStore = create<Store & Action>((set) => {
  return {
    castles: {},

    addCastle: (castleID, castle, castleUUID) => {
      set((state) => {
        return {
          ...state,
          castles: {
            ...state.castles,
            [castleUUID]: {castle},
          },
        };
      });
    },

    currDay: 1,
    currWeek: 1,
    currMonth: 1,
    history: Object.entries(castles.hive)
      .filter(([_, building]) => building.isBuilt)
      .map(([id]) => id as BuildingID),

    addBuilding: (buildingID) => {
      set((state) => {
        const { currDay, currWeek } = state;

        const incWeek = currDay >= 7;
        const nextDay = incWeek ? 1 : currDay + 1;
        const historyInWeeks = ((state.history.length / 7) >> 0) + 1;
        const nextWeek = (historyInWeeks - historyInWeeks / 4) >> 0;

        return {
          history: [...state.history, buildingID],
          currDay: nextDay as CurrDay,
          currWeek: (nextWeek + 1) as CurrWeek,
        };
      });
    },

    setDay: (day) => {
      set(() => {
        return {
          currDay: day,
        };
      });
    },

    setWeek: (week) => {
      set(() => {
        return {
          currWeek: week,
          currDay: 1,
        };
      });
    },
  };
});

type Store = {
  currDay: CurrDay;
  currWeek: CurrWeek;
  currMonth: number;
  history: BuildingID[];
  castles: {
    [uuid: string]: TCastle & { isBuilt: boolean };
  };
};

export type CurrDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type CurrWeek = 1 | 2 | 3 | 4;

type Action = {
  addCastle: (castleID: CastleID, castle: TCastle, castleUUID: string) => void;
  setDay: (day: CurrDay) => void;
  setWeek: (week: CurrWeek) => void;
  addBuilding: (buildingID: BuildingID) => void;
};
