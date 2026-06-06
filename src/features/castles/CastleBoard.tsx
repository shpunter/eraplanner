import { Route } from "#/routes/faction/$id";
import { Suspense, useMemo } from "react";
import css from "./castleBoard.module.css";
import { Await, useParams } from "@tanstack/react-router";
import CastleGrid from "./castleGrid/CastleGrid";
import Mines from "../mines/Mines";
import Add from "./add/Add";
import Tabs from "./tabs/Tabs";

const CastleBoard = () => {
  const { castle } = Route.useLoaderData();
  const { id: castleID } = useParams({ from: "/faction/$id" });
  const castleUUID = useMemo(() => crypto.randomUUID(), []);

  return (
    <section className={css.main}>
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
    </section>
  );
};

export default CastleBoard;
