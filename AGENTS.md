# AGENTS

## Quick Start
- Use `npm` (repo has `package-lock.json`).
- Install deps: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build/typecheck: `npm run build` (runs `tsc -b` before Vite build)
- Preview production build: `npm run preview`

## Required Environment
- Frontend reads Vite env vars from `.env` via `import.meta.env`.
- Required keys used in code: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, `VITE_CHAT_API`, `VITE_GAG_SERVICE_URL`, `VITE_SERVICE_API_KEY`.

## Repo Shape (single-package app)
- Entry point: `src/main.tsx`.
- Routing is defined directly in `src/main.tsx` using `react-router` imports (not `react-router-dom`).
- Global auth bootstrap is in `src/layouts/RootLayout.tsx` (Supabase `getUser` + `onAuthStateChange`, persisted in Zustand store `src/stores/useAuthStore.ts`).
- Supabase client is centralized in `src/libs/supabaseClient.ts`.

## Styling/Tooling Conventions
- Tailwind CSS v4 is wired through `@tailwindcss/vite` in `vite.config.ts`.
- Theme tokens are defined in `src/index.css` inside `@theme` (no `tailwind.config.*` file in repo).
- TypeScript is strict; project references are used (`tsconfig.app.json` + `tsconfig.node.json`).

## Agent Workflow Notes
- There is no test suite/config in this repo currently; rely on `npm run lint` and `npm run build` for verification.
- App integrates with external services (Supabase + local chat/vector APIs). Prefer mocking/guarding network-dependent logic when making UI-only changes.
- Knowledge upload flow depends on both Supabase Storage and a separate vectorization service callback; changes there should preserve both steps.
