import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// `#/*` -> `./src/*`, matching the tsconfig path alias
const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  resolve: {
    alias: [{ find: /^#\//, replacement: `${src}/` }],
  },
  test: {
    environment: "jsdom",
    // unit tests only — keep Playwright's e2e/*.spec.ts out of vitest
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
