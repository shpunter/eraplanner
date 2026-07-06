import { applyShareHash } from "./shareState";

// Runs at bundle-eval time — before React renders and before any store
// module calls IDB getItem. If a share hash is present, writes IDB then
// navigates to the hash-free URL so all stores hydrate from the new data.
if (typeof window !== "undefined") {
  applyShareHash();
}
