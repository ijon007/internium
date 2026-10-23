# Desktop (`apps/desktop`)

Electron app (electron-vite + React 19 + TypeScript). Workspace name: `desktop`.

Repo-wide workflow and git rules live in the root `AGENTS.md`.

## What this app is

Native shell around the same product idea as web.

Three processes (do not mix their APIs):

| Process | Path | Runs |
| --- | --- | --- |
| Main | `src/main/` | Node / Electron. Windows, menus, IPC. |
| Preload | `src/preload/` | Bridge. Expose a tight `window` API only. |
| Renderer | `src/renderer/` | React UI. No Node, no `electron` imports. |

`src/main/index.ts` creates the `BrowserWindow`, loads the Vite renderer URL in dev, and the built HTML in prod. Preload is attached via `webPreferences.preload`. A sample IPC channel `ping` exists — do not pile product logic onto it; add named channels when you need them.

Renderer (`src/renderer/src/App.tsx`) currently shows `welcomeMessage` from `@internium/ui`. Clerk wraps the tree in `main.tsx` only when `VITE_CLERK_PUBLISHABLE_KEY` is set (`@clerk/clerk-react`).

Share visual primitives with web through `@internium/ui`. Share data / Convex through `@internium/backend`.

## Commands

From repo root:

```bash
bun run dev --filter=desktop
bun run build --filter=desktop
```

From this directory:

```bash
bun run dev              # electron-vite dev (HMR)
bun run start            # electron-vite preview (production bundle)
bun run typecheck        # node + renderer tsconfigs
bun run lint             # eslint --cache .
bun run format           # prettier --write .
bun run build            # typecheck + electron-vite build
bun run build:win        # installer (Windows)
bun run build:mac
bun run build:linux
bun run build:unpack     # unpacked dir, no installer
```

This app still uses ESLint + Prettier, not Biome. Do not run root `biome` expecting it to own desktop style — root Biome ignores `out/` / `dist/` but desktop's own scripts are the source of truth here.

Add renderer/main deps with `bun add <pkg>` in this app (or `--filter=desktop` from root).

## File map

```
src/main/                Electron main process
src/preload/             contextBridge / IPC surface
src/renderer/src/        React app (`@renderer` alias)
electron.vite.config.ts  Vite configs per process
```

## Rules

- Keep Node-only code in main/preload. Renderer stays browser-safe.
- Prefer `@internium/ui` over duplicating web components.
- Do not commit built `out/` artifacts.
- Clerk, Convex, and product features should match web behavior, not invent a second domain model.
