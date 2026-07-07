import Board from "#/features/board/Board";
import { createFileRoute, Outlet } from "@tanstack/react-router";

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
    id: ((FACTION_IDS as readonly string[]).includes(params.id)
      ? params.id
      : "hive") as CastleID,
  }),
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

export const MENU_TABS = ["castles", "mines", "resources", "law"] as const;
export type MenuTab = (typeof MENU_TABS)[number];

export const TAB_ROUTES = {
  castles: "/faction/$id/castles",
  mines: "/faction/$id/mines",
  resources: "/faction/$id/resources",
  law: "/faction/$id/law",
} as const satisfies Record<MenuTab, string>;

export type CastleID = (typeof FACTION_IDS)[number];

export const FACTION_IDS = [
  "hive",
  "necropolis",
  "grove",
  "dungeon",
  "temple",
  "schism",
] as const;
