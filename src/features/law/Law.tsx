import { useEffect } from "react";
import { useHistoryStore } from "#/features/history/history.store";
import { emit, patchDown } from "#/shared/lawBus";
import css from "./law.module.css";
import { CreateRemoteComponent } from "#/features/menu/CreateRemoteComponent";
import Button from "#/components/button/Button";

const Loading = () => <div className={css.status}>Loading...</div>;

const NotConfigured = () => (
  <div className={css.status}>
    <p className={css.title}>Microfrontend not connected yet</p>
    <p className={css.hint}>
      Set <code>VITE_LAW_REMOTE_ENTRY</code> to the remote's{" "}
      <code>remoteEntry.js</code> URL and reload.
    </p>
  </div>
);

const RemoteApp = CreateRemoteComponent(() => import("law/App"), {
  loading: <Loading />,
  error: NotConfigured,
});

const Law = () => {
  const historyIDX = useHistoryStore((state) => state.historyIDX);

  useEffect(() => {
    patchDown({ historyIDX });
  }, [historyIDX]);

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
