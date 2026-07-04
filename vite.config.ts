import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { federation } from '@module-federation/vite'

const config = defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // URLs of each remote's `remoteEntry.js`. Provided once the microfrontend is
  // deployed; until then the tab renders its fallback (see Law.tsx / Mines.tsx).
  const lawRemoteEntry = env.VITE_LAW_REMOTE_ENTRY ?? ''
  const minesRemoteEntry = env.VITE_MINES_REMOTE_ENTRY ?? ''
  const resourcesRemoteEntry = env.VITE_RESOURCES_REMOTE_ENTRY ?? ''
  const castlesRemoteEntry = env.VITE_CASTLES_REMOTE_ENTRY ?? ''

  const isLocal = (url: string) => url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')

  // In dev mode, proxy external remotes through the local dev server so the
  // browser fetches remoteEntry.js same-origin, bypassing any CORS issues from
  // duplicate or missing Access-Control-Allow-Origin headers on the remote.
  // Local remotes (localhost) are used directly — no proxy needed, no CORS issue.
  const toDevEntry = (url: string, prefix: string) =>
    isLocal(url) ? url : `http://localhost:3000/${prefix}/remoteEntry.js`

  const lawEntry = command === 'serve' && lawRemoteEntry ? toDevEntry(lawRemoteEntry, 'law-remote') : lawRemoteEntry
  const minesEntry =
    command === 'serve' && minesRemoteEntry ? toDevEntry(minesRemoteEntry, 'mines-remote') : minesRemoteEntry
  const resourcesEntry =
    command === 'serve' && resourcesRemoteEntry
      ? toDevEntry(resourcesRemoteEntry, 'resources-remote')
      : resourcesRemoteEntry
  const castlesEntry =
    command === 'serve' && castlesRemoteEntry ? toDevEntry(castlesRemoteEntry, 'castles-remote') : castlesRemoteEntry

  const proxyEntries = (
    [
      ['law-remote', lawRemoteEntry],
      ['mines-remote', minesRemoteEntry],
      ['resources-remote', resourcesRemoteEntry],
      ['castles-remote', castlesRemoteEntry],
    ] as const
  )
    .filter(([, url]) => url && !isLocal(url))
    .reduce(
      (acc, [prefix, url]) => {
        acc[`/${prefix}`] = {
          target: new URL(url).origin,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(`/${prefix}`, ''),
        }
        return acc
      },
      {} as Record<string, { target: string; changeOrigin: boolean; rewrite: (p: string) => string }>,
    )

  return {
    resolve: { tsconfigPaths: true },
    build: { cssCodeSplit: false },
    server: Object.keys(proxyEntries).length ? { proxy: proxyEntries } : undefined,
    // rxjs is shared/handled by Module Federation. Keep it out of Vite's dep
    // optimizer so it isn't discovered late and trigger a mid-session SSR
    // re-optimize+reload, which re-bundles React and splits it into two server
    // instances (null dispatcher -> "Cannot read properties of null").
    optimizeDeps: { exclude: ['rxjs'] },
    ssr: { optimizeDeps: { exclude: ['rxjs'] } },
    plugins: [
      federation({
        name: 'host',
        // Remote types are declared manually in src/features/*/remotes.d.ts,
        // so the auto type-hint plugin (and its dev-time warning) isn't needed.
        dts: false,
        remotes: {
          law: {
            type: 'module',
            name: 'law',
            entry: lawEntry,
            entryGlobalName: 'law',
            shareScope: 'default',
          },
          mines: {
            type: 'module',
            name: 'mines',
            entry: minesEntry,
            entryGlobalName: 'mines',
            shareScope: 'default',
          },
          resources: {
            type: 'module',
            name: 'resources',
            entry: resourcesEntry,
            entryGlobalName: 'resources',
            shareScope: 'default',
          },
          castles: {
            type: 'module',
            name: 'castles',
            entry: castlesEntry,
            entryGlobalName: 'castles',
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
