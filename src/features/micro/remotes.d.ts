// Type declarations for Module Federation remotes consumed by this host.
// The `micro` remote is configured in vite.config.ts and is expected to expose
// a default-exported React component under `./App`.
declare module "micro/App" {
  import type { ComponentType } from "react";
  const App: ComponentType;
  export default App;
}
