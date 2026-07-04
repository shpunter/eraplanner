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
  useEffect,
} from "react";

export function CreateRemoteComponent<P extends object>(
  load: RemoteLoader<P>,
  { loading = null, error, resetKey = "remote", onError }: Options = {},
): ComponentType<P> {
  const Lazy = lazy(load);
  const ErrorComponent = onError ? withOnError(error, onError) : error;

  return function RemoteComponent(props: P) {
    return (
      <ClientOnly fallback={loading}>
        <CatchBoundary
          getResetKey={() => resetKey}
          errorComponent={ErrorComponent}
        >
          <Suspense fallback={loading}>
            <Lazy {...props} />
          </Suspense>
        </CatchBoundary>
      </ClientOnly>
    );
  };
}

// Wraps the error component so `onError` fires once when the boundary catches.
function withOnError(
  Inner: FunctionComponent<ErrorComponentProps> | undefined,
  onError: () => void,
): FunctionComponent<ErrorComponentProps> {
  const Fallback: FunctionComponent<ErrorComponentProps> =
    Inner ?? (() => null);
  return function ErrorWithSignal(props) {
    useEffect(() => {
      onError();
    }, []);
    return <Fallback {...props} />;
  };
}

type RemoteLoader<P> = () => Promise<{ default: ComponentType<P> }>;

type Options = {
  loading?: ReactNode;
  error?: FunctionComponent<ErrorComponentProps>;
  resetKey?: string;
  /** Called once when the remote fails to load — use to clear per-tab loading state. */
  onError?: () => void;
};
