import type { BuildingID } from "#/routes/faction/$id";
import { create } from "zustand";

export const useMarkedStore = create<Store & Action>((set) => {
  return {
    marked: [],

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
  marked: BuildingID[];
};

type Action = {
  setMarked: (buildings: BuildingID[]) => void;
};
