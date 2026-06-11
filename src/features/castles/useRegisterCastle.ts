import { useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { Route } from "#/routes/faction/$id";
import { useHistoryStore } from "#/features/history/history.store";
import { initCastlePreBuilds } from "#/routes/faction/castles.config";

// Register the route's primary castle as soon as the board mounts, on ANY menu
// tab (`?m=`) — before the user ever opens the castles tab. CastleGrid also
// registers it, but only while the castles tab is mounted, so landing on
// `?m=mines` (or resources / law) left no castle and the baseline pre-build
// income (gold / law / astrology, 500 each) was never calculated.
//
// `castle` from the loader is a deferred promise, so resolve it first.
// Registration is idempotent and the loader's `castleUUID` is stable, so doing
// it here as well as in CastleGrid is a harmless no-op duplicate.
export const useRegisterCastle = (): void => {
  const { castle, castleUUID } = Route.useLoaderData();
  const { id: castleID } = useParams({ from: "/faction/$id" });
  const addCastle = useHistoryStore((state) => state.addCastle);

  useEffect(() => {
    let active = true;

    Promise.resolve(castle).then((resolved) => {
      if (active) {
        addCastle(castleUUID, castleID, resolved, initCastlePreBuilds[castleID]);
      }
    });

    return () => {
      active = false;
    };
  }, [castle, castleUUID, castleID, addCastle]);
};
