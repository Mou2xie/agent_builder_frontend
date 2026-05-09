# AGENTS

## Commands
- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint` (ESLint with typescript-eslint + react-hooks + react-refresh)
- Build + typecheck: `npm run build` (runs `tsc -b` then Vite build — use this to verify types)
- Preview production build: `npm run preview`
- **No test suite.** No CI configs, no pre-commit hooks, no `opencode.json`.

## Environment
All env vars are Vite-prefixed, read via `import.meta.env` from `.env` (gitignored):
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` — Supabase anon/public key
- `VITE_CHAT_API` — Base URL for the AI chat backend (appended with `/{agentId}`)
- `VITE_SERVICE_API_KEY` — API key sent as `X-API-Key` header to RAG service

App will break at runtime without these. `VITE_RAG_SERVICE_URL` in `.env` is dead (no code references it). README lists `VITE_GAG_SERVICE_URL` (typo, not a real var).

## Architecture
Single-package SPA, deployed on Vercel.

```
src/
  main.tsx          # Entry — router, providers (QueryClient, Helmet, BrowserRouter)
  index.css         # Tailwind v4 @theme tokens — source of truth for design tokens
  layouts/
    RootLayout.tsx   # Auth bootstrap: supabase getUser + onAuthStateChange → Zustand store
    LandingLayout.tsx # Public landing wrapper (renders Navbar + <Outlet>)
    DashboardLayout.tsx # Sidebar nav for agent config pages + Topbar
  routes/           # One file per route (10 pages)
  components/       # Shared UI: Modal, Topbar, Navbar, AgentCard, Chatbar, InfoTip, RuleCard
  stores/
    useAuthStore.ts # Zustand — { user, setUser }
  libs/
    supabaseClient.ts # Single Supabase client instance
    avatar.ts         # resolveAvatarUrl() — resolves Supabase Storage paths to public URLs
```

**DESIGN.md vs code**: `DESIGN.md` is stale (tailwind.config.js era, different colors). **`src/index.css` `@theme {}` is the actual source of truth** — e.g. `--color-primary: #636797` not `#7776AB`. No tailwind.config.js; Tailwind v4 reads `@theme {}` via `@tailwindcss/vite` plugin.

**Assets**: `public/default-avatars/*.png` → root-relative URLs (no import). `src/assets/*` → imported as modules. `favicon.svg` in `public/`.

**Routing** (`src/main.tsx`, react-router v7 from `"react-router"`):
- `/` → IndexPage (landing)
- `/login`, `/signup` — no `LandingLayout` wrapper (standalone)
- `/dashboard/agent-list` — agent list + create
- `/dashboard/agent/:id/{personnel,knowledge,rule,behavior,share}` — nested under `DashboardLayout`
- `/chat/:id` — public chat, no auth guard

**Auth flow**: `RootLayout` calls `supabaseClient.auth.getUser()` on mount + subscribes to `onAuthStateChange`. User in `useAuthStore`. `DashboardLayout` redirects to `/login` if `user` is null.

**Knowledge upload flow** (three-step, must preserve all):
1. Upload file to Supabase Storage bucket `"files"` at path `{agentId}/{Date.now()}-{filename}`
2. POST to `/api/rag/{agentId}/{filename}/{userId}` (proxied via Vercel rewrite, `X-API-Key` header) → returns `task_id`
3. Subscribe to Supabase Realtime `postgres_changes` on `document_tasks` table for status updates (`pending` → `processing` → `completed` | `failed`)
- Displayed name (UI) strips the timestamp prefix via `.split("-").slice(1).join("-")`
- Deletion: removes from Storage, then deletes from `documents` table by `agent_id` + `file_name`

**Chat** (`/chat/:id`): Uses `@ai-sdk/react` `useChat` with `DefaultChatTransport`. Endpoint: `{VITE_CHAT_API}/{agentId}`. Public (no auth). Shows welcome message when agent is ONLINE and no messages exist. Disabled when agent is OFFLINE.

## Vercel Proxy
`vercel.json` rewrites `/api/rag/:path*` → RAG service on Railway (hardcoded URL). All other routes → `/index.html` (SPA fallback).

## Supabase Tables
- `agents` — columns: `id`, `user_id`, `name`, `avatar_url`, `status` (`"STANDBY"|"ONLINE"`), `theme_color`, `tone` (`"professional"|"casual"|"neutral"`), `job_description`, `personnel`, `goals`, `welcome_message`, `rules` (JSON: `{id, keywords[], response, paused, strict}[]` where `strict: true` = override system message, `strict: false` = append context)
- `documents` — columns: `agent_id`, `file_name` (used for delete-by-agent+file queries)
- `document_tasks` — Realtime-tracked; columns: `id`, `status` (`pending|processing|completed|failed`)
- Storage buckets: `"avatar"`, `"files"`

## Style Conventions
- Tailwind v4 via `@tailwindcss/vite`. Theme tokens in `index.css` `@theme {}`. No config file.
- Fonts: Inter (body), Comfortaa (headings), loaded via Google Fonts `@import` in `index.css`.
- Page titles: `<Helmet>` format `"Page Name - NovaAgent"`.
- Icons: `lucide-react`.
- Custom CSS: `clamp-1-fixed`, `clamp-2-fixed` (text truncation for AgentCard).
- No code comments anywhere — match this convention.

## Gotchas
- `react-router` imports from `"react-router"`, NOT `"react-router-dom"`.
- `verbatimModuleSyntax` on → use `import type` for type-only imports.
- `erasableSyntaxOnly` on → no `enum`, use const objects / union types.
- `noUnusedLocals` + `noUnusedParameters` strict — clean up unused vars before build.
- Avatar URLs may be relative Supabase Storage paths; always use `resolveAvatarUrl()`.
- File upload accept: knowledge page → `.pdf,.txt,.docx,.md,.markdown`; avatar → `.png,.jpg,.jpeg,.svg`.
- Default avatars: `/default-avatars/{shamshad,xie,lu,sam,anton}.png` (hardcoded root-relative in agent-list.tsx).
- `qrcode.react` (`QRCodeSVG`) is used only on the share page.
- Navbar has a "Nova Assistant" outline button linking to an external chat URL (visible to all users).
- Sidebar uses `Goal` icon for the `/rule` route — searching for "goal" won't find rule logic.
