import type { BuildingID, CastleID, TCastle } from "#/routes/castle/$id";
import { create } from "zustand";

export const useHistoryStore = create<Store & Action>((set) => {
  return {
    castles: {},
    currDay: 0,
    currWeek: 0,
    currMonth: 0,
    history: {},
    marked: [],
    resources: {
      gold: 0,
    },

    addCastle: (castleUUID, castleID, castle, preBuilds) => {
      set((state) => {
        return {
          ...state,
          castles: {
            ...state.castles,
            [castleUUID]: { buildings: castle, preBuilds },
          },
          history: {
            ...state.history,
            [castleUUID]: [],
          },
        };
      });
    },

    addBuilding: (castleUUID, buildingID) => {
      set((state) => {
        const { currDay, currWeek, currMonth } = state;

        let nextDay = currDay + 1;
        let nextWeek = currWeek;
        let nextMonth = currMonth;

        if (currDay >= 6) {
          nextDay = 0;
          nextWeek = currWeek + 1;
          nextMonth = currMonth;
        }

        if (currDay >= 6 && currWeek >= 3) {
          nextDay = 0;
          nextWeek = 0;
          nextMonth = currMonth + 1;
        }

        const newHistory = structuredClone(state.history[castleUUID]);
        const totalDays = currDay + currWeek * 7 + currMonth * 4 * 7;

        console.log("currMonth:", currMonth);
        console.log("currWeek:", currWeek);
        console.log("currDay:", currDay);
        console.log("totalDays:", totalDays);
        console.log("buildingID:", buildingID);


        newHistory[totalDays] = buildingID;

        return {
          ...state,
          history: {
            ...state.history,
            [castleUUID]: newHistory,
          },
          currDay: nextDay as CurrDay,
          currWeek: nextWeek as CurrWeek,
          currMonth: nextMonth,
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
          currDay: 0,
        };
      });
    },

    setMonth: (month) => {
      set(() => {
        return {
          currDay: 0,
          currWeek: 0,
          currMonth: month,
        };
      });
    },

    setMarked: (buildings) => {
      set(() => {
        return {
          marked: buildings,
        };
      });
    },
  };
});

type Store = {
  currDay: CurrDay;
  currWeek: CurrWeek;
  currMonth: number;
  history: {
    [castleUUID: string]: BuildingID[];
  };
  castles: {
    [uuid: string]: { buildings: TCastle; preBuilds: BuildingID[] };
  };
  marked: BuildingID[];
  resources: {
    gold: number;
  };
};

export type CurrDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CurrWeek = 0 | 1 | 2 | 3;

type Action = {
  addCastle: (
    castleUUID: string,
    castleID: CastleID,
    castle: TCastle,
    preBuilds: BuildingID[],
  ) => void;

  setDay: (day: CurrDay) => void;
  setWeek: (week: CurrWeek) => void;
  setMonth: (month: number) => void;
  addBuilding: (castleUUID: string, buildingID: BuildingID) => void;
  setMarked: (buildings: BuildingID[]) => void;
};
