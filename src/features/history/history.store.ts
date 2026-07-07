import { createIdbStore } from "#/shared/createIdbStore";

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

export const useHistoryStore = createIdbStore<Store & Action>(
  "history",
  (set) => {
    return {
      difficulty: initDifficulty,
      currDay: 0,
      currWeek: 0,
      currMonth: 0,
      historyIDX: 0,
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

      reset: () => {
        set((state) => ({
          currDay: 0,
          currWeek: 0,
          currMonth: 0,
          historyIDX: 0,
          iniRes: {
            gold: initResources.gold[state.difficulty] * 1000,
            wood: initResources.wood[state.difficulty],
            ore: initResources.ore[state.difficulty],
            gems: initResources.gems[state.difficulty],
            crystals: initResources.crystals[state.difficulty],
            mercury: initResources.mercury[state.difficulty],
            dust: initResources.dust[state.difficulty],
            law: initResources.law[state.difficulty],
            astrology: initResources.astrology[state.difficulty],
          },
        }));
      },
    };
  },
);

type Store = {
  difficulty: 0 | 1 | 2 | 3 | 4 | 5;
  currDay: CurrDay;
  currWeek: CurrWeek;
  currMonth: number;
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
  historyIDX: number;
};


export type CurrDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CurrWeek = 0 | 1 | 2 | 3;
export type Mine = "ore" | "wood" | "crystals" | "gem" | "mercury" | "gold";

type Action = {
  setDay: (day: CurrDay) => void;
  setWeek: (week: CurrWeek) => void;
  setMonth: (month: number) => void;
  setNextDay: () => void;
  setPrevDay: () => void;
  setDifficulty: (difficulty: 0 | 1 | 2 | 3 | 4 | 5) => void;
  reset: () => void;
};
