import { Route } from "#/routes/faction/$id";
import { Suspense } from "react";
import css from "./castleBoard.module.css";
import { Await, useParams } from "@tanstack/react-router";
import CastleGrid from "./castleGrid/CastleGrid";
import Add from "./add/Add";
import Tabs from "./tabs/Tabs";

const CastleBoard = () => {
  const { castle, castleUUID } = Route.useLoaderData();
  const { id: castleID } = useParams({ from: "/faction/$id" });

  return (
    <section className={css.main}>
      <div className={css.tabsWrapper}>
        <Tabs />
        <Add />
      </div>
      <div>
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
      </div>
    </section>
  );
};

export default CastleBoard;
