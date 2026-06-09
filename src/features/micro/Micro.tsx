import { CatchBoundary, ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import { useHistoryStore } from "#/features/history/history.store";
import { patchState } from "#/shared/microBus";
import css from "./micro.module.css";

// Federated remote, loaded at runtime from the URL configured via
// VITE_MICRO_REMOTE_ENTRY (see vite.config.ts). Until a remote is deployed and
// that env var is set, loading fails and the error boundary renders a fallback.
const RemoteApp = lazy(() => import("micro/App"));

const Loading = () => <div className={css.status}>Loading microfrontend…</div>;

const NotConfigured = () => (
  <div className={css.status}>
    <p className={css.title}>Microfrontend not connected yet</p>
    <p className={css.hint}>
      Set <code>VITE_MICRO_REMOTE_ENTRY</code> to the remote's{" "}
      <code>remoteEntry.js</code> URL and reload.
    </p>
  </div>
);

const Micro = () => {
  const historyIDX = useHistoryStore((state) => state.historyIDX);

  // Publish the host's current timeline day to the remote whenever it changes.
  useEffect(() => {
    patchState({ historyIDX });
  }, [historyIDX]);

  return (
    <section className={css.micro}>
      <ClientOnly fallback={<Loading />}>
        <CatchBoundary
          getResetKey={() => "micro"}
          errorComponent={NotConfigured}
        >
          <Suspense fallback={<Loading />}>
            <RemoteApp />
          </Suspense>
        </CatchBoundary>
      </ClientOnly>
    </section>
  );
};

export default Micro;
