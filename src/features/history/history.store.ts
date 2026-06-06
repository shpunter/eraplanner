import type { BuildingID, CastleID } from "#/routes/faction/$id";
import type { ResourceKey } from "#/shared/types";
import { create } from "zustand";

const initResources = {
  gold: [25, 20, 15, 10, 5, 2.5],
  wood: [30, 20, 15, 10, 5, 0],
  ore: [30, 20, 15, 10, 5, 0],
  gems: [20, 15, 10, 5, 2, 0],
  crystals: [20, 15, 10, 5, 2, 0],
  mercury: [20, 15, 10, 5, 2, 0],
  dust: [250, 150, 100, 50, 25, 0],
  law: [0, 0, 0, 0, 0, 0],
  astrology: [0, 0, 0, 0, 0, 0],
};

const initDifficulty = 3;

export const useHistoryStore = create<Store & Action>((set) => {
  return {
    difficulty: initDifficulty,
    castles: {} as Store["castles"],
    currDay: 0,
    currWeek: 0,
    currMonth: 0,
    historyIDX: 0,
    currCastleUUID: "",
    history: {} as Store["history"],
    disabledChanges: {},
    iniRes: {
      gold: initResources.gold[initDifficulty] * 1000,
      wood: initResources.wood[initDifficulty],
      ore: initResources.ore[initDifficulty],
      gems: initResources.gems[initDifficulty],
      crystals: initResources.crystals[initDifficulty],
      mercury: initResources.mercury[initDifficulty],
      dust: initResources.dust[initDifficulty],
      law: initResources.law[initDifficulty],
      astrology: initResources.astrology[initDifficulty],
    },
    mines: [],
    resources: [],
    castleMines: {},

    addCastle: (castleUUID, castleID, castle, preBuilds) => {
      set((state) => {
        const historyDisabled = Array.from<boolean>({
          length: state.historyIDX,
        }).fill(true);

        return {
          ...state,
          currCastleUUID: castleUUID,
          castles: {
            ...state.castles,
            [castleUUID]: {
              buildings: castle,
              preBuilds,
              castleID,
              foundDay: state.historyIDX,
            },
          },
          history: {
            ...state.history,
            [castleUUID]: {
              built: [],
              disabled: historyDisabled,
            },
          },
        };
      });
    },

    addCastleMines: (buildingID, resource, amount) => {
      set((state) => {
        return {
          ...state,
          castleMines: {
            ...state.castleMines,
            [state.currCastleUUID]: {
              ...state.castleMines[state.currCastleUUID],
              [buildingID]: { resource, amount },
            },
          },
        };
      });
    },

    addBuilding: (buildingID) => {
      set((state) => {
        const { currDay, currWeek, currMonth, currCastleUUID } = state;
        const totalDays = currDay + currWeek * 7 + currMonth * 4 * 7;

        const newHistoryBuilt = structuredClone(
          state.history?.[currCastleUUID]?.built ?? [],
        );

        newHistoryBuilt[totalDays] = buildingID;

        return {
          ...state,
          history: {
            ...state.history,
            [currCastleUUID]: {
              built: newHistoryBuilt,
              disabled: state.history[currCastleUUID]?.disabled ?? [],
            },
          },
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

    addResources: (newResource) => {
      set((state) => {
        const resources = structuredClone(state.resources);

        resources[state.historyIDX] = [
          ...(resources?.[state.historyIDX] ?? []),
          newResource,
        ];

        return {
          ...state,
          resources,
        };
      });
    },

    removeBuildings: (buildingIDs) => {
      set((state) => {
        const { currCastleUUID } = state;

        const buildings = structuredClone(
          state.history?.[currCastleUUID]?.built ?? [],
        );

        buildings.forEach((id, idx) => {
          if (id && buildingIDs.includes(id)) {
            buildings[idx] = undefined;
          }
        });

        return {
          ...state,
          history: {
            ...state.history,
            [currCastleUUID]: {
              built: buildings,
              disabled: state.history[currCastleUUID]?.disabled ?? [],
            },
          },
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

    setActiveTab: (castleUUID) => {
      set((state) => {
        return {
          ...state,
          currCastleUUID: castleUUID,
        };
      });
    },

    setNextDay: () => {
      set((state) => {
        const nextHistoryIDX = state.historyIDX + 1;

        return {
          historyIDX: nextHistoryIDX,
          currDay: (nextHistoryIDX % 7) as CurrDay,
          currWeek: (((nextHistoryIDX / 7) % 4) >> 0) as CurrWeek,
          currMonth: (nextHistoryIDX / (7 * 4)) >> 0,
        };
      });
    },

    setPrevDay: () => {
      set((state) => {
        if (state.historyIDX === 0) return state;
        const prevHistoryIDX = state.historyIDX - 1;

        return {
          historyIDX: prevHistoryIDX,
          currDay: (prevHistoryIDX % 7) as CurrDay,
          currWeek: (((prevHistoryIDX / 7) % 4) >> 0) as CurrWeek,
          currMonth: (prevHistoryIDX / (7 * 4)) >> 0,
        };
      });
    },

    setDifficulty: (difficulty) => {
      set(() => {
        return {
          difficulty,
          iniRes: {
            gold: initResources.gold[difficulty] * 1000,
            wood: initResources.wood[difficulty],
            ore: initResources.ore[difficulty],
            gems: initResources.gems[difficulty],
            crystals: initResources.crystals[difficulty],
            mercury: initResources.mercury[difficulty],
            dust: initResources.dust[difficulty],
            law: initResources.law[difficulty],
            astrology: initResources.astrology[difficulty],
          },
        };
      });
    },
  };
});

type Store = {
  difficulty: 0 | 1 | 2 | 3 | 4 | 5;
  currDay: CurrDay;
  currWeek: CurrWeek;
  currMonth: number;
  currCastleUUID: string;
  history: {
    [castleUUID: string]:
      | { built: (BuildingID | undefined)[]; disabled: boolean[] }
      | undefined;
  };
  castles: {
    [uuid: string]:
      | {
          buildings: BuildingsType;
          preBuilds: readonly BuildingID[];
          castleID: CastleID;
          /** day the castle was added (first castle = 0) */
          foundDay: number;
        }
      | undefined;
  };
  iniRes: {
    gold: number;
    wood: number;
    ore: number;
    crystals: number;
    gems: number;
    mercury: number;
    dust: number;
    law: number;
    astrology: number;
  };
  mines: Mine[][];
  resources: ResourceKey[][];
  castleMines: {
    [castleUUID: string]: {
      [buildingID in "id11" | "id21"]?: {
        resource: "gold" | "law" | "astrology";
        amount: number;
      };
    };
  };
  historyIDX: number;
};

export type BuildingsType = { [buildingID in BuildingID]?: BuildingType };

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
    readonly mercury?: number;
    readonly gems?: number;
    readonly dust?: number;
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
    preBuilds: readonly BuildingID[],
  ) => void;

  addCastleMines: (
    buildingID: BuildingID,
    resource: "gold" | "law" | "astrology",
    amount: number,
  ) => void;

  addResources: (newResource: ResourceKey) => void;

  setDay: (day: CurrDay) => void;
  setWeek: (week: CurrWeek) => void;
  setMonth: (month: number) => void;
  setActiveTab: (castleUUID: string) => void;
  setNextDay: () => void;
  setPrevDay: () => void;
  setDifficulty: (difficulty: 0 | 1 | 2 | 3 | 4 | 5) => void;

  addBuilding: (buildingID: BuildingID) => void;
  removeBuildings: (buildingIDs: BuildingID[]) => void;
  addMine: (mine: Mine) => void;
};
