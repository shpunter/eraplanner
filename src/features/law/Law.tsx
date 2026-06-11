import { useEffect } from "react";
import { useHistoryStore } from "#/features/history/history.store";
import { patchState } from "#/shared/lawBus";
import css from "./law.module.css";
import { CreateRemoteComponent } from "#/features/menu/CreateRemoteComponent";

const Loading = () => <div className={css.status}>Loading microfrontend…</div>;

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
    patchState({ historyIDX });
  }, [historyIDX]);

  return (
    <section className={css.law}>
      <RemoteApp />
    </section>
  );
};

export default Law;
