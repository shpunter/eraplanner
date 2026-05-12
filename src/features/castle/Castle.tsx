import { Route } from "#/routes/castle/$id";
import { Suspense, useMemo } from "react";
import css from "./styles.module.css";
import { Await, useParams } from "@tanstack/react-router";
import CastleGrid from "./CastleGrid";
import History from "../history/History";

const Castle = () => {
  const { castle } = Route.useLoaderData();
  const { id: castleID } = useParams({ from: "/castle/$id" });
  const castleUUID = useMemo(() => crypto.randomUUID(), []);

  return (
    <Suspense
      fallback={<div className={css.loader}>Loading Castle Data...</div>}
    >
      <div>
        <History />
      </div>
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
  );
};

export default Castle;
