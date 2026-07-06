import Board from "#/features/board/Board";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { castles } from "./castles.config";

export const Route = createFileRoute("/faction/$id")({
  head: ({ params }) => ({
    meta: [
      {
        property: "og:image",
        content: `https://eraplanner.com/img/faction/${params.id}.webp`,
      },
      { property: "og:image:width", content: "163" },
      { property: "og:image:height", content: "175" },
      {
        property: "og:image:alt",
        content: `${params.id} faction — Era Planner`,
      },
      {
        name: "twitter:image",
        content: `https://eraplanner.com/img/faction/${params.id}.webp`,
      },
    ],
    links: [
      {
        rel: "preload",
        as: "image",
        href: `/img/faction/${params.id}.webp`,
        fetchPriority: "high",
      },
    ],
  }),
  parseParams: (params) => ({
    id: params.id as CastleID,
  }),
  loader: ({ params }) => {
    const id = (
      Object.hasOwn(castles, params.id) ? params.id : "hive"
    ) as CastleID;

    return {
      castle: fetchCastleData(id),
      // Stable identity for the route's primary castle. Must NOT be random:
      // the loader can re-run (revalidation), and a fresh id each run would make
      // CastleGrid register a brand-new castle every time its deferred `castle`
      // resolves — a phantom duplicate that still feeds pre-build income.
      // Secondary castles (Add) mint their own random UUIDs and never collide.
      castleUUID: `primary-${id}`,
    };
  },
  component: FactionPage,
});

function FactionPage() {
  return (
    <>
      <Board />
      <Outlet />
    </>
  );
}

const fetchCastleData = async (id: CastleID): Promise<TCastle> => {
  // TODO(BE): replace with real API call, e.g. fetch(`/api/castles/${id}`)
  await new Promise((resolve) => setTimeout(resolve, 300)); // simulate latency
  return castles[id];
};

export const MENU_TABS = ["castles", "mines", "resources", "law"] as const;
export type MenuTab = (typeof MENU_TABS)[number];

export const TAB_ROUTES = {
  castles: "/faction/$id/castles",
  mines: "/faction/$id/mines",
  resources: "/faction/$id/resources",
  law: "/faction/$id/law",
} as const satisfies Record<MenuTab, string>;

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
