# AGENTS.md

## Project

Nextflix — movie/TV streaming frontend built on Next.js 15 (App Router) using the TMDB API for data and `vaplayer.ru` for embedded video playback.

## Commands

- `npm run dev` — dev server with **Turbopack** (not webpack)
- `npm run build` — production build
- `npm run lint` — ESLint (next/core-web-vitals + next/typescript)
- `npm run start` — production server

There is **no typecheck or test script**. Use `npx tsc --noEmit` for type checking.

## Environment

Copy `.env.exapmle` (note: the filename has a typo) to `.env` and set `TMDB_API_TOKEN`. The token is read server-side via `utils/http.ts` (axios Bearer auth). The app will fail to load any data without it.

## Architecture

- **App Router** with a `(root)` route group that wraps pages in Header/Footer.
- **Server components by default**. Client components use `"use client"` directive.
- `data/tmdb.ts` — all TMDB data fetching. Marked `import "server-only"`. Must not be imported from client components.
- `utils/http.ts` — axios instance configured for `api.themoviedb.org`.
- `types/tmdb.ts` — TypeScript interfaces for TMDB responses.
- `constant/index.tsx` — genre ID maps for movies and series.
- `lib/revalidate-path.ts` — server action wrapper around `revalidatePath`.
- `app/api/streaming/serie/[id]/season/route.ts` — Edge runtime API route for fetching season episode lists.

### Route structure

```
app/
  (root)/
    page.tsx              — landing/home page
    movies/page.tsx       — movies listing
    movies/[id]/page.tsx  — movie detail + embedded player
    series/page.tsx       — series listing
    series/[id]/page.tsx  — series detail + season/episode selector
    profile/page.tsx      — user profile
  api/streaming/serie/[id]/season/route.ts  — season episodes API
```

### Components

- `components/ui/` — shadcn/ui primitives (new-york style, neutral base color, CSS variables)
- `components/blocks/` — composite blocks (e.g. `billed-cast.tsx`)
- `components/features/` — feature-specific components (e.g. `trailer-popup-button.tsx`)
- `components/layout/` — Header and Footer
- `app/(root)/movies/_components/` — page-level components shared by movies and series (hero, slides, cover, top-five)

## Key conventions

- **shadcn/ui** installed with `new-york` style. Add new components via `npx shadcn@latest add <name>`. Utils live in `lib/utils.ts` (`cn()` helper).
- **nuqs** for URL query state (season/episode selectors on series detail page).
- **Path alias**: `@/*` maps to project root — use `@/components/...`, `@/data/...`, etc.
- **Image domains** allowed in `next.config.ts`: `image.tmdb.org`, `media.themoviedb.org`, `api.dicebear.com`. Add new domains there if needed.
- **Tailwind CSS v4** — configured via PostCSS plugin (`@tailwindcss/postcss`). No `tailwind.config.js`; theme defined in `app/globals.css` using `@theme inline`.
- **Dark theme only** — `suppressHydrationWarning` on `<html>` and `<body>` (uses `next-themes` dep but currently no toggle).
- **Framer Motion / Swiper** used for animations and carousels.

## Gotchas

- Series detail pages fetch data with `"tv"` type but share component code from `movies/_components/`. Don't assume `movies/` components only handle movies.
- The `getDiscover` function in `data/tmdb.ts` is called with `null` genre on the landing page but is not exported as a standalone in all contexts — check existing usage before adding new calls.
- The API route uses `export const runtime = "edge"` — keep it compatible with Edge runtime.
- `revalidateMyPath` is a server action used client-side from `SeriesStreamingController`. It must remain a `"use server"` export.
- `params` in page components is a `Promise<{ id: string }>` (Next.js 15 async params pattern) — always `await params`.
