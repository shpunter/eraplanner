import type { RESOURCE_KEYS } from "./constants";

export type ResourceKey = (typeof RESOURCE_KEYS)[number];
export type ResourceRecord = Record<ResourceKey, number>;
