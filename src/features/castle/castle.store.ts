import type { BuildingID, CastleID, TCastle } from "#/routes/castle/$id";
import { create } from "zustand";

export const useCastleStore = create<State & Action>((set) => {
  return {
    castles: {},

    addCastle: (castleID, castle, castleUUID) => {
      set((state) => {
        return {
          ...state,
          castles: {
            ...state.castles,
            [castleUUID]: castle,
          },
        };
      });
    },

    setBuilt: (castleUUID, buildingID, isBuilt) => {
      set((state) => {
        return {
          ...state,
          castles: {
            ...state.castles,
            [castleUUID]: {
              ...state.castles[castleUUID],
              [buildingID]: {
                ...state.castles[castleUUID][buildingID],
                isBuilt,
              },
            },
          },
        };
      });
    },

    setMarked: (castleUUID, buildingID, isMarked) => {
      set((state) => {
        return {
          ...state,
          castles: {
            ...state.castles,
            [castleUUID]: {
              ...state.castles[castleUUID],
              [buildingID]: {
                ...state.castles[castleUUID][buildingID],
                isMarked,
              },
            },
          },
        };
      });
    },
  };
});

type State = {
  castles: {
    [uuid: string]: TCastle;
  };
};

type Action = {
  addCastle: (castleID: CastleID, castle: TCastle, castleUUID: string) => void;
  setMarked: (
    castleUUID: string,
    buildingID: BuildingID,
    isMarked: boolean,
  ) => void;
  setBuilt: (
    castleUUID: string,
    buildingID: BuildingID,
    isBuilt: boolean,
  ) => void;
};
