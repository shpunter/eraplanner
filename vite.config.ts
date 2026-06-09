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
  // deployed; until then the `/micro` page renders its fallback (see Micro.tsx).
  const microRemoteEntry = env.VITE_MICRO_REMOTE_ENTRY ?? ''

  return {
    resolve: { tsconfigPaths: true },
    plugins: [
      federation({
        name: 'host',
        // Remote types are declared manually in src/features/micro/remotes.d.ts,
        // so the auto type-hint plugin (and its dev-time warning) isn't needed.
        dts: false,
        remotes: {
          micro: {
            type: 'module',
            name: 'micro',
            entry: microRemoteEntry,
            entryGlobalName: 'micro',
            shareScope: 'default',
          },
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
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
