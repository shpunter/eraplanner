import type { BuildingID, CastleID, TCastle } from "#/routes/castle/$id";
import { create } from "zustand";

export const useHistoryStore = create<Store & Action>((set) => {
  return {
    castles: {},
    currDay: 0,
    currWeek: 0,
    currMonth: 0,
    historyIDX: 0,
    currCastleUUID: "",
    history: {},
    disabledChanges: {},
    marked: [],
    resources: {
      gold: 10_000,
      wood: 10,
      ore: 10,
      gems: 5,
      crystals: 5,
      mercury: 5,
      dust: 50,
    },
    mines: [],

    addCastle: (castleUUID, castleID, castle, preBuilds) => {
      set((state) => {
        return {
          ...state,
          currCastleUUID: castleUUID,
          castles: {
            ...state.castles,
            [castleUUID]: { buildings: castle, preBuilds, castleID },
          },
          history: {
            ...state.history,
            [castleUUID]: [],
          },
          disabledChanges: {
            ...state.disabledChanges,
            [castleUUID]: Array.from<boolean>({ length: state.historyIDX }).fill(
              true,
            ),
          },
        };
      });
    },

    addBuilding: (buildingID) => {
      set((state) => {
        const { currDay, currWeek, currMonth, currCastleUUID, historyIDX } =
          state;

        // let nextDay = currDay + 1;
        // let nextWeek = currWeek;
        // let nextMonth = currMonth;
        // let nextHistoryIDX = nextDay + nextWeek * 7 + nextMonth * 4 * 7;

        // if (currDay >= 6) {
        //   nextDay = 0;
        //   nextWeek = currWeek + 1;
        //   nextMonth = currMonth;
        //   nextHistoryIDX = nextWeek * 7 + nextMonth * 4 * 7;
        // }

        // if (currDay >= 6 && currWeek >= 3) {
        //   nextDay = 0;
        //   nextWeek = 0;
        //   nextMonth = currMonth + 1;
        //   nextHistoryIDX = nextMonth * 4 * 7;
        // }

        const newHistory = structuredClone(
          state.history?.[currCastleUUID] ?? [],
        );
        const totalDays = currDay + currWeek * 7 + currMonth * 4 * 7;

        newHistory[totalDays] = buildingID;

        return {
          ...state,
          history: {
            ...state.history,
            [currCastleUUID]: newHistory,
          },
          // currDay: nextDay as CurrDay,
          // currWeek: nextWeek as CurrWeek,
          // currMonth: nextMonth,
          // historyIDX: nextHistoryIDX,
        };
      });
    },

    setDay: (day) => {
      set(({ currWeek, currMonth }) => {
        return {
          currDay: day,
          historyIDX: day + currWeek * 7 + currMonth * 4 * 7,
        };
      });
    },

    setWeek: (week) => {
      set(({ currMonth }) => {
        return {
          currWeek: week,
          currDay: 0,
          historyIDX: 0 + week * 7 + currMonth * 4 * 7,
        };
      });
    },

    setMonth: (month) => {
      set(() => {
        return {
          currDay: 0,
          currWeek: 0,
          currMonth: month,
          historyIDX: month * 4 * 7,
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

    addMine: (newMine) => {
      set((state) => {
        const mines = structuredClone(state.mines);

        mines[state.historyIDX] = [
          ...(mines?.[state.historyIDX] ?? []),
          newMine,
        ];

        return {
          ...state,
          mines,
        };
      });
    },

    setActiveTab: (castleUUID) => {
      set((state) => {
        return {
          ...state,
          currCastleUUID: castleUUID,
        };
      });
    },
  };
});

type Store = {
  currDay: CurrDay;
  currWeek: CurrWeek;
  currMonth: number;
  currCastleUUID: string;
  history: {
    [castleUUID: string]: BuildingID[] | undefined;
  };
  disabledChanges: {
    [castleUUID: string]: boolean[] | undefined;
  };
  castles: {
    [uuid: string]:
      | {
          buildings: BuildingsType;
          preBuilds: BuildingID[];
          castleID: CastleID;
        }
      | undefined;
  };
  marked: BuildingID[];
  resources: {
    gold: number;
    wood: number;
    ore: number;
    crystals: number;
    gems: number;
    mercury: number;
  };
  mines: Mine[][];
  historyIDX: number;
};

export type BuildingsType = { [buildingID in BuildingID]: BuildingType };

export type BuildingType = {
  readonly id: BuildingID;
  readonly name: string;
  readonly prev: readonly BuildingID[] | null;
  readonly next: readonly BuildingID[] | null;
  readonly pos: readonly [number, number];
  readonly cost: {
    readonly gold?: number;
    readonly wood?: number;
    readonly ore?: number;
    readonly gems?: number;
    readonly crystals?: number;
    readonly mercury?: number;
    readonly dust?: number;
  };
  readonly produces: {
    readonly gold?: number;
    readonly law?: number;
    readonly astrology?: number;
    readonly crystals?: number;
  };
};

export type CurrDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CurrWeek = 0 | 1 | 2 | 3;
export type Mine = "ore" | "wood" | "crystal" | "gem" | "mercury" | "gold";

type Action = {
  addCastle: (
    castleUUID: string,
    castleID: CastleID,
    castle: BuildingsType,
    preBuilds: BuildingID[],
  ) => void;

  setDay: (day: CurrDay) => void;
  setWeek: (week: CurrWeek) => void;
  setMonth: (month: number) => void;
  setMarked: (buildings: BuildingID[]) => void;
  setActiveTab: (castleUUID: string) => void;

  addBuilding: (buildingID: BuildingID) => void;
  addMine: (mine: Mine) => void;
};
