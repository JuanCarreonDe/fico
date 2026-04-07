# AGENTS.md

## Project Overview
Fico is a personal finance app (Next.js + Supabase). Spanish-language UI.

## Developer Commands

```bash
bun dev      # Start dev server (NOT npm/yarn/pnpm)
bun build    # Production build
bun lint     # Run ESLint
```

No test suite exists. No typecheck script (TS runs via `next build`).

## Architecture

### Route Protection
Auth is handled via `proxy.ts` at root (NOT `middleware.ts`). It intercepts requests and:
- Redirects unauthenticated users to `/login`
- Redirects authenticated users from `/login` to `/account`
- Protected routes: `/account`, `/dashboard`, `/settings`, `/transactions`

### Database Layer (`lib/db/`)
- `client.ts` - Browser client (`createBrowserClient`)
- `server.ts` - Server components client (`createServerClient`)
- `proxy.ts` - Session refresh for middleware
- `cache-client.ts` - Cached server queries using `unstable_cache`

All DB operations go through Supabase RPC functions defined in `database.types.ts`.

### State Management (`lib/store/`)
- `auth-store.ts` - User session (Zustand + persist)
- `transaction-store.ts` - Financial data cache

### Server Actions
Use `"use server"` directive. Found in `actions.ts` files per route:
- `app/login/actions.ts` - login, signup
- `app/accounts/actions.ts` - CRUD for accounts
- `app/transactions/actions.ts` - CRUD for transactions

### UI Components
- shadcn/ui components in `components/ui/`
- Path alias: `@/` maps to project root
- Theme: next-themes with `dark` class strategy

## Key Patterns

- **Path aliases**: Use `@/` for all imports (configured in tsconfig.json)
- **Tailwind v4**: Uses CSS `@import` and `@theme` blocks, NOT `tailwind.config.js`
- **Supabase auth**: Session stored via SSR cookies, refreshed in `proxy.ts`
- **Form validation**: react-hook-form + zod + @hookform/resolvers

## Important Quirks

- `.env.local` contains live Supabase credentials - do not commit
- App language is Spanish (`lang="es"`)
- Mobile-first layout with `h-dvh` (dynamic viewport height)
- `components.json` uses "radix-nova" style variant for shadcn
