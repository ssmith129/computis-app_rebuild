# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## What this is

**Computis** is a crypto-tax / digital-asset accounting platform rebuilt as a
full-stack React SPA. The UI covers transactions, wallets & wallet ingestion,
client management, a classification rule engine, anomaly detection, gain/loss
reporting, and IRS Form 8949 generation/export.

It is built on the **Fusion Starter** template (Builder.io): React Router 6 in
SPA mode, an integrated Express server, TypeScript, Vite, TailwindCSS, and a
shadcn/Radix UI component library. The `package.json` name is still
`fusion-starter` — that is the template, not a rename target.

## Tech stack

- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite 7 + TailwindCSS 3
- **UI**: shadcn-style components on Radix UI primitives + Lucide icons; charts via Recharts; some 3D via three / react-three-fiber; animation via framer-motion
- **Backend**: Express 5 (dev middleware + self-hosted Node build) **and** Vercel serverless functions (`api/`)
- **State/data**: TanStack React Query, react-hook-form + Zod
- **Testing**: Vitest
- **Package manager**: pnpm 10 (`packageManager` is pinned). `.npmrc` sets `legacy-peer-deps=true`.

## Commands

```bash
pnpm dev         # Dev server (client + Express) on http://localhost:8080
pnpm build       # Production build: build:client (dist/spa) + build:server (dist/server)
pnpm start       # Run the self-hosted production server (node dist/server/node-build.mjs)
pnpm typecheck   # tsc --noEmit
pnpm test        # Vitest (run mode)
pnpm format.fix  # Prettier write across the repo
```

Tests are colocated as `*.spec.ts` (e.g. `client/lib/utils.spec.ts`). Run a
single file with `pnpm test client/lib/utils.spec.ts`.

There is no ESLint config; **Prettier is the formatter** (`.prettierrc`:
2-space indent, `trailingComma: "all"`). Run `pnpm typecheck` before finishing —
note that `tsconfig.json` is intentionally **loose** (`strict: false`,
`strictNullChecks: false`, no unused checks), so the compiler will not catch
many issues.

## Project structure

```
client/                    # React SPA
├── App.tsx                # Entry point + all route definitions (mounted to #root)
├── global.css             # Tailwind layers + CSS-variable theme/design tokens
├── pages/                 # One component per route (Index.tsx = home/dashboard)
├── components/
│   ├── ui/                # shadcn/Radix component library (~50 primitives) — rarely edit
│   ├── layout/            # AppLayout (sidebar + fixed header shell)
│   ├── nav/               # SideNavigation, NavItem
│   ├── dashboard/         # Dashboard widgets, sidebar, header, menu-config
│   └── <feature>/         # transactions, wallets, wallet-ingestion, clients,
│                          #   rule-engine, irs-8949, gain-loss, exports,
│                          #   data-anomaly-detection, settings, preferences
├── hooks/                 # use-mobile, use-toast, use-gestures, use-long-press
└── lib/                   # utils (cn), accessibility-utils, responsive-utils

server/                    # Express backend
├── index.ts               # createServer(): middleware + /api routes
├── routes/                # Route handlers (e.g. demo.ts)
└── node-build.ts          # Production entry — serves dist/spa + API

api/                       # Vercel serverless functions (separate from server/)
shared/                    # Types shared by client & server (api.ts)
scripts/                   # Playwright/Puppeteer screenshot + insight-capture tools (.mjs)
public/                    # Static assets
```

### Path aliases

- `@/*`  → `client/*`
- `@shared/*` → `shared/*`

Defined in both `tsconfig.json` and `vite.config.ts` — keep them in sync.

## Architecture notes

- **Single-port dev**: `vite.config.ts` mounts the Express app (`createServer()`)
  as Vite middleware, so client and API share port 8080 with full hot reload.
- **Two backend targets** — keep them in mind when adding endpoints:
  - `server/` is the Express app, used for local dev and the self-hosted
    `pnpm start` build.
  - `api/` holds Vercel serverless handlers (`@vercel/node`). Vercel's build
    (`vercel.json` → `npm run build:client`) only builds the SPA; the `api/`
    functions deploy separately. **Adding a route to one does not add it to the
    other** — replicate logic in both if it must work in dev and on Vercel.
- Prefer the client. Only add server/api endpoints when logic genuinely must run
  server-side (secrets, privileged operations).
- Routing: every page is registered in `client/App.tsx`. Add new `<Route>`s
  **above** the catch-all `path="*"` (NotFound).
- Layout: pages render inside `AppLayout` (`components/layout/AppLayout.tsx`),
  which composes the dashboard sidebar + a fixed header that offsets itself based
  on sidebar collapsed/expanded state. The home route (`Index.tsx`) delegates to
  `dashboard/dashboard-layout`.

## Conventions

- **Styling**: TailwindCSS utility classes. The theme/design tokens live as CSS
  variables in `client/global.css` and are wired up in `tailwind.config.ts` —
  edit both when adding theme colors. (Note: `components.json` references
  `client/index.css`, but the real stylesheet is `client/global.css`.)
- **Conditional classes**: use the `cn()` helper from `@/lib/utils` (clsx +
  tailwind-merge), letting callers override via a trailing `className`.
- **Adding UI components**: this is a shadcn project (`components.json`,
  baseColor `slate`, alias `@/components/ui`). Add new primitives via the shadcn
  CLI or by following the existing files in `components/ui/`.
- **Naming**: pages are `PascalCase.tsx`; feature components are mostly
  `kebab-case.tsx`. Match the surrounding folder's style.
- **Shared types**: put cross-boundary types in `shared/api.ts` and import via
  `@shared/api` from both client and server.

## How to add things

**A page/route**
1. Create `client/pages/MyPage.tsx`.
2. Import it in `client/App.tsx` and add `<Route path="/my-page" element={<MyPage />} />` above the `*` route.
3. Wrap content in `AppLayout` for consistent chrome where appropriate.

**An Express API route**
1. (Optional) add the response type to `shared/api.ts`.
2. Add a handler in `server/routes/my-route.ts` (`export const handleX: RequestHandler`).
3. Register it in `server/index.ts` inside `createServer()` (`app.get("/api/...", handleX)`).
4. If it must also work on Vercel, add an equivalent handler under `api/`.

## Deployment

- **Vercel** (primary): config in `vercel.json` — builds `dist/spa`, serves
  `api/**/*.ts` as functions (10s max), SPA rewrites, security headers, and
  long-cache headers for hashed assets. Region `iad1`.
- **Self-hosted Node**: `pnpm build` then `pnpm start` runs
  `dist/server/node-build.mjs`, which serves the built SPA and the Express API.

## Reference docs in this repo

- `AGENTS.md` — original Fusion Starter agent notes (template-level guidance).
- `README.md` / `README_Documentation.md` — project + feature documentation.
- `COMPUTIS_REBUILD_PLAN.md` — rebuild roadmap and phases.
- `client/components/layout/README.md` and `z-index-fixes.md` — layout/stacking notes.
