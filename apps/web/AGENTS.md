<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Web (`apps/web`)

Next.js 16 App Router product. Workspace name: `web`. Package manager: Bun.

Repo-wide workflow and git rules live in the root `AGENTS.md`.

## What this app is

Primary Internium UI in the browser:

- Clerk auth (`@clerk/nextjs`). `ClerkProvider` in `src/app/layout.tsx` only mounts when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set.
- Role dashboards under `/dashboard/<role>/...` for `admin`, `coordinator`, `teacher`, `student`, `business-mentor`.
- Shared chrome: `src/app/dashboard/layout.tsx` wraps pages with `@internium/ui` sidebar + header.
- Chat UI lives under `src/components/chat` and `/dashboard/[role]/chat`.
- Landing `/` currently renders `welcomeMessage` from `@internium/ui`. `/sign-in` and `/role` are stubs.

Role is read from the URL (`src/utils/navigation.ts` → `getRoleFromPathname`). Unknown paths fall back to `student`. Nav groups per role are in `src/constants/navigation.ts`.

## Stack that matters here

- Next 16 + React 19, React Compiler on, `cacheComponents` / `partialPrefetching` in `next.config.ts`
- Tailwind 4 via `@tailwindcss/turbopack`
- Biome for lint/format (local `biome.json` plus root Biome)
- Transpiles workspace packages: `@internium/ui`, `@internium/backend`

Import UI from the package, not by copying components:

```ts
import { SidebarProvider } from "@internium/ui/components/sidebar";
```

Web-only product components stay in `src/components`. Put something in `packages/ui` only if desktop will use it too.

## Commands

From repo root (preferred):

```bash
bun run dev --filter=web
bun run build --filter=web
bun run lint
bun run format
```

From this directory:

```bash
bun run dev       # next dev → http://localhost:3000
bun run build     # next build
bun run start     # next start
bun run lint      # biome check
bun run format    # biome format --write
```

Add deps with `bun add <pkg>` in this app (or `bun add <pkg> --filter=web` from root).

## File map

```
src/app/                 App Router routes + layouts
src/app/dashboard/       role dashboards + [role]/chat
src/components/          web-only UI (dashboard, chat)
src/constants/           roles, nav, chat, user
src/hooks/               useCurrentRole, conversations
src/utils/               navigation, chat helpers
src/types/               nav + chat types
src/lib/utils.ts         cn
```

## Rules

- Read Next docs under `node_modules/next/dist/docs/` before using an API you remember from older Next.
- Keep the agent-rules block at the top of this file.
- Do not add `middleware.ts` / `proxy.ts` unless you are actually wiring Clerk route protection.
- Prefer Server Components. Mark `"use client"` only when the file needs browser APIs or client hooks.
- Shared visual primitives → `packages/ui`. Mutations / schema → `packages/backend/convex`.
