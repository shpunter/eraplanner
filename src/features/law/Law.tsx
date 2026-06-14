import { useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { useHistoryStore } from "#/features/history/history.store";
import { emit, patchDown } from "#/shared/lawBus";
import css from "./law.module.css";
import { CreateRemoteComponent } from "#/features/menu/CreateRemoteComponent";
import Button from "#/components/button/Button";
import Loading from "#/components/mfe/loading/Loading";
import NotConfigured from "#/components/mfe/notConfigured/NotConfigured";

const RemoteApp = CreateRemoteComponent(() => import("law/App"), {
  loading: <Loading />,
  error: NotConfigured,
});

const Law = () => {
  const historyIDX = useHistoryStore((state) => state.historyIDX);
  const { id: faction } = useParams({ from: "/faction/$id" });

  useEffect(() => {
    patchDown({ historyIDX });
  }, [historyIDX]);

  useEffect(() => {
    patchDown({ faction });
  }, [faction]);

  const onClick = () => emit({ type: "law:reset-all" });

  return (
    <section className={css.law}>
      <Button size="sm" className={css.reset} onClick={onClick}>
        Reset
      </Button>
      <RemoteApp />
    </section>
  );
};

export default Law;
