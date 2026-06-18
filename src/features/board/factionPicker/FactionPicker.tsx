import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { emit as emitCastles } from "#/shared/castlesBus";
import { emit as emitLaw } from "#/shared/lawBus";
import { emit as emitMines } from "#/shared/minesBus";
import { emit as emitResources } from "#/shared/resourcesBus";
import { useHistoryStore } from "#/features/history/history.store";
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
  const navigate = useNavigate();
  const { id: current } = useParams({ from: "/faction/$id" });
  const search = useSearch({ from: "/faction/$id" });
  const reset = useHistoryStore((state) => state.reset);

  const onChange = (faction: (typeof FACTIONS)[number]) => {
    if (faction === current) return;
    reset();
    emitCastles({ type: "castles:reset-all" });
    emitMines({ type: "mines:reset-all" });
    emitResources({ type: "resources:reset-all" });
    emitLaw({ type: "law:reset-all" });
    navigate({ to: "/faction/$id", params: { id: faction }, search });
  };

  return (
    <div className={css.grid}>
      {FACTIONS.map((faction) => (
        <button
          key={faction}
          type="button"
          className={`${css.btn}${faction === current ? ` ${css.active}` : ""}`}
          onClick={() => onChange(faction)}
        >
          <img
            src={`/img/faction/${faction}.webp`}
            alt={faction}
            className={css.img}
          />
        </button>
      ))}
    </div>
  );
};

export default FactionPicker;
