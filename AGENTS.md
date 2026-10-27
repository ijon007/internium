# Internium

Internship / dual-education platform. Bun workspaces + Turborepo.

Read this file first. Then read `apps/<name>/AGENTS.md` for the app you are changing.

## Layout

```
apps/web          Next.js 16 (App Router) — primary product UI
apps/mobile       Expo 57 / React Native — Expo Router
apps/desktop      Electron + electron-vite + React
packages/backend  Convex backend + shared JS exports (`@internium/backend`)
packages/ui       shared web UI kit (`@internium/ui`) — Base UI / shadcn
```

Workspace names match `package.json` `"name"`: `web`, `mobile`, `desktop`, `@internium/backend`, `@internium/ui`.

## How the pieces fit

- **Auth is Clerk.** Web uses `@clerk/nextjs`, mobile `@clerk/clerk-expo` (secure token cache), desktop `@clerk/clerk-react`. Providers wrap the app only when a publishable key is set, so local UI still boots without Clerk env.
- **Data will live in Convex** (`packages/backend/convex`). Schema is empty today. Clients should talk to Convex through `@internium/backend`, not by reaching into `convex/` from an app.
- **Web and desktop share `@internium/ui`.** Mobile does not — it uses Expo / Uniwind / React Native primitives. Do not import `@internium/ui` into mobile.
- **Roles** (`admin`, `coordinator`, `teacher`, `student`, `business-mentor`) drive the web dashboard nav and routes under `/dashboard/<role>/...`. Role today is inferred from the URL (`getRoleFromPathname`), defaulting to `student`.
- **Install once at the repo root.** `bun install` links all workspaces. Do not run a second package manager.

## Tooling

| Thing | What we use |
| --- | --- |
| Runtime / package manager | Bun (`bun.lock`) |
| Monorepo tasks | Turborepo (`turbo.json`) |
| Lint / format (repo + web) | Biome (`biome.json`) |
| Desktop lint / format | ESLint + Prettier (local to `apps/desktop`) |
| Types | TypeScript per package |

Root scripts:

```bash
bun install                 # install all workspaces
bun run dev                 # turbo: start every package that has a `dev` script
bun run build               # turbo: build (depends on `^build`)
bun run lint                # biome check .
bun run format              # biome format --write .
```

Target one workspace:

```bash
bun run dev --filter=web
bun run dev --filter=mobile
bun run dev --filter=desktop
bun run build --filter=web
```

Add a dependency to a workspace (not the root) unless it is truly repo-wide:

```bash
bun add <pkg> --filter=web
bunx expo install <pkg>     # from apps/mobile — always, never bun add for native modules
```

Convex (from `packages/backend`):

```bash
bunx convex dev             # generate types + push schema/functions
bunx convex deploy          # production
```

## Env keys

Do not commit secrets. Typical public keys:

- Web: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Mobile: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Desktop: `VITE_CLERK_PUBLISHABLE_KEY`
- Convex / Clerk secret keys live in Convex / Clerk dashboards and local `.env` files ignored by git

## Rules for agents

- Shortest working change. Reuse helpers already in the package you are in.
- Do not invent a new shared abstraction or a new dependency unless asked.
- Web UI components that must be shared with desktop go in `packages/ui`. Web-only product UI stays in `apps/web`.
- Backend tables and mutations go in `packages/backend/convex`. Keep `packages/backend/src` as the public TS surface apps import.
- Never edit generated Convex files under `packages/backend/convex/_generated`.
- Never hand-edit mobile `ios/` or `android/` if they appear — Continuous Native Generation. Configure via `app.json` and Expo config plugins.
- Keep the Next.js block at the top of `apps/web/AGENTS.md`. `next dev` rewrites it if you delete it.

## Git workflow

`master` is production. `staging` is the integration branch. All work branches off `staging`.

```
master
  └── staging
        ├── feat/<feature-name>
        ├── fix/<fix-name>
        └── chore/<chore-name>
```

### Rules

1. **One thing, one branch.** A new feature, a bugfix, or a chore each gets its own branch. Do not pile unrelated work onto an existing branch.
2. **Always branch from `staging`.** Never branch from `master` for day-to-day work. Never commit directly on `master` or `staging`.
3. **Merge back into `staging`.** Open the PR against `staging`. When staging is ready to ship, `staging` is merged into `master`.
4. **Do not skip the ladder.** Feature → staging → master. No feature-to-master PRs.

### Branch names

kebab-case after the prefix. Match the kind of work:

```
feat/role-picker
fix/sidebar-active-state
chore/agents-md
```

### Commit messages

Same prefixes. Format: `keyword: description` (imperative, why if it is not obvious).

```
feat: add role picker before dashboard
fix: highlight active sidebar item
chore: add AGENTS.md for apps and root
```

Use `feat`, `fix`, or `chore` only. One logical change per commit when practical.

### Typical sequence

```bash
git checkout staging
git pull
git checkout -b feat/feature-name
# ... work ...
git add <files>
git commit -m "feat: short description"
# PR into staging, not master
```

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
