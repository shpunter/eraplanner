import { BehaviorSubject, Subject } from "rxjs";

// Shared communication bus between the host app and the federated `resources`
// remote. Host and remote each bundle their own copy of this module, so the
// Subjects are pinned on `globalThis` (both run in the same window) to guarantee
// a single shared instance — there is only ever one bus. `rxjs` is also shared
// as a singleton in vite.config.ts so operators work across the boundary.
//
// To use it from the remote: copy this file into the remote and import from it.
// Keep this module framework-agnostic (no React/DOM imports) so any remote,
// regardless of framework, can import and use it.

const initialState: ResourcesState = {
  down: { historyIDX: 0 },
  up: { history: [] },
};

const g = globalThis as BusGlobal;

if (!g.__resourcesEvents$) g.__resourcesEvents$ = new Subject<ResourcesEvent>();
if (!g.__resourcesState$) {
  g.__resourcesState$ = new BehaviorSubject<ResourcesState>(initialState);
}

/** Event stream — use for transient signals (clicks, intents, notifications). */
export const events$: Subject<ResourcesEvent> = g.__resourcesEvents$;

/** State stream — use for current values that new subscribers should replay. */
export const state$: BehaviorSubject<ResourcesState> = g.__resourcesState$;

/** Publish an event onto the bus. */
export const emit = (event: ResourcesEvent): void => events$.next(event);

/**
 * Push state DOWN: host → remote. Merges into the `down` slice, leaving
 * `up` and any untouched `down` fields intact.
 */
export const patchDown = (patch: Partial<ResourcesState["down"]>): void => {
  const prev = state$.getValue();
  state$.next({ ...prev, down: { ...prev.down, ...patch } });
};

/**
 * Push state UP: remote → host. Merges into the `up` slice, leaving
 * `down` and any untouched `up` fields intact.
 */
export const patchUp = (patch: Partial<ResourcesState["up"]>): void => {
  const prev = state$.getValue();
  state$.next({ ...prev, up: { ...prev.up, ...patch } });
};

/** Fire-and-forget events. Extend this union as the contract grows. */
export type ResourcesEvent =
  | { type: "resources:reset-all" }
  | { type: "resources:ready" }
  | {
      type: "resources:add";
      payload: { resource: ResourceType; historyIDX: number };
    };

/** Shared, replayable state. Late subscribers immediately get the latest value. */
export type ResourcesState = {
  down: {
    historyIDX: number;
  };
  up: {
    /** Resource pickups per timeline day (index = historyIDX). */
    history: ResourceType[][];
  };
};

export type ResourceType =
  | "gold"
  | "wood"
  | "ore"
  | "crystals"
  | "gems"
  | "mercury"
  | "dust";

// Pin the streams on globalThis so host and remote share one instance even
// though each bundles its own copy of this module.
type BusGlobal = typeof globalThis & {
  __resourcesEvents$?: Subject<ResourcesEvent>;
  __resourcesState$?: BehaviorSubject<ResourcesState>;
};
