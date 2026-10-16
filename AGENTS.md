# AGENTS.md

## Project

Nextflix — movie/TV streaming frontend built on Next.js 15 (App Router) using TMDB API data and embedded playback. Dark, Netflix-style UI with auth, library (watchlist/favorites/history), search, and series season/episode navigation.

## Commands

- `npm run dev` — start dev server with **Turbopack** (`next dev --turbopack`)
- `npm run build` — production build with **Turbopack** (`next build --turbopack`)
- `npm run start` — run production server (`next start`)
- `npm run lint` — ESLint (next/core-web-vitals + next/typescript)

**Verification**: There is **no `typecheck` or `test` script**. Use `npx tsc --noEmit` for type checking. `npm install` also runs `prisma generate` via `postinstall`.

## Environment

Copy `.env.exapmle` (filename has a typo) to `.env`. Required: `TMDB_API_TOKEN`, `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`. Optional: `NEXT_PUBLIC_SITE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_DOMAIN`. Without `RESEND_API_KEY`, OTP emails are logged to the server console in dev. `TMDB_API_TOKEN` is read server-side via `utils/http.ts` (Bearer auth).

## Architecture

- **App Router** with route group `(root)` wrapping pages in Header/Footer; `(auth)` for auth pages.
- **Server components by default**; client components opt in with `"use client"`.
- **TMDB data layer**: `data/tmdb.ts` uses `import "server-only"` and must not be imported from client components. All TMDB calls use `utils/http.ts` (axios, retries on network/5xx errors, 30s timeout, Bearer token).
- **Auth**: `better-auth` with Prisma adapter (`lib/auth.ts`), email+password, email OTP plugin (6-digit, 300s), Google OAuth conditional on env vars, cookie session cache (5 min), and `nextCookies()` plugin. OTP emails sent via `lib/email.tsx` (Resend + React Email; falls back to console in dev).
- **Database**: Prisma 7 + PostgreSQL. Client is generated to `generated/prisma` (custom output in `prisma/schema.prisma`) and used via `lib/prisma.ts` with `@prisma/adapter-pg`. Models: `User`, `UserMedia` (enum `MediaKind`: WATCHLIST, FAVORITE, HISTORY), `Session`, `Account`, `Verification`. `UserMedia` has unique `[userId, mediaType, mediaId, kind]` and index `[userId, kind, updatedAt]`.
- **Server actions**: `lib/revalidate-path.ts` exports `revalidateMyPath` as `"use server"` and is invoked from client code (`SeriesStreamingController`) — do not remove `"use server"`. Library actions live in `lib/library-actions.ts`.
- **Edge API routes**: `app/api/streaming/serie/[id]/season/route.ts` (fetches episodes per season), `app/api/search/route.ts` (multi-search). Both use `export const runtime = "edge"`. Keep edge-compatible.

### Route structure (high-signal)

```
app/
  (root)/
    page.tsx              — landing (hero, now playing, top 5, discovery)
    movies/page.tsx       — movies listing
    movies/[id]/page.tsx  — movie detail + embedded player
    series/page.tsx       — series listing
    series/[id]/page.tsx  — series detail + season/episode selector + player
    profile/page.tsx      — profile: History/Watchlist/Favorites/Settings
  (auth)/
    sign-in/, sign-up/    — auth pages (email+password, OTP, Google)
  api/
    auth/[...all]/route.ts        — better-auth catch-all
    search/route.ts               — search API (edge)
    library/history/route.ts      — history endpoints
    streaming/serie/[id]/season/route.ts — season episodes (edge)
```

### Key directories

- `components/ui/` — shadcn/ui primitives (new-york style). Add via `npx shadcn@latest add <name>`. `cn()` helper in `lib/utils.ts`.
- `components/blocks/` — composite blocks (e.g. `billed-cast.tsx`)
- `components/features/` — feature components (library, search, trailer, forms)
- `components/layout/` — Header, Footer
- `app/(root)/movies/_components/` — page-level components shared by movies and series (hero, slides, cover, top-five)
- `data/tmdb.ts` — all TMDB fetchers (`import "server-only"`)
- `utils/http.ts` — TMDB axios client + retry interceptor
- `utils/getGenre.ts` — genre lookup via `constant/index.tsx`
- `types/tmdb.ts` — TMDB TypeScript types
- `constant/index.tsx` — genre ID maps for `movies` and `series`
- `lib/` — auth, prisma, email, blur placeholders, server actions, site config
- `generated/prisma/` — generated Prisma client (custom output)
- `prisma/` — `schema.prisma`, migrations

## Key conventions

- **Path alias**: `@/*` → project root (see `tsconfig.json`).
- **shadcn/ui**: new-york style, neutral base, CSS variables. Theme configured in `app/globals.css` with `@theme inline`. Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config.js`).
- **Images**: allowed remote hosts in `next.config.ts`: `image.tmdb.org`, `media.themoviedb.org`, `api.dicebear.com`, `lh3.googleusercontent.com`. Formats AVIF/WebP, device/image sizes set, `minimumCacheTTL: 604800`.
- **nuqs** for URL query state (season/episode selectors on series detail).
- **Dark theme only**: `suppressHydrationWarning` on `<html>` and `<body>`; `next-themes` present but no toggle currently.
- **Animations**: Framer Motion + Swiper 11. `prefers-reduced-motion` supported.
- **Prisma**: custom client output `../generated/prisma`; use `@prisma/adapter-pg` with `DATABASE_URL`. Migrations via `npm run db:migrate` (`prisma migrate dev`). `prisma7.config.ts` exists.
- **browserslist** targets modern browsers (Chrome/Edge/Firefox >=111, Safari >=16.4).

## Gotchas (must know)

- **Shared components across media types**: Series detail (`series/[id]`) fetches with type `"tv"` but shares UI from `app/(root)/movies/_components/`. Do not assume those components are movie-only.
- **Server-only TMDB layer**: `data/tmdb.ts` is `server-only` — never import into client components.
- **Async params (Next.js 15)**: Page components receive `params` as `Promise<{ id: string }>`; always `await params`.
- **Edge runtime APIs**: `search` and `serie/[id]/season` are edge. Keep logic simple, avoid Node-only APIs.
- **Server action used from client**: `revalidateMyPath` must remain `"use server"`. It’s called client-side by `SeriesStreamingController`.
- **TMDB `getDiscover`**: landing page passes `null` genre; it’s not exported in all contexts — check existing usage before changing signature/exports.
- **Genre lookup**: `utils/getGenre.ts` expects `type: 'movies' | 'series'` and reads from `GENRES` in `constant/index.tsx`.
- **Better Auth schema**: Prisma schema is tailored to better-auth (tables `user`, `session`, `account`, `verification` with specific fields). Do not rename columns/tables without matching auth config.
- **Prisma adapter + generated client**: Uses `@prisma/adapter-pg` and imports from `@/generated/prisma/client`. Ensure `prisma generate` has run (postinstall).
- **Retry logic**: TMDB client retries on ECONNRESET/ECONNABORTED/ETIMEDOUT, 5xx, or network errors (no response) up to 2 times with backoff.
- **Type checking only via tsc**: No Jest/Vitest/Cypress configured; rely on `npx tsc --noEmit` and `npm run lint`.
