import { Route } from "#/routes/faction/$id";
import { Suspense, useMemo } from "react";
import css from "./castle.module.css";
import { Await, useParams } from "@tanstack/react-router";
import CastleGrid from "./castleGrid/CastleGrid";
import History from "../history/History";
import Resources from "../resources/Resources";
import Mines from "../mines/Mines";
import Add from "./add/Add";
import Tabs from "./tabs/Tabs";

const Castle = () => {
  const { castle } = Route.useLoaderData();
  const { id: castleID } = useParams({ from: "/faction/$id" });
  const castleUUID = useMemo(() => crypto.randomUUID(), []);

  return (
    <div>
      <Resources />
      <History />
      <div>
        <Add />
        <Tabs />
      </div>
      <div className={css.board}>
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
