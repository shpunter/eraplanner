import { Link, useMatch, useParams } from "@tanstack/react-router";
import { emit as emitCastles } from "#/shared/castlesBus";
import { emit as emitLaw } from "#/shared/lawBus";
import { emit as emitMines } from "#/shared/minesBus";
import { emit as emitResources } from "#/shared/resourcesBus";
import { useHistoryStore } from "#/features/history/history.store";
import { TAB_ROUTES, type MenuTab } from "#/routes/faction/$id";
import css from "./factionPicker.module.css";

const FACTIONS = [
  "hive",
  "schism",
  "temple",
  "dungeon",
  "grove",
  "necropolis",
] as const;

const FactionPicker = () => {
  const { id: current } = useParams({ from: "/faction/$id" });
  const reset = useHistoryStore((state) => state.reset);

  const isMines = !!useMatch({
    from: "/faction/$id/mines",
    shouldThrow: false,
  });
  const isResources = !!useMatch({
    from: "/faction/$id/resources",
    shouldThrow: false,
  });
  const isLaw = !!useMatch({ from: "/faction/$id/law", shouldThrow: false });
  const TAB_FLAGS: [boolean, MenuTab][] = [
    [isMines, "mines"],
    [isResources, "resources"],
    [isLaw, "law"],
  ];
  const activeTab: MenuTab =
    TAB_FLAGS.find(([active]) => active)?.[1] ?? "castles";

  const handleClick = (faction: (typeof FACTIONS)[number]) => {
    if (faction === current) return;
    reset();
    emitCastles({ type: "castles:reset-all" });
    emitMines({ type: "mines:reset-all" });
    emitResources({ type: "resources:reset-all" });
    emitLaw({ type: "law:reset-all" });
  };

  return (
    <div className={css.grid}>
      {FACTIONS.map((faction) => (
        <Link
          key={faction}
          to={TAB_ROUTES[activeTab]}
          params={{ id: faction }}
          className={`${css.btn}${faction === current ? ` ${css.active}` : ""}`}
          onClick={() => handleClick(faction)}
        >
          <img
            src={`/img/faction/${faction}.webp`}
            alt={faction}
            className={css.img}
            fetchPriority={faction === current ? "high" : "auto"}
          />
        </Link>
      ))}
    </div>
  );
};

export default FactionPicker;
