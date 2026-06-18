// Fire-and-forget: warm the module federation cache for every remote so
// React.lazy gets a cache hit instead of a network round-trip when the user
// first opens a tab. Errors are swallowed — a missing remote falls back to
// its <NotConfigured /> component as usual.
if (typeof window !== "undefined") {
  void import("law/App").catch(() => {});
  void import("mines/App").catch(() => {});
  void import("resources/App").catch(() => {});
  void import("castles/App").catch(() => {});
}
