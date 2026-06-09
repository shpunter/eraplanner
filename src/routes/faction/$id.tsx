import Castle from "#/features/board/Board";
import { createFileRoute } from "@tanstack/react-router";
import { castles } from "./castles.config";

export const Route = createFileRoute("/faction/$id")({
  parseParams: (params) => ({
    id: params.id as CastleID,
  }),
  validateSearch: (search: Record<string, unknown>): { m: MenuTab } => ({
    m: MENU_TABS.includes(search.m as MenuTab) ? (search.m as MenuTab) : "castles",
  }),
  loader: ({ params }) => {
    const id = Object.hasOwn(castles, params.id) ? params.id : "hive";

    return {
      castle: fetchCastleData(id),
      castleUUID: crypto.randomUUID(),
    };
  },
  component: Castle,
});

const fetchCastleData = async (id: CastleID): Promise<TCastle> => {
  // TODO(BE): replace with real API call, e.g. fetch(`/api/castles/${id}`)
  await new Promise((resolve) => setTimeout(resolve, 300)); // simulate latency
  return castles[id];
};

// Menu tab persisted in the URL search param `m`
export const MENU_TABS = ["castles", "mines", "resources", "laws", "micro"] as const;
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
