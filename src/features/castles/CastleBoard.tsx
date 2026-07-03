import { useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { useHistoryStore } from "#/features/history/history.store";
import { emit, patchDown } from "#/shared/castlesBus";
import { CreateRemoteComponent } from "#/features/menu/CreateRemoteComponent";
import Button from "#/components/button/Button";
import Loading from "#/components/mfe/loading/Loading";
import NotConfigured from "#/components/mfe/notConfigured/NotConfigured";
import css from "./castleBoard.module.css";

const RemoteApp = CreateRemoteComponent(() => import("castles/App"), {
  loading: <Loading />,
  error: NotConfigured,
});

const CastleBoard = () => {
  const historyIDX = useHistoryStore((state) => state.historyIDX);
  const { id: faction } = useParams({ from: "/faction/$id" }) as { id: import("#/shared/castlesBus").Faction };

  useEffect(() => {
    patchDown({ historyIDX });
  }, [historyIDX]);

  useEffect(() => {
    patchDown({ faction });
  }, [faction]);

  const onClick = () => emit({ type: "castles:reset-all" });

  return (
    <section className={css.castleBoard}>
      <Button size="sm" className={css.reset} onClick={onClick}>
        Reset
      </Button>
      <RemoteApp />
    </section>
  );
};

export default CastleBoard;
