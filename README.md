# NovaAgent

Build, train, and deploy personalized AI agents — no coding required. Upload private knowledge, set rules and behaviors, then share via a public chat interface.

## Tech Stack

- **React 19** + **TypeScript** (strict mode, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals`)
- **Vite 8** with `@vitejs/plugin-react` and `@tailwindcss/vite`
- **Tailwind CSS v4** — theme tokens in `src/index.css` `@theme {}`, no config file
- **Supabase** — auth, Postgres, Storage, Realtime
- **Zustand** — auth state management
- **TanStack React Query** — server state
- **@ai-sdk/react** + **ai** — chat transport (`useChat` + `DefaultChatTransport`)
- **react-router** v7 (from `"react-router"`, not `"react-router-dom"`)
- **react-helmet-async** — page titles
- **lucide-react** — icons
- **qrcode.react** — QR code generation (share page only)
- **Vercel** — deployment with API proxy rewrites

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env` file (gitignored):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
VITE_CHAT_API=
VITE_SERVICE_API_KEY=
```

The app requires all four values at runtime.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then Vite production build |
| `npm run lint` | ESLint (typescript-eslint, react-hooks, react-refresh) |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
  main.tsx               # Entry — router, providers
  index.css              # Tailwind v4 @theme tokens (source of truth)
  assets/                # Imported images (hero, icons, avatars, logo)
  layouts/
    RootLayout.tsx       # Auth bootstrap (getUser + onAuthStateChange)
    LandingLayout.tsx    # Public wrapper (Navbar + <Outlet>)
    DashboardLayout.tsx  # Sidebar nav + Topbar for agent config pages
  routes/                # 10 page components, one per route
  components/            # Modal, Topbar, Navbar, AgentCard, Chatbar, InfoTip, RuleCard
  stores/                # useAuthStore (Zustand)
  libs/                  # supabaseClient, resolveAvatarUrl
public/
  default-avatars/       # Static PNGs (root-relative URLs, no import)
```

## Routes

| Path | Page |
|---|---|
| `/` | Landing (hero, features, use cases, how-it-works, CTA, footer) |
| `/login` | Login |
| `/signup` | Sign up |
| `/dashboard/agent-list` | Agent list + create |
| `/dashboard/agent/:id/personnel` | Agent name, tone, persona config |
| `/dashboard/agent/:id/knowledge` | Document upload (PDF, DOCX, TXT, MD) |
| `/dashboard/agent/:id/rule` | Keyword-triggered rules & guardrails |
| `/dashboard/agent/:id/behavior` | Goals, job description |
| `/dashboard/agent/:id/share` | Public URL + QR code |
| `/chat/:id` | Public chat (no auth guard) |

## Key Flows

### Auth

`RootLayout` calls `supabaseClient.auth.getUser()` on mount and subscribes to `onAuthStateChange`. The user object is stored in `useAuthStore`. `DashboardLayout` redirects to `/login` when no user is present.

### Knowledge Upload

Three-step process — all steps must be preserved:

1. Upload file to Supabase Storage bucket `files` at path `{agentId}/{Date.now()}-{filename}`
2. POST to `/api/rag/{agentId}/{filename}/{userId}` (proxied to RAG service via Vercel rewrite, `X-API-Key` header) → returns `task_id`
3. Subscribe to Supabase Realtime `postgres_changes` on `document_tasks` table for status updates (`pending` → `processing` → `completed` | `failed`)

Displayed filename strips the timestamp prefix. Deletion removes from Storage then deletes from `documents` table by `agent_id` + `file_name`.

### Chat

Uses `@ai-sdk/react` `useChat` with `DefaultChatTransport`. Endpoint is `{VITE_CHAT_API}/{agentId}`. Publicly accessible at `/chat/:id` — no auth required. Shows welcome message when agent is ONLINE and no messages exist. Disabled when agent is OFFLINE.

## Vercel Proxy

`vercel.json` rewrites:
- `/api/rag/:path*` → RAG service on Railway (hardcoded URL, not env-configured)
- `/(.*)` → `/index.html` (SPA fallback)

## Design System

Theme tokens in `src/index.css` under `@theme {}`. `DESIGN.md` is stale (tailwind.config.js era) — refer to `index.css` for actual values.

- **Fonts**: Inter (body), Comfortaa (headings) via Google Fonts `@import`
- **Icons**: lucide-react
- **Page titles**: `<Helmet>` format — `"Page Name - NovaAgent"`
- **Custom utilities**: `.clamp-1-fixed`, `.clamp-2-fixed` (text truncation for AgentCard)

## Landing Page

The landing page (`/`) includes: hero with CTA, "What is NovaAgent" intro, core capabilities, feature overview (6 feature cards), how-it-works steps, use cases, CTA banner, and a footer with contact email and social links (LinkedIn, GitHub, personal website).
