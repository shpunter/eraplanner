import Castle from "#/features/castle/Castle";
import { createFileRoute, defer } from "@tanstack/react-router";
import { castles } from "./castles.config";
import type { BuildingsType } from "#/features/history/history.store";

export const Route = createFileRoute("/castle/$id")({
  parseParams: (params) => ({
    id: params.id as CastleID,
  }),
  loader: async ({ params }) => {
    const id = params.id as CastleID;

    if (!Object.hasOwn(castles, id)) {
      return {
        castle: defer(fetchCastleData("hive")),
      };
    }

    return {
      castle: defer(fetchCastleData(id)),
    };
  },
  component: Castle,
});

async function fetchCastleData(id: CastleID) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return castles[id] satisfies BuildingsType;
}

// 1. Get the names of the castles ('hive' | 'inferno' etc)
export type CastleID = keyof typeof castles;

// 2. The full object for a specific castle (e.g. the hive object)
export type TCastle = (typeof castles)[CastleID];

// 3. The specific IDs within a castle ('id00' | 'id10' etc)
export type BuildingID = keyof TCastle;

// 4. The actual Building structure
export type TBuilding = TCastle[BuildingID];
