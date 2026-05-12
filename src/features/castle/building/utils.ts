import type { BuildingID, CastleID } from "#/routes/castle/$id";
import { castles } from "#/routes/castle/castles.config";

const fn = (
  castleID: CastleID,
  buildingID: BuildingID,
  IDs: Set<BuildingID>,
  direction: "prev" | "next",
) => {
  if (!buildingID || IDs.has(buildingID)) return;

  const collectedIDs = castles[castleID][buildingID][direction] ?? [];

  IDs.add(buildingID);

  collectedIDs.forEach((collectedID) => {
    fn(castleID, collectedID, IDs, direction);
  });
};

export const trace = (
  castleID: CastleID,
  buildingID: BuildingID,
  direction: "prev" | "next",
) => {
  const IDs = new Set<BuildingID>();

  fn(castleID, buildingID, IDs, direction);

  return Array.from(IDs);
};
