import { createFileRoute, redirect } from "@tanstack/react-router";

const MENU_TABS = ["castles", "mines", "resources", "law"] as const;
type MenuTab = (typeof MENU_TABS)[number];

const TAB_ROUTES = {
  castles: "/faction/$id/castles",
  mines: "/faction/$id/mines",
  resources: "/faction/$id/resources",
  law: "/faction/$id/law",
} as const;

// Backward-compat: /faction/$id and /faction/$id?m=mines → /faction/$id/<tab>
export const Route = createFileRoute("/faction/$id/")({
  beforeLoad: ({ params, search }) => {
    const m = (search as Record<string, unknown>).m;
    const tab: MenuTab = MENU_TABS.includes(m as MenuTab)
      ? (m as MenuTab)
      : "castles";
    throw redirect({
      to: TAB_ROUTES[tab],
      params: { id: params.id },
      replace: true,
    });
  },
});
