import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { federation } from '@module-federation/vite'

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // URL of the remote's `remoteEntry.js`. Provided once the microfrontend is
  // deployed; until then the law tab renders its fallback (see Law.tsx).
  const lawRemoteEntry = env.VITE_LAW_REMOTE_ENTRY ?? ''

  return {
    resolve: { tsconfigPaths: true },
    // rxjs is shared/handled by Module Federation. Keep it out of Vite's dep
    // optimizer so it isn't discovered late and trigger a mid-session SSR
    // re-optimize+reload, which re-bundles React and splits it into two server
    // instances (null dispatcher -> "Cannot read properties of null").
    optimizeDeps: { exclude: ['rxjs'] },
    ssr: { optimizeDeps: { exclude: ['rxjs'] } },
    plugins: [
      federation({
        name: 'host',
        // Remote types are declared manually in src/features/law/remotes.d.ts,
        // so the auto type-hint plugin (and its dev-time warning) isn't needed.
        dts: false,
        remotes: {
          law: {
            type: 'module',
            name: 'law',
            entry: lawRemoteEntry,
            entryGlobalName: 'law',
            shareScope: 'default',
          },
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
          rxjs: { singleton: true },
        },
      }),
      devtools(),
      cloudflare({ viteEnvironment: { name: 'ssr' } }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
  }
})

export default config
