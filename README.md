# NovaAgent

NovaAgent is a platform for building, configuring, and chatting with AI agents. Users create agents, upload private knowledge documents, set rules and behaviors, then share them via a public chat interface.

## Tech Stack

- **React 19** + **TypeScript** (strict mode, `verbatimModuleSyntax`, `erasableSyntaxOnly`)
- **Vite 8** with `@vitejs/plugin-react`
- **Tailwind CSS v4** via `@tailwindcss/vite` — theme tokens in `src/index.css`, no config file
- **Supabase** — auth, Postgres, Storage, Realtime
- **Zustand** — auth state
- **TanStack React Query** — server state
- **@ai-sdk/react** + **ai** — chat transport (`useChat` with `DefaultChatTransport`)
- **react-router** v7 — routing (imported from `"react-router"`, not `"react-router-dom"`)
- **react-helmet-async** — page titles
- **lucide-react** — icons
- **qrcode.react** — QR code generation (share page only)
- **Vercel** — deployment with API proxy rewrites

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env` file (see `.gitignore` — it's excluded from version control):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
VITE_CHAT_API=
VITE_SERVICE_API_KEY=
```

The app will not run without these values.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then Vite production build |
| `npm run lint` | ESLint (typescript-eslint, react-hooks, react-refresh) |
| `npm run preview` | Preview production build locally |

## Project Structure

```
public/
  favicon.svg
  default-avatars/       # Static assets (root-relative URLs, not imported)
src/
  main.tsx               # Entry point — router, providers
  index.css              # Tailwind v4 @theme tokens (single source of truth)
  assets/                # Imported assets (logo, hero images, avatar PNGs)
  layouts/
    RootLayout.tsx       # Auth bootstrap (Supabase getUser + onAuthStateChange)
    LandingLayout.tsx    # Public landing wrapper
    DashboardLayout.tsx  # Sidebar nav for agent config pages
  routes/                # One file per route
  components/            # Shared UI (Modal, Topbar, Navbar, AgentCard, Chatbar, InfoTip, RuleCard)
  stores/
    useAuthStore.ts      # Zustand — { user, setUser }
  libs/
    supabaseClient.ts    # Single Supabase client
    avatar.ts            # resolveAvatarUrl() for Supabase Storage paths
```

## Routes

| Path | Page |
|---|---|
| `/` | Landing / index |
| `/login` | Login |
| `/signup` | Sign up |
| `/dashboard/agent-list` | Agent list + create |
| `/dashboard/agent/:id/personnel` | Agent personnel config |
| `/dashboard/agent/:id/knowledge` | Knowledge document upload |
| `/dashboard/agent/:id/rule` | Keyword-triggered rules |
| `/dashboard/agent/:id/behavior` | Behavior/tone config |
| `/dashboard/agent/:id/share` | Share + QR code |
| `/chat/:id` | Public chat (no auth guard) |

## Key Flows

### Auth
`RootLayout` calls `supabaseClient.auth.getUser()` on mount and subscribes to `onAuthStateChange`. The user object is stored in `useAuthStore`. `DashboardLayout` redirects to `/login` when no user is present.

### Knowledge Upload
Three-step process — all steps must be preserved:
1. Upload file to Supabase Storage bucket `files` at path `{agentId}/{timestamp}-{filename}`
2. POST to `/api/rag/{agentId}/{filename}/{userId}` (proxied to RAG service via Vercel rewrite, `X-API-Key` header) → returns `task_id`
3. Subscribe to Supabase Realtime `postgres_changes` on `document_tasks` table for status updates (`pending` → `processing` → `completed` | `failed`)

### Chat
Uses `@ai-sdk/react` `useChat` with `DefaultChatTransport`. Chat endpoint is `{VITE_CHAT_API}/{agentId}`. Accessible at `/chat/:id` without auth guard (public-facing).

## Vercel Proxy

`vercel.json` rewrites:
- `/api/rag/:path*` → RAG service on Railway (hardcoded, not env-configured)
- `/(.*)` → `/index.html` (SPA fallback)

## Design System

Theme tokens are defined in `src/index.css` under `@theme {}` (Tailwind v4). `DESIGN.md` describes the original design intent — refer to `index.css` for the actual token values in use.

- **Fonts**: Inter (body), Comfortaa (headings) via Google Fonts `@import` in `index.css`
- **Icons**: lucide-react
- **Page titles**: `<Helmet>` format — `"Page Name - NovaAgent"`
- **Custom utilities**: `.clamp-1-fixed`, `.clamp-2-fixed` (text truncation for AgentCard)
