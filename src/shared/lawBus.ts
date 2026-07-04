import { BehaviorSubject, Subject } from "rxjs";

// Shared communication bus between the host app and the federated `law`
// remote. Host and remote each bundle their own copy of this module, so the
// Subjects are pinned on `globalThis` (both run in the same window) to guarantee
// a single shared instance — there is only ever one bus. `rxjs` is also shared
// as a singleton in vite.config.ts so operators work across the boundary.
//
// To use it from the remote: copy this file into the remote and import from it.
// Keep this module framework-agnostic (no React/DOM imports) so any remote,
// regardless of framework, can import and use it.

const initialState: LawState = {
  down: {
    faction: "hive",
    historyIDX: 0,
    resLaw: 0,
  },
  up: { resource: [], mine: [], history: [], hydrated: false },
};

const g = globalThis as BusGlobal;

if (!g.__lawEvents$) g.__lawEvents$ = new Subject<LawEvent>();
if (!g.__lawState$) {
  g.__lawState$ = new BehaviorSubject<LawState>(initialState);
}

/** Event stream — use for transient signals (clicks, intents, notifications). */
export const events$: Subject<LawEvent> = g.__lawEvents$;

/** State stream — use for current values that new subscribers should replay. */
export const state$: BehaviorSubject<LawState> = g.__lawState$;

/** Publish an event onto the bus. */
export const emit = (event: LawEvent): void => events$.next(event);

/**
 * Push state DOWN: host → remote. Merges into the `down` slice, leaving
 * `up` and any untouched `down` fields intact.
 */
export const patchDown = (patch: Partial<LawState["down"]>): void => {
  const prev = state$.getValue();
  state$.next({ ...prev, down: { ...prev.down, ...patch } });
};

/**
 * Push state UP: remote → host. Merges into the `up` slice, leaving
 * `down` and any untouched `up` fields intact.
 */
export const patchUp = (patch: Partial<LawState["up"]>): void => {
  const prev = state$.getValue();
  state$.next({ ...prev, up: { ...prev.up, ...patch } });
};

/** Fire-and-forget events. Extend this union as the contract grows. */
export type LawEvent =
  | { type: "law:reset-curr-day" }
  | { type: "law:reset-all" }
  | { type: "law:ready" }
  | { type: "law:count-changed"; payload: { count: number } }
  | { type: "law:action"; payload: { name: string; data?: unknown } };

/** Shared, replayable state. Late subscribers immediately get the latest value. */
export type LawState = {
  down: {
    faction: Faction;
    historyIDX: number;
    resLaw: number;
  };
  up: {
    resource: { resID: string; amount: number }[][];
    mine: { resID: string; amount: number }[][];
    history: string[][];
    /** True once the remote has finished loading its persisted state from IDB. */
    hydrated: boolean;
  };
};

// Pin the streams on globalThis so host and remote share one instance even
// though each bundles its own copy of this module.
type BusGlobal = typeof globalThis & {
  __lawEvents$?: Subject<LawEvent>;
  __lawState$?: BehaviorSubject<LawState>;
};

export type Faction =
  | "hive"
  | "schism"
  | "temple"
  | "dungeon"
  | "grove"
  | "necropolis";
