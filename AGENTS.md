# AGENTS

## Commands
- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint` (ESLint with typescript-eslint + react-hooks + react-refresh)
- Build + typecheck: `npm run build` (runs `tsc -b` then Vite build — use this to verify types)
- No test suite exists

## Environment
All env vars are Vite-prefixed, read via `import.meta.env` from `.env` (gitignored):
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` — Supabase anon/public key
- `VITE_CHAT_API` — Base URL for the AI chat backend (used by `@ai-sdk/react` `useChat`)
- `VITE_GAG_SERVICE_URL` — RAG/vectorization service base URL
- `VITE_SERVICE_API_KEY` — API key sent as `X-API-Key` header to RAG service

App will break at runtime without these. Changes that add new env vars must also update `src/libs/supabaseClient.ts` or the consuming component.

## Architecture
Single-package SPA (no monorepo). Deployed on Vercel.

```
src/
  main.tsx          # Entry point, router, providers (QueryClient, Helmet, BrowserRouter)
  index.css          # Tailwind v4 @theme tokens (the only theme config — no tailwind.config.*)
  layouts/
    RootLayout.tsx   # Auth bootstrap: supabase getUser + onAuthStateChange → Zustand store
    LandingLayout.tsx
    DashboardLayout.tsx  # Sidebar nav for agent config pages
  routes/           # Page components (one file per route)
  components/       # Shared UI (Modal, Topbar, Navbar, AgentCard, Chatbar, InfoTip, RuleCard)
  stores/
    useAuthStore.ts  # Zustand store — { user, setUser }
  libs/
    supabaseClient.ts   # Single Supabase client instance
    avatar.ts           # resolveAvatarUrl() — turns Supabase Storage paths into public URLs
```

**Routing** (in `src/main.tsx`):
- `react-router` v7 (imported from `"react-router"`, NOT `"react-router-dom"`)
- Dashboard routes nest under `/dashboard/agent/:id/` with shared `DashboardLayout`
- Chat is at `/chat/:id` (outside dashboard, no auth guard)

**Auth flow**: `RootLayout` calls `supabaseClient.auth.getUser()` on mount + subscribes to `onAuthStateChange`. User object lives in `useAuthStore`. Pages that need auth read from the store; `DashboardLayout` does a client-side redirect to `/login` if `user` is null.

**Knowledge upload flow** (two-step, must preserve both):
1. File upload → Supabase Storage bucket `"files"` at path `{agentId}/{timestamp}-{filename}`
2. POST to `/api/rag/{agentId}/{filename}/{userId}` (proxied to RAG service via Vercel rewrite) → returns `task_id`
3. Subscribe to Supabase Realtime `postgres_changes` on `document_tasks` table for status updates

## Vercel Proxy
`vercel.json` rewrites `/api/rag/:path*` → `https://agentbuilderragservice-production.up.railway.app/api/:path*`. All other routes fall back to `index.html` (SPA). The RAG service destination URL is hardcoded in `vercel.json`, not env-configured.

## Supabase Tables Referenced in Code
- `agents` — columns: `id`, `name`, `avatar_url`, `status` (`"STANDBY" | "ONLINE"`), `job_description`, `personnel`, `welcome_message`
- `documents` — deleted by `agent_id` + `file_name` when file is removed
- `document_tasks` — Realtime-tracked; columns: `id`, `status` (`pending|processing|completed|failed`)
- Storage buckets: `"avatar"`, `"files"`

## Style Conventions
- Tailwind CSS v4 via `@tailwindcss/vite` plugin. Theme tokens defined in `src/index.css` under `@theme {}` — no config file.
- Design system doc: `DESIGN.md` (Chinese + English, authoritative color/shadow spec).
- Fonts: `Inter` (body), `Comfortaa` (headings), loaded via Google Fonts `@import`.
- Page titles set with `<Helmet>` from `react-helmet-async`, format: `"Page Name - NovaAgent"`.
- Icons from `lucide-react`.
- No code comments in the codebase — match this convention.

## Gotchas
- `react-router` imports come from `"react-router"`, not `"react-router-dom"`. Don't introduce the latter.
- `verbatimModuleSyntax` is enabled in tsconfig — use `import type` for type-only imports.
- `erasableSyntaxOnly` is enabled — no `enum` declarations, use const objects or union types instead.
- `noUnusedLocals` + `noUnusedParameters` are strict — clean up unused vars before building.
- Avatar URLs may be relative Supabase Storage paths; always use `resolveAvatarUrl()` from `src/libs/avatar.ts` rather than using raw `avatar_url` values directly.
