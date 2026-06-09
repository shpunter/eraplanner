import { ClientOnly } from "@tanstack/react-router";
import { Component, type ReactNode, Suspense, lazy } from "react";
import css from "./micro.module.css";

// Federated remote, loaded at runtime from the URL configured via
// VITE_MICRO_REMOTE_ENTRY (see vite.config.ts). Until a remote is deployed and
// that env var is set, loading fails and the error boundary renders a fallback.
const RemoteApp = lazy(() => import("micro/App"));

class RemoteBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

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
  return (
    <section className={css.micro}>
      <ClientOnly fallback={<Loading />}>
        <RemoteBoundary fallback={<NotConfigured />}>
          <Suspense fallback={<Loading />}>
            <RemoteApp />
          </Suspense>
        </RemoteBoundary>
      </ClientOnly>
    </section>
  );
};

export default Micro;
