import {
  CatchBoundary,
  ClientOnly,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import {
  type ComponentType,
  type FunctionComponent,
  type ReactNode,
  Suspense,
  lazy,
} from "react";

export function CreateRemoteComponent<P extends object>(
  load: RemoteLoader<P>,
  { loading = null, error, resetKey = "remote" }: Options = {},
): ComponentType<P> {
  const Lazy = lazy(load);

  return function RemoteComponent(props: P) {
    return (
      <ClientOnly fallback={loading}>
        <CatchBoundary getResetKey={() => resetKey} errorComponent={error}>
          <Suspense fallback={loading}>
            <Lazy {...props} />
          </Suspense>
        </CatchBoundary>
      </ClientOnly>
    );
  };
}

type RemoteLoader<P> = () => Promise<{ default: ComponentType<P> }>;

type Options = {
  loading?: ReactNode;
  error?: FunctionComponent<ErrorComponentProps>;
  /** Identifies the error boundary; change it to force a retry. */
  resetKey?: string;
};
