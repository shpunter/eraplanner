import { useEffect } from "react";
import { useHistoryStore } from "#/features/history/history.store";
import { emit, patchDown } from "#/shared/resourcesBus";
import { CreateRemoteComponent } from "#/features/menu/CreateRemoteComponent";
import Button from "#/components/button/Button";
import Loading from "#/components/mfe/loading/Loading";
import NotConfigured from "#/components/mfe/notConfigured/NotConfigured";
import css from "./resources.module.css";

const RemoteApp = CreateRemoteComponent(() => import("resources/App"), {
  loading: <Loading />,
  error: NotConfigured,
});

const Resources = () => {
  const historyIDX = useHistoryStore((state) => state.historyIDX);

  useEffect(() => {
    patchDown({ historyIDX });
  }, [historyIDX]);

  const onClick = () => emit({ type: "resources:reset-all" });

  return (
    <section className={css.resources}>
      <Button size="sm" className={css.reset} onClick={onClick}>
        Reset
      </Button>
      <RemoteApp />
    </section>
  );
};

export default Resources;
