import { BehaviorSubject, Subject } from "rxjs";

// Shared communication bus between the host app and the federated `micro`
// remote. Host and remote each bundle their own copy of this module, so the
// Subjects are pinned on `globalThis` (both run in the same window) to guarantee
// a single shared instance — there is only ever one bus. `rxjs` is also shared
// as a singleton in vite.config.ts so operators work across the boundary.
//
// To use it from the remote: copy this file into the remote and import from it.
// Keep this module framework-agnostic (no React/DOM imports) so any remote,
// regardless of framework, can import and use it.

/** Fire-and-forget events. Extend this union as the contract grows. */
export type MicroEvent =
  | { type: "micro:ready" }
  | { type: "micro:count-changed"; payload: { count: number } }
  | { type: "micro:action"; payload: { name: string; data?: unknown } };

/** Shared, replayable state. Late subscribers immediately get the latest value. */
export type MicroState = {
  historyIDX: number;
  resLaw: number;
  laws: {
    resource: { resID: string; amount: number }[][];
    mine: { resID: string; amount: number }[][];
    history: string[][];
  };
};

const initialState: MicroState = {
  historyIDX: 0,
  resLaw: 0,
  laws: { resource: [], mine: [], history: [] },
};

// Pin the streams on globalThis so host and remote share one instance even
// though each bundles its own copy of this module.
type BusGlobal = typeof globalThis & {
  __microEvents$?: Subject<MicroEvent>;
  __microState$?: BehaviorSubject<MicroState>;
};
const g = globalThis as BusGlobal;

if (!g.__microEvents$) g.__microEvents$ = new Subject<MicroEvent>();
if (!g.__microState$) {
  g.__microState$ = new BehaviorSubject<MicroState>(initialState);
}

/** Event stream — use for transient signals (clicks, intents, notifications). */
export const events$: Subject<MicroEvent> = g.__microEvents$;

/** State stream — use for current values that new subscribers should replay. */
export const state$: BehaviorSubject<MicroState> = g.__microState$;

/** Publish an event onto the bus. */
export const emit = (event: MicroEvent): void => events$.next(event);

/** Merge a partial update into the shared state. */
export const patchState = (patch: Partial<MicroState>): void =>
  state$.next({ ...state$.getValue(), ...patch });
