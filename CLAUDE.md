# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## What this is

**Computis** is a full-stack crypto tax & accounting workspace: it ingests wallet/exchange
data, classifies transactions through a rule engine, flags data anomalies, computes capital
gains/losses, and produces audit-ready exports including **IRS Form 8949**.

It is a **single-port full-stack TypeScript app** — a Vite + React 18 SPA on the front end,
with an Express 5 API mounted as Vite middleware in development and deployed as Vercel
functions in production. The project was scaffolded from the "Fusion Starter" template, so
`package.json` still has `"name": "fusion-starter"` — that is expected, not a bug.

## Commands

Use **pnpm** for everything (declared `packageManager: pnpm@10.14.0`, Node `>=18`).

```bash
pnpm install
pnpm dev          # dev server — client + Express API on http://localhost:8080
pnpm build        # full build: build:client (→ dist/spa) + build:server (→ dist/server)
pnpm start        # run the production Node server (node dist/server/node-build.mjs)
pnpm test         # Vitest, single run
pnpm typecheck    # tsc --noEmit
pnpm format.fix   # prettier --write .
```

Before opening a PR, run `pnpm typecheck` and `pnpm format.fix`. There is no lint step and
no CI workflow in-repo, so these two are the local gate.

Maintenance scripts in `scripts/` are run directly (not wired into `package.json`), e.g.
`node scripts/capture-screenshots.mjs` (honors `BASE_URL`, default `http://localhost:8080`)
and `node scripts/check-dpi.mjs`.

## Architecture & layout

```
client/                 # React SPA
├── App.tsx             # createRoot + Providers + the React Router route table
├── global.css          # Tailwind layers + design-token CSS variables (see below)
├── pages/              # Route components — one per route, thin wrappers
├── components/
│   ├── ui/             # shadcn/ui primitives (button, table, dialog, …) — ~51 files
│   ├── layout/         # AppLayout shell + scroll helpers
│   └── <domain>/       # feature components grouped by domain (transactions, rule-engine,
│                       #   data-anomaly-detection, gain-loss, irs-8949, wallet-ingestion,
│                       #   exports, clients, wallets, dashboard, settings, preferences, nav)
├── hooks/              # custom hooks (use-mobile, use-toast, use-gestures, use-long-press)
└── lib/                # utils.ts (cn()), accessibility-utils, responsive-utils, *.spec.ts

server/                 # Express (dev middleware + node build)
├── index.ts            # createServer(): cors + json + urlencoded + /api routes
├── node-build.ts       # production entry (serves dist/spa + API)
└── routes/             # route handlers

api/                    # Vercel serverless entry points (index, ping, demo)
shared/api.ts           # types shared across client & server (import via @shared/api)
```

**Data flow:** `pages/*` are intentionally thin — they mount `AppLayout` and delegate to a
feature "content" component. Follow this pattern:

```tsx
// client/pages/Transactions.tsx
import { AppLayout } from "@/components/layout/AppLayout";
import { TransactionsContent } from "@/components/transactions/transactions-content";

export default function Transactions() {
  return (
    <AppLayout activeItem="Transactions">
      <TransactionsContent />
    </AppLayout>
  );
}
```

Providers live in `client/App.tsx`: `QueryClientProvider` (TanStack Query),
`TooltipProvider`, `Toaster`, and `BrowserRouter`.

## Conventions

- **Path aliases:** `@/*` → `client/*`, `@shared/*` → `shared/*` (in `tsconfig.json` and
  `vite.config.ts`). Always import via aliases, not deep relative paths.
- **File naming:** feature components and hooks use **kebab-case** (`transactions-table.tsx`,
  `use-toast.ts`); page components use **PascalCase** (`Transactions.tsx`).
- **Routing:** add new routes in `client/App.tsx` **above** the catch-all `<Route path="*">`.
- **Styling:** Tailwind CSS 3 utility classes. Compose classes with `cn()` from
  `@/lib/utils` (`clsx` + `tailwind-merge`). Prefer the `ui/` primitives and semantic design
  tokens over hardcoded colors.
- **Design tokens:** defined as **HSL CSS variables** in `client/global.css` under
  "COMPUTIS DESIGN SYSTEM v2.0" and mapped in `tailwind.config.ts`. Use token classes
  (`bg-primary`, `text-warning-text`, `bg-success-bg`, `bg-accent`, …) rather than raw hex.
  The token system, the `Button` primitive, and the global focus ring are considered sound —
  extend them; do not rebuild them.
- **New shadcn primitives:** config is in `components.json` (aliases: `ui` → `@/components/ui`,
  `utils` → `@/lib/utils`). Note it references `client/index.css`, but the actual global
  stylesheet is `client/global.css`.
- **TypeScript:** `strict` is **off** (`strictNullChecks`, `noImplicitAny`,
  `noUnusedLocals`/`Parameters` all disabled). Don't rely on strict-mode guarantees; still,
  keep new code well-typed and use `@shared/api` types across the client/server boundary.
- **Tests:** Vitest, colocated as `*.spec.ts` next to the code (e.g. `client/lib/utils.spec.ts`).
  Test coverage is sparse — add specs alongside new utilities/logic.

## Server / API

- `server/index.ts` exposes `GET /api/ping` (returns `{ message: PING_MESSAGE }`) and
  `GET /api/demo` (returns a `DemoResponse` from `shared/api.ts`). In production on Vercel,
  the `api/*.ts` files are the serverless equivalents.
- **Add endpoints sparingly.** Only add a server route when logic must live server-side
  (secrets, private keys, certain DB operations). Prefer keeping logic client-side.
- To add a route: optionally declare a response type in `shared/api.ts`, add a handler in
  `server/routes/`, and register it in `server/index.ts`.

## Config & secrets

- Env vars load from `.env` via `dotenv`. `.env` is for **public** variables only
  (`VITE_`-prefixed values are exposed to the client; `PING_MESSAGE`, `PORT`, `NODE_ENV`).
  **Never commit secrets** — the Vite dev server explicitly denies serving `.env*` and
  `*.{crt,pem}`.
- Deployment target is **Vercel** (`vercel.json`): build `npm run build:client`, output
  `dist/spa`, SPA rewrites for non-`/api` paths, `/api/*` served by functions
  (`maxDuration: 10s`, region `iad1`), plus global security headers. A self-contained Node
  deployment via `pnpm build` + `pnpm start` is also supported.

## Reference docs in this repo

- `README.md` — full project reference (install, routes, API, deployment).
- `COMPUTIS_REBUILD_PLAN.md` — the phase-by-phase refactor execution plan; the authoritative
  guide for in-flight rebuild work. Execute phases in order and run each phase gate. Tags:
  `[VERIFY]`, `[DATA NEEDED]`, `[ASSUMED]`, `[LOCUS UNCONFIRMED]`.
- `AGENTS.md` — generic Fusion Starter template notes; kept for reference but **this
  CLAUDE.md and the README are more accurate** for the Computis-specific state.
- `client/components/layout/README.md` and `z-index-fixes.md` — layout/scroll/z-index notes.

## Notes / gotchas

- `README.md` references a `documentation/` directory that does not currently exist at the
  repo root — treat those references as aspirational.
- `package.json` is `"private": true` with no `license` field and no `LICENSE` file.
- `client/global.css` is the real stylesheet path (not `client/index.css`).
