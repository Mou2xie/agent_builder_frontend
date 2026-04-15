# NovaAgent

NovaAgent is a platform for building, configuring, and chatting with AI agents. Users create agents, upload private knowledge documents, set rules and behaviors, then share them via a public chat interface.

## Tech Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite 8** with `@vitejs/plugin-react`
- **Tailwind CSS v4** via `@tailwindcss/vite` — theme tokens in `src/index.css`, no config file
- **Supabase** — auth, Postgres, Storage, Realtime
- **Zustand** — auth state
- **TanStack React Query** — server state
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
VITE_GAG_SERVICE_URL=
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
src/
  main.tsx              # Entry point — router, providers
  index.css             # Tailwind v4 @theme tokens (single source of truth)
  layouts/
    RootLayout.tsx      # Auth bootstrap (Supabase getUser + onAuthStateChange)
    LandingLayout.tsx   # Public landing wrapper
    DashboardLayout.tsx # Sidebar nav for agent config pages
  routes/               # One file per route
  components/           # Shared UI (Modal, Topbar, Navbar, AgentCard, Chatbar, …)
  stores/
    useAuthStore.ts     # Zustand — { user, setUser }
  libs/
    supabaseClient.ts   # Single Supabase client
    avatar.ts           # resolveAvatarUrl() for Supabase Storage paths
```

## Key Flows

### Auth
`RootLayout` calls `supabaseClient.auth.getUser()` on mount and subscribes to `onAuthStateChange`. The user object is stored in `useAuthStore`. `DashboardLayout` redirects to `/login` when no user is present.

### Knowledge Upload
Two-step process — both steps must be preserved:
1. Upload file to Supabase Storage bucket `files` at path `{agentId}/{timestamp}-{filename}`
2. POST to `/api/rag/{agentId}/{filename}/{userId}` (proxied to RAG service via Vercel rewrite) → returns `task_id`
3. Subscribe to Supabase Realtime on `document_tasks` table for status updates (`pending` → `processing` → `completed` | `failed`)

### Chat
Uses `@ai-sdk/react` `useChat` with `DefaultChatTransport`. Chat endpoint is `{VITE_CHAT_API}/{agentId}`. Accessible at `/chat/:id` without auth guard (public-facing).

## Vercel Proxy

`vercel.json` rewrites:
- `/api/rag/:path*` → RAG service on Railway
- `/(.*)` → `/index.html` (SPA fallback)

## Design System

See `DESIGN.md` for the full color/shadow specification. Theme tokens live in `src/index.css` under `@theme {}`.

- **Fonts**: Inter (body), Comfortaa (headings) via Google Fonts
- **Icons**: lucide-react
- **Page titles**: `<Helmet>` format — `"Page Name - NovaAgent"`
