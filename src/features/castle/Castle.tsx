import { Route } from "#/routes/castle/$id";
import { Suspense, useMemo } from "react";
import css from "./styles.module.css";
import { Await, useParams } from "@tanstack/react-router";
import CastleGrid from "./CastleGrid";
import History from "../history/History";
import Resources from "../resources/Resources";
import Mines from "../mines/Mines";

const Castle = () => {
  const { castle } = Route.useLoaderData();
  const { id: castleID } = useParams({ from: "/castle/$id" });
  const castleUUID = useMemo(() => crypto.randomUUID(), []);

  return (
    <div>
      <History />
      <div className={css.board}>
        <Resources />
        <Suspense
          fallback={<div className={css.loader}>Loading Castle Data...</div>}
        >
          <Await promise={castle}>
            {(resolvedCastle) => (
              <CastleGrid
                castle={resolvedCastle}
                castleID={castleID}
                castleUUID={castleUUID}
              />
            )}
          </Await>
        </Suspense>
        <Mines />
      </div>
    </div>
  );
};

export default Castle;
