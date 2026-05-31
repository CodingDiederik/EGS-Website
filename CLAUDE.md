# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

EGS (Eerste Goirlese Schaakclub) website — a Next.js 16 App Router site whose content is sourced from a WordPress backend via GraphQL. Deployed on Vercel.

UI copy is in **Dutch**; code, identifiers, and comments are in **English**.

## Commands

Package manager is **pnpm** (declared via `packageManager` in `package.json`; Node ≥ 24 expected).

```bash
pnpm install         # install dependencies
pnpm dev             # local dev server (Next.js)
pnpm build           # production build (run before shipping non-trivial changes)
pnpm start           # serve the production build
pnpm lint            # eslint with --fix
pnpm lint:check      # eslint, no auto-fix
pnpm format          # prettier --write
pnpm format:check    # prettier --check
pnpm copy:env        # cp .env.example .env
```

There is no test runner configured — verify changes by running `pnpm build` and exercising the relevant route in `pnpm dev`.

## Architecture

### Source layout (`src/`)

- `app/` — Next.js App Router. Routes, layouts, `error.tsx`, `not-found.tsx`, server actions (`actions.ts`), and route handlers under `app/api/`.
- `components/` — React components, grouped by feature (`Agenda/`, `Contact/`, `Footer/`, `Fotos/`, `Header/`, `HomePage/`) plus shared bits under `components/common/`.
- `lib/` — Non-UI logic. Two data-fetching surfaces:
  - `lib/graphql/` — WordPress GraphQL client (`client.ts`) and typed services (`services/agenda.ts`, `services/news.ts`, `services/photos.ts`).
  - `lib/filebird/` — REST calls to the WordPress FileBird plugin for photo gallery folders/IDs.
  - `lib/services/` — higher-level page-level fetchers that compose the above (`homepage.ts`, `newsSection.ts`, `gallerySelect.ts`).
- `proxy.ts` — Next.js middleware (matcher `/api/:path*`) that rate-limits API routes via Upstash Redis (sliding window: 2 req / 30s per IP).

The `@/*` path alias maps to `src/*` (see `tsconfig.json`).

### Data flow

All dynamic content comes from a WordPress instance:

- GraphQL endpoint: `fetchGraphQL` in `src/lib/graphql/client.ts` uses HTTP Basic auth with `WP_USERNAME` / `WP_PASSWORD` against `BACKEND_URL`. Callers pass Next.js cache options (`{ next: { revalidate } }` or `cache: 'no-store'`) via the `options` argument.
- FileBird REST endpoints (`src/lib/filebird/photos.ts`) are gated on `WP_FILEBIRD_API_URL` and `WP_FILEBIRD_API_KEY` and use bearer auth.
- The image domain `api.schaakclubegs.nl` is the only allowed remote in `next.config.ts` — add new hosts there if WordPress media moves.

### API routes

- `app/api/submitform/route.ts` — single POST endpoint handling both the contact form and proefles (trial-lesson) form, dispatched on `formName`. Schemas live next to each form (`app/contact/constants.ts`, `app/proefles/constants.ts`) and use Zod. Email is sent via Resend (`RESEND_API_KEY`, `RECEIVER_EMAIL_ADDRESS`). A `website` honeypot field silently short-circuits bots.
- `app/api/cron/keep-alive/route.ts` — Vercel cron (see `vercel.json`, runs weekly) that pings Upstash Redis to keep the free-tier DB warm. Requires `Authorization: Bearer ${CRON_SECRET}`.

Both are protected by the rate limiter in `proxy.ts`.

### Server components & React Compiler

- Default to **server components**; add `'use client'` only when state, effects, or browser APIs are needed.
- `next.config.ts` enables `reactCompiler: true` and `babel-plugin-react-compiler` — don't hand-write `useMemo`/`useCallback` optimisations the compiler will add.
- `output: 'standalone'` is set for the Vercel build.

### Styling

CSS Modules for page- and component-scoped styles; global styles in `src/app/globals.css`. Tailwind v4 is wired up via `@tailwindcss/postcss` (see `postcss.config.mjs`) but used sparingly — match neighbouring components before reaching for new utilities.

## Environment variables

Required (see `.env.example`):

- `BACKEND_URL`, `WP_USERNAME`, `WP_PASSWORD` — WordPress GraphQL
- `WP_FILEBIRD_API_URL`, `WP_FILEBIRD_API_KEY` — photo gallery
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — rate limiter + keep-alive
- `RESEND_API_KEY`, `RECEIVER_EMAIL_ADDRESS` — form submissions
- `CRON_SECRET` — protects the keep-alive route

## Conventions

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
- Pull requests are reviewed by Copilot before merge (the previous SonarQube step has been removed).
- Prefer extending the existing service patterns in `lib/graphql/services` and `lib/services` to introducing new fetching abstractions.
- Keep new pages aligned with the existing Dutch copy and accessibility patterns (especially in `Header/` and form flows).