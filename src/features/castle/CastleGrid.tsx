import type { CastleID, TBuilding, TCastle } from "#/routes/castle/$id";
import { useEffect, useMemo } from "react";
import Building from "./building/Building";
import css from "./styles.module.css";
import { useCastleStore } from "./castle.store";

const CastleGrid = ({ castle, castleID, castleUUID }: CastleGridProps) => {
  const addCastle = useCastleStore((state) => state.addCastle);

  useEffect(() => {
    addCastle(castleID, castle, castleUUID);
  }, [castleID, castle, addCastle, castleUUID]);

  const grid = useMemo(() => {
    const array = Array.from({ length: 9 * 5 }, () => ({
      uuid: crypto.randomUUID(),
    })) as (
      | ({ uuid: string } & TBuilding)
      | ({ uuid: string })
    )[];

    Object.values(castle).forEach((building) => {
      const [y, x] = building.pos;
      const idx = y * 9 + x;
      array[idx] = { ...array[idx], ...building };
    });

    return array;
  }, [castle]);

  return (
    <div className={css.castle}>
      {grid.map((building) =>
        "id" in building ? (
          <Building
            key={building.uuid}
            building={building}
            castleUUID={castleUUID}
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
  castle: TCastle;
  castleID: CastleID;
  castleUUID: string;
};
