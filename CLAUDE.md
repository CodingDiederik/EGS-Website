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
- `proxy.ts` — Next.js middleware (matcher `/api/:path*`) that rate-limits the form endpoint `/api/submitform` via Upstash Redis (sliding window: 5 req / 60s per IP). It **fails open**: if Upstash is unreachable or its env vars are missing, requests pass through instead of 500ing the forms.

The `@/*` path alias maps to `src/*` (see `tsconfig.json`).

### Data flow

All dynamic content comes from a WordPress instance:

- GraphQL endpoint: `fetchGraphQL` in `src/lib/graphql/client.ts` uses HTTP Basic auth with `WP_USERNAME` / `WP_PASSWORD` against `BACKEND_URL`. Callers pass Next.js cache options (`{ next: { revalidate } }` or `cache: 'no-store'`) via the `options` argument.
- FileBird REST endpoints (`src/lib/filebird/photos.ts`) are gated on `WP_FILEBIRD_API_URL` and `WP_FILEBIRD_API_KEY` and use bearer auth.
- All outbound fetches (GraphQL + FileBird) use a shared `AbortSignal.timeout` (`FETCH_TIMEOUT_MS` in `src/lib/http.ts`) so a slow backend can't hang page rendering.
- Allowed `next/image` hosts live in `src/lib/images.ts` (`ALLOWED_IMAGE_HOSTS`); `next.config.ts` reads that list to build `images.remotePatterns` — add new hosts there if WordPress media moves. Article hero images can come from arbitrary WordPress hosts, so `nieuws/[slug]` falls back to a plain `<img>` (via `isAllowedImageHost`) for any host that isn't configured, rather than letting `next/image` throw.

### API routes

- `app/api/submitform/route.ts` — single POST endpoint handling both the contact form and proefles (trial-lesson) form, dispatched on `formName`. Schemas live next to each form (`app/contact/constants.ts`, `app/proefles/constants.ts`) and use Zod. Both emails (notification + confirmation) are built from the **Zod-validated** data, not the raw form body, so unknown/injected fields never reach the inbox. Email is sent via Resend (`RESEND_API_KEY`, `SENDER_EMAIL_ADDRESS`, `RECEIVER_EMAIL_ADDRESSES`). A `website` honeypot field silently short-circuits bots.
- `app/api/cron/keep-alive/route.ts` — Vercel cron (see `vercel.json`, runs weekly) that pings Upstash Redis to keep the free-tier DB warm. Requires `Authorization: Bearer ${CRON_SECRET}`.

Only `submitform` is rate-limited by `proxy.ts`; the keep-alive route is guarded by `CRON_SECRET` instead.

### SEO & metadata

- Shared SEO config and a `buildMetadata()` helper live in `src/lib/siteConfig.ts`. The root layout (`app/layout.tsx`) sets `metadataBase`, the title template and default OpenGraph/Twitter cards; section pages export `metadata = buildMetadata(...)` and the dynamic routes (`nieuws/[slug]`, `fotos/[id]`) use `generateMetadata`.
- `app/sitemap.ts` and `app/robots.ts` are generated at runtime — don't re-add static `public/sitemap.xml` / `public/robots.txt`, they conflict with the generated routes.

### Security headers

- `next.config.ts` `headers()` sets CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy` on all routes. The CSP is a second layer behind `lib/sanitize.ts` for the WordPress HTML rendered via `dangerouslySetInnerHTML`; it allows `'unsafe-inline'` scripts/styles because Next injects them without a nonce.

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
- `RESEND_API_KEY`, `SENDER_EMAIL_ADDRESS`, `RECEIVER_EMAIL_ADDRESSES` — form submissions
- `CRON_SECRET` — protects the keep-alive route

Optional:

- `NEXT_PUBLIC_SITE_URL` — overrides the canonical site URL used by metadata / sitemap / robots (defaults to `https://jeugd.schaakclubegs.nl`; see `src/lib/siteConfig.ts`).

## Conventions

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
- Pull requests are reviewed by Copilot before merge (the previous SonarQube step has been removed).
- Prefer extending the existing service patterns in `lib/graphql/services` and `lib/services` to introducing new fetching abstractions.
- Keep new pages aligned with the existing Dutch copy and accessibility patterns (especially in `Header/` and form flows).
