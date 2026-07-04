import type { MenuTab } from "#/routes/faction/$id";

export const TAB_COLORS: Record<MenuTab, string> = {
  castles: "oklch(0.5 0.14 133)", // green  — top arc
  law: "oklch(0.7 0.1 108)", // yellow — right arc
  resources: "oklch(0.65 0.18 50)", // orange — bottom arc
  mines: "oklch(0.8 0 0)", // white  — left arc
};
