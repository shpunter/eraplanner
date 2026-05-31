export const RESOURCE_KEYS = [
  "gold",
  "wood",
  "ore",
  "crystals",
  "gems",
  "mercury",
  "law",
  "astrology",
  "dust",
] as const;

export type ResourceKey = (typeof RESOURCE_KEYS)[number];
export type ResourceRecord = Record<ResourceKey, number>;
