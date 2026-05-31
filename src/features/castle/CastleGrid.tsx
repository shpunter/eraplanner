import type { CastleID, TBuilding } from "#/routes/castle/$id";
import { useEffect, useMemo } from "react";
import Building from "./building/Building";
import css from "./castle.module.css";
import { useHistoryStore, type BuildingsType } from "../history/history.store";
import { initCastlePreBuilds } from "#/routes/castle/castles.config";

const CastleGrid = ({ castle, castleID, castleUUID }: CastleGridProps) => {
  const addCastle = useHistoryStore((state) => state.addCastle);
  const activeCastle = useHistoryStore(
    (state) => state.castles[state.currCastleUUID],
  );

  useEffect(() => {
    addCastle(castleUUID, castleID, castle, initCastlePreBuilds[castleID]);
  }, [castleID, castle, addCastle, castleUUID]);

  const grid = useMemo(() => {
    const array = Array.from({ length: 9 * 5 }, () => ({
      uuid: crypto.randomUUID(),
    })) as (({ uuid: string } & TBuilding) | { uuid: string })[];

    Object.values(activeCastle?.buildings ?? {}).forEach((building) => {
      if (!building) return;

      const [y, x] = building.pos;
      const idx = y * 9 + x;
      array[idx] = { ...array[idx], ...building };
    });

    return array;
  }, [activeCastle]);

  if (!activeCastle) return null;

  return (
    <div className={css.castle}>
      {grid.map((building) =>
        "id" in building ? (
          <Building
            key={building.uuid}
            building={building}
            castleID={activeCastle.castleID}
          />
        ) : (
          <div key={building.uuid} />
        ),
      )}
    </div>
  );
};

export default CastleGrid;

type CastleGridProps = {
  castle: BuildingsType;
  castleID: CastleID;
  castleUUID: string;
};
