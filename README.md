# Nextflix

**Watch Movies & TV Series Online** — a dark, Netflix-style streaming frontend built on Next.js 15. Browse trending, now-playing, popular and top-rated titles from **TMDB**, then press play. Account-backed watchlists, favorites and watch history on a redesignable profile page.

Built with the App Router, Tailwind CSS v4 and shadcn/ui. Data comes from the TMDB API; video playback is embedded in-page.

## Features

- **Browse & discover** — trending (week), now playing, popular, top rated, upcoming releases and genre-based discovery carousels for both movies and series.
- **Detail pages** — cinematic hero with backdrop/poster, trailer modal, top-billed cast, reviews, recommendations and similar titles.
- **Series navigation** — season/episode selector driven by URL query state (`?s=&ep=`), next/prev episode with auto season-switching, auto-scroll to the current episode, and an Edge API route that fetches episodes per season.
- **Search** — instant multi-search overlay (movies + TV) backed by an API route.
- **Account system** — sign up / sign in with email + password, **email OTP** (6-digit, 5-minute expiry, Resend transactional emails) and optional **Google OAuth** via better-auth.
- **Library** — toggle watchlist/favorites from any cover, automatic watch history, and a profile page with History / Watchlist / Favorites / Settings tabs.
- **Profile settings** — edit display name, change password, clear library and delete account.
- **Player** — in-page embedded playback; gated behind authentication.
- **Polish** — dark theme only, Framer Motion + Swiper carousels, image blur-load placeholders, skip-to-content link, `prefers-reduced-motion` support, SEO (sitemap, robots, Open Graph, manifest).

## Tech Stack

| Layer      | Choice                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------- |
| Framework  | Next.js 15 (App Router, React 19, Turbopack)                                                 |
| Language   | TypeScript                                                                                   |
| Styling    | Tailwind CSS v4 (PostCSS), CSS variables + `@theme inline`, shadcn/ui (new-york)             |
| Data/API   | TMDB v3 (`data/tmdb.ts`, server-only axios client)                                           |
| Database   | Prisma 7 + PostgreSQL (`@prisma/adapter-pg`), generated client in `generated/prisma`          |
| Auth       | better-auth (email/password, email OTP plugin, Google OAuth, cookie session cache)            |
| Email      | Resend + React Email templates (falls back to console logging in dev)                        |
| UI state   | nuqs (URL query state), react-hook-form + zod                                                |
| Motion     | Swiper 11, Framer Motion                                                                     |

## Screenshots

Drop screenshots into `public/screenshots/` and reference them below:

<!--- 
![Home](public/screenshots/home.png)
![Movie detail](public/screenshots/movie.png)
![Series](public/screenshots/series.png)
![Profile](public/screenshots/profile.png)
--->

## Getting Started

### Prerequisites

- Node.js 20+ (18+ may work; built against 24)
- PostgreSQL database (local or hosted)
- TMDB API read access token — https://www.themoviedb.org/settings/api

### Setup

```bash
# 1. install dependencies
npm install        # also runs `prisma generate` via postinstall

# 2. copy the environment template (note the intentional typo in the filename)
cp .env.exapmle .env

# 3. fill in .env (see table below)

# 4. create the database schema
npm run db:migrate

# 5. start the dev server
npm run dev        # http://localhost:3000
```

### Environment Variables

| Variable                    | Required | Description                                                      |
| --------------------------- | -------- | ---------------------------------------------------------------- |
| `TMDB_API_TOKEN`            | yes      | TMDB v3 API read access token (Bearer).                          |
| `DATABASE_URL`              | yes      | PostgreSQL connection string.                                    |
| `BETTER_AUTH_SECRET`        | yes      | Auth secret, e.g. `openssl rand -base64 32`.                     |
| `BETTER_AUTH_URL`           | yes      | Base URL, e.g. `http://localhost:3000`.                          |
| `NEXT_PUBLIC_SITE_URL`      | no       | Canonical/metadata base URL (defaults to `http://localhost:3000`). |
| `GOOGLE_CLIENT_ID`          | no       | Google OAuth client ID (skips social login if unset).            |
| `GOOGLE_CLIENT_SECRET`      | no       | Google OAuth client secret.                                      |
| `RESEND_API_KEY`            | no       | Resend key for OTP emails (falls back to logging the OTP in dev).|
| `RESEND_FROM_DOMAIN`        | no       | Verified sender domain, e.g. `nextflix.app`.                     |

> Without a `RESEND_API_KEY`, OTP codes are printed to the server console so you can still sign in locally.

## Scripts

| Command                  | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `npm run dev`            | Dev server with **Turbopack**.                     |
| `npm run build`          | Production build.                                  |
| `npm start`              | Run the production build.                          |
| `npm run lint`           | ESLint (next/core-web-vitals + next/typescript).   |
| `npx tsc --noEmit`       | Type checking.                                     |
| `npm run db:migrate`     | Apply Prisma migrations.                           |

## Project Structure

```
app/
  (root)/
    page.tsx               Landing page (hero, now playing, top 5, discovery)
    movies/ page.tsx       Movie listing
    movies/[id]/page.tsx   Movie detail + embedded player
    series/ page.tsx       Series listing
    series/[id]/page.tsx   Series detail + season/episode selector + player
    profile/page.tsx       Profile: history / watchlist / favorites / settings
  (auth)/
    sign-in, sign-up       Auth pages (email + password, OTP, Google)
  api/
    auth/[...all]          better-auth catch-all route
    search/                Search API route
    streaming/serie/[id]/season   Edge runtime season-episodes API
components/
  layout/                  Header, Footer
  ui/                      shadcn/ui primitives
  blocks/                  Composite blocks (billed cast, skeletons)
  features/                Feature components (library, search, trailer, forms)
data/tmdb.ts               TMDB data layer (server-only)
lib/                       auth, prisma, email, server actions, blur placeholders
prisma/schema.prisma       User, UserMedia (WATCHLIST/FAVORITE/HISTORY), Session, Account
```

## Accessibility & Performance

- Server components by default; client components opt in with `"use client"`.
- Skip-to-content link, `main` landmark, labeled controls/carousels, descriptive alt text, `prefers-reduced-motion` support.
- TMDB image loading with Next.js `Image` optimization, `sizes`, `priority` for the LCP hero image and blur placeholders while loading.
- Independent TMDB requests are fired in parallel (`Promise.all`) across landing, listing and detail pages.

## Credits & Disclaimer

- Data courtesy of **The Movie Database (TMDB)** — API and artwork via `image.tmdb.org` / `media.themoviedb.org`.
- Video playback uses third-party hosted embed sources; availability of titles depends on those providers.

> This product uses the TMDB API but is not endorsed or certified by TMDB.