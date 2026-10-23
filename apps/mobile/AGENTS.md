# Mobile (`apps/mobile`)

Expo 57 / React Native app. Workspace name: `mobile`. Package manager: Bun. Use `bunx` instead of `npx`.

Repo-wide workflow and git rules live in the root `AGENTS.md`.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json` (this app is SDK **57**).
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v57.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## What this app is

Internium on iOS / Android (and Expo web for smoke checks).

- Entry: `expo-router/entry`. Routes live in `src/app/`.
- Clerk via `@clerk/clerk-expo` + `tokenCache` from `@clerk/clerk-expo/token-cache`. Provider mounts only when `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is set (`src/app/_layout.tsx`).
- Shared backend string today: `welcomeMessage` from `@internium/backend` on the home screen.
- Styling: Uniwind + Tailwind 4. Theme helpers in `src/hooks` / `src/constants/theme.ts`.
- Platform splits exist (`*.web.tsx`) for tabs and icons.

This app does **not** use `@internium/ui` (DOM / Base UI). Do not import it here.

## Commands

From repo root:

```bash
bun run dev --filter=mobile
```

From this directory:

```bash
bunx expo start                 # QR / dev server (also `bun run start`)
bun run android                 # Expo Go / emulator
bun run ios
bun run web
bunx expo lint
bunx tsc --noEmit
bunx expo-doctor
bunx expo install --fix
```

**Always** add native-capable packages with Expo so versions match the SDK:

```bash
bunx expo install <package>
```

Never `bun add` / `npm install` for Expo modules.

EAS (cloud builds, submit, OTA). In this Bun repo:

```bash
bunx eas-cli build
bunx eas-cli submit
bunx eas-cli update
```

Docs: https://docs.expo.dev/eas/index.md

Run lint and typecheck before calling a task done.

## Navigation

- Expo Router only. Every file in `src/app/` is a screen. `_layout.tsx` files are navigators.
- Keep components, hooks, and utils **out** of `src/app/`.
- Import `Link`, `router`, `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, use a development build: `bunx expo run:ios` / `run:android`, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries. Docs: https://docs.expo.dev/versions/latest/index.md
- Backend / Convex changes go in `packages/backend`, then import `@internium/backend`.
