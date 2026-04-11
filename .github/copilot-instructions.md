# Project Guidelines

## Code Style
- Use TypeScript and the Next.js App Router patterns already used in `src/app`.
- Prefer server components by default; add `use client` only when state, effects, or browser APIs are required.
- Keep UI text in Dutch and code/comments in English.
- Use CSS Modules for page- and component-scoped styling; keep shared global styling in `src/app/globals.css`.
- Match the existing naming and structure conventions in files such as `src/app/layout.tsx`, `src/components/Header/Header.tsx`, and `src/components/common/Form/Form.tsx`.

## Architecture
- Route files, layouts, metadata, API handlers, and server actions live in `src/app`.
- Reusable UI lives in `src/components`, grouped by feature area.
- Data-access and other non-UI logic live in `src/lib`.
- The site fetches content from a WordPress GraphQL backend through `src/lib/graphql/client.ts`; changes there must respect the required `WP_USERNAME`, `WP_PASSWORD`, and `BACKEND_URL` environment variables.
- Public assets live in `public/`.

## Build and Test
- Use `pnpm install` to install dependencies.
- Use `pnpm dev` for local development.
- Use `pnpm build` before shipping non-trivial changes.
- Use `pnpm lint:check` for a non-mutating lint pass.
- Use `pnpm format:check` to verify formatting, or `pnpm format` to apply it.

## Conventions
- Follow the existing component boundaries instead of introducing new abstractions unless there is a clear reuse win.
- Keep page copy concise and aligned with the current Dutch tone.
- Prefer the existing data-fetching and service patterns in `src/lib/graphql/services` and `src/lib/services`.
- Preserve accessibility and navigation behavior when changing interactive UI, especially in the header and form flows.
- Refer to `README.md` for project setup and high-level repository context instead of duplicating that material here.