import Castle from "#/features/board/Board";
import { createFileRoute, defer } from "@tanstack/react-router";
import { castles } from "./castles.config";

export const Route = createFileRoute("/faction/$id")({
  parseParams: (params) => ({
    id: params.id as CastleID,
  }),
  validateSearch: (search: Record<string, unknown>): { m: MenuTab } => ({
    m: MENU_TABS.includes(search.m as MenuTab) ? (search.m as MenuTab) : "castles",
  }),
  loader: async ({ params }) => {
    const id = params.id as CastleID;

    if (!Object.hasOwn(castles, id)) {
      return {
        castle: defer(fetchCastleData("hive")),
      };
    }

    return {
      castle: defer(fetchCastleData(id)),
    };
  },
  component: Castle,
});

const fetchCastleData = async (id: CastleID) => {
  await new Promise((resolve) => setTimeout(resolve, 1));

  return castles[id] satisfies TCastle;
};

// Menu tab persisted in the URL search param `m`
export const MENU_TABS = ["castles", "mines", "resources", "laws"] as const;
export type MenuTab = (typeof MENU_TABS)[number];

// 1. Get the names of the castles ('hive' | 'necropolis')
export type CastleID = keyof typeof castles;

// 2. Extract ALL possible building keys across all castles dynamically
export type BuildingID = {
  [K in CastleID]: keyof (typeof castles)[K];
}[CastleID];

// 3. The full object for a specific castle
export type TCastle = (typeof castles)[CastleID];

// 4. The actual Building structure
export type TBuilding = {
  [K in CastleID]: (typeof castles)[K][keyof (typeof castles)[K]];
}[CastleID];
