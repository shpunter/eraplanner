import { applyShareParam } from "./shareState";

// Runs at bundle-eval time — before React renders and before any store
// module calls IDB getItem. If a ?share= param is present, saves the ID
// to sessionStorage and strips the param so the router never sees it.
if (typeof window !== "undefined") {
  applyShareParam();
}
