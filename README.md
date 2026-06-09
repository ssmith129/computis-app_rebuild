# Computis

A full-stack crypto-accounting and tax-reporting web application — ingest wallet data, classify on-chain transactions, detect anomalies, calculate gains/losses, and generate IRS Form 8949 exports from a single dashboard.

> **Note:** The npm package is named `fusion-starter` (the project was scaffolded from the Fusion Starter template), but the application, repository, and product are **Computis**.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Application Routes](#application-routes)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

Computis is a single-page application (SPA) for crypto tax and accounting workflows. It pairs a React 18 front end with an Express API that runs as middleware inside the Vite dev server during development and can be deployed either as a Node server or as Vercel serverless functions.

Key features (derived from the application's routes and component modules):

- **Dashboard** — overview landing page (`client/pages/Index.tsx` → `DashboardLayout`).
- **Transactions** — transaction browsing and classification.
- **Data Anomaly Detection** — surface irregularities in imported data.
- **Wallets & Wallet Ingestion** — manage wallets and import wallet data.
- **Clients** — client/account management (multi-client accounting).
- **Rule Engine** — configurable classification rules.
- **Gain/Loss & IRS 8949** — capital gains calculations and IRS Form 8949 generation.
- **Exports** — export generated reports and data.
- **Settings, Preferences, My Account** — configuration and user settings.
- **Design System Showcase** — internal component/design-token reference (`/design-system`).

The UI is built on a 51-component shadcn/ui + Radix UI library, styled with TailwindCSS and using TanStack Query for data fetching, Recharts for charts, and Framer Motion for animation.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript 5.9 |
| Front end | React 18.3, React Router 6.30 (SPA mode) |
| Build tool | Vite 7.1 (`@vitejs/plugin-react-swc`) |
| Styling | TailwindCSS 3.4, `tailwindcss-animate`, `@tailwindcss/typography` |
| UI components | Radix UI primitives + shadcn/ui (`client/components/ui/`), Lucide React icons |
| Data fetching | TanStack React Query 5 |
| Forms & validation | React Hook Form 7, Zod 3, `@hookform/resolvers` |
| Charts | Recharts 2 |
| Animation | Framer Motion 12 |
| 3D (optional) | Three.js, `@react-three/fiber`, `@react-three/drei` |
| Back end | Express 5, `cors`, `dotenv` |
| Serverless | `@vercel/node`, `serverless-http` |
| Testing | Vitest 3 |
| Image/automation tooling | `sharp`, Playwright, Puppeteer (build-time scripts only) |
| Package manager | pnpm 10.14.0 |

## Prerequisites

- **Node.js** `>= 18.0.0` (declared in `package.json` `engines`).
- **pnpm** `10.14.0` — declared via the `packageManager` field and the preferred package manager for this project. Install with `corepack enable` or `npm install -g pnpm`.

> The repository sets `legacy-peer-deps=true` in `.npmrc`, and `sharp` is listed under `ignoredBuiltDependencies` in `pnpm-workspace.yaml`.

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/ssmith129/computis-app.git
cd computis-app

# 2. Install dependencies (pnpm is preferred)
pnpm install

# 3. Create your environment file (see Configuration below)
#    A starter .env is committed with public defaults.

# 4. Start the dev server (client + API on a single port)
pnpm dev
```

The development server runs on **http://localhost:8080** (configured in `vite.config.ts`).

## Configuration

Environment variables are loaded via `dotenv`. A committed `.env` provides public defaults; do **not** commit secrets — the project convention is to set secret variables through your deployment platform rather than the `.env` file.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `VITE_PUBLIC_BUILDER_KEY` | No | `__BUILDER_PUBLIC_KEY__` | Builder.io public API key. Exposed to the client (Vite `VITE_` prefix). See <https://www.builder.io/c/docs/using-your-api-key>. |
| `PING_MESSAGE` | No | `"ping pong"` (`.env`); falls back to `"ping"` in code | Message returned by the `GET /api/ping` health-check endpoint. |
| `PORT` | No | `3000` | Port for the production Node server (`pnpm start`). Not used by the Vite dev server, which is fixed to `8080`. |

## Usage

Start the application in development:

```bash
pnpm dev
```

Then open **http://localhost:8080**. The Express API is mounted as Vite middleware, so client and API share the same origin and port — no separate backend process is required during development.

Verify the API is responding:

```bash
curl http://localhost:8080/api/ping
# {"message":"ping pong"}

curl http://localhost:8080/api/demo
# {"message":"Hello from Express server"}
```

Type-check and run the test suite before committing:

```bash
pnpm typecheck
pnpm test
```

### Common workflows

- **Add a page route** — create `client/pages/MyPage.tsx`, then register it in `client/App.tsx` above the catch-all `*` route.
- **Add an API route** — add a handler in `server/routes/`, register it in `server/index.ts`, and (optionally) share its response type via `shared/api.ts`.
- **Theme changes** — edit design tokens in `client/global.css` and `tailwind.config.ts`.

See [`AGENTS.md`](./AGENTS.md) for detailed conventions on routing, styling, and shared types.

## Scripts

Defined in `package.json`. Run with `pnpm <script>` (or `npm run <script>`).

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `vite` | Start the Vite dev server with the Express API as middleware (port 8080). |
| `build` | `npm run build:client && npm run build:server` | Full production build (client + server). |
| `build:client` | `vite build` | Build the SPA to `dist/spa`. |
| `build:server` | `vite build --config vite.config.server.ts` | Build the Node server bundle to `dist/server`. |
| `vercel-build` | `npm run build:client` | Client-only build used by Vercel. |
| `start` | `node dist/server/node-build.mjs` | Run the production Node server (serves `dist/spa` + API). |
| `test` | `vitest --run` | Run the Vitest test suite once. |
| `typecheck` | `tsc` | Type-check the project (no emit). |
| `format.fix` | `prettier --write .` | Format all files with Prettier. |

## Project Structure

```
computis-app/
├── client/                     # React SPA front end
│   ├── App.tsx                 # App entry, providers, and React Router routes
│   ├── global.css              # TailwindCSS theming and design tokens
│   ├── pages/                  # Route components (Index.tsx = dashboard)
│   ├── components/             # Feature modules + ui/ (shadcn/Radix library)
│   │   ├── ui/                 # 51 reusable UI primitives
│   │   ├── dashboard/          # Dashboard layout & widgets
│   │   ├── transactions/       # Transaction views
│   │   ├── wallets/ wallet-ingestion/ clients/ ...
│   │   ├── rule-engine/ gain-loss/ irs-8949/ exports/
│   │   ├── data-anomaly-detection/ preferences/ settings/
│   │   ├── layout/ nav/        # Shell, navigation
│   ├── hooks/                  # use-mobile, use-toast, use-gestures, use-long-press
│   └── lib/                    # utils.ts (cn), responsive/accessibility helpers, specs
│
├── server/                     # Express API (dev middleware + prod server)
│   ├── index.ts                # createServer() — middleware + /api routes
│   ├── node-build.ts           # Production server entry (static SPA + API)
│   └── routes/                 # Express route handlers (demo.ts)
│
├── api/                        # Vercel serverless functions
│   ├── index.ts                # API index / endpoint listing
│   ├── ping.ts                 # GET /api/ping
│   └── demo.ts                 # GET /api/demo
│
├── shared/
│   └── api.ts                  # Types shared between client & server
│
├── scripts/                    # Build-time tooling (screenshots, SVG/HTML generation)
├── docs/ documentation/        # Design & refactor documentation
├── public/                     # Static assets
├── index.html                  # SPA HTML shell
├── vite.config.ts              # Vite + Express dev integration (port 8080)
├── vite.config.server.ts       # Server build config
├── tailwind.config.ts          # Tailwind theme
├── components.json             # shadcn/ui configuration
└── vercel.json                 # Vercel deployment config
```

Path aliases (configured in `tsconfig.json` and `vite.config.ts`):

- `@/*` → `client/*`
- `@shared/*` → `shared/*`

## Application Routes

Defined in `client/App.tsx`:

| Path | Page |
| --- | --- |
| `/` | Dashboard (`Index`) |
| `/transactions` | Transactions |
| `/data-anomaly-detection` | Data Anomaly Detection |
| `/wallets` | Wallets |
| `/wallet-ingestion` | Wallet Ingestion |
| `/clients` | Clients |
| `/irs-8949` | IRS 8949 |
| `/gain-loss` | Gain/Loss |
| `/exports` | Exports |
| `/settings` | Settings |
| `/preferences` | Preferences |
| `/rule-engine` | Rule Engine |
| `/my-account` | My Account |
| `/help` | Help |
| `/keyboard-shortcuts` | Keyboard Shortcuts |
| `/design-system` | Design System Showcase |
| `/_render/classification-insights` | Classification Insights (render target) |
| `*` | Not Found |

## API Reference

The same two endpoints are implemented for both the Express server (`server/`) and Vercel serverless functions (`api/`). All endpoints set permissive CORS headers.

| Method | Endpoint | Description | Example response |
| --- | --- | --- | --- |
| `GET` | `/api/ping` | Health check. Returns `PING_MESSAGE` (or `"ping"`). | `{ "message": "ping pong" }` |
| `GET` | `/api/demo` | Demo endpoint returning a typed `DemoResponse`. | `{ "message": "Hello from Express server" }` |
| `GET` | `/api` | (Serverless only) Lists available endpoints. | `{ "message": "API is running", "endpoints": [...] }` |

Response types are shared via `shared/api.ts` (e.g. the `DemoResponse` interface).

## Testing

Tests run with [Vitest](https://vitest.dev/):

```bash
pnpm test
```

Test specs live alongside source files (e.g. `client/lib/utils.spec.ts`).

## Deployment

### Vercel

The repository is configured for Vercel via `vercel.json`:

- **Build command:** `npm run build:client`
- **Output directory:** `dist/spa`
- **Framework:** `vite`
- **Serverless API:** functions in `api/**/*.ts` (max duration 10s)
- **Region:** `iad1`
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, etc.) and asset caching rules are defined in `vercel.json`.

```bash
# With the Vercel CLI
vercel
```

### Self-hosted Node server

```bash
pnpm build      # builds client (dist/spa) and server (dist/server)
pnpm start      # node dist/server/node-build.mjs
```

The production server serves the static SPA from `dist/spa` and the API under `/api`, listening on `PORT` (default `3000`).

### Binary

`package.json` includes a `pkg` configuration (assets `dist/spa/*`, scripts `dist/server/**/*.js`) for producing self-contained executables. [VERIFY] No `pkg` build script is defined in `package.json`; building a binary requires invoking `pkg` directly.

## Contributing

There is no `CONTRIBUTING.md` in the repository. General guidelines:

1. Use **pnpm** for dependency management.
2. Run `pnpm typecheck` and `pnpm test` before opening a pull request.
3. Run `pnpm format.fix` (Prettier — 2-space indent, trailing commas) to keep formatting consistent.
4. Follow the routing, styling, and shared-type conventions documented in [`AGENTS.md`](./AGENTS.md).

## License

[VERIFY] No `LICENSE` file is present in the repository and `package.json` declares no `license` field (the package is marked `"private": true`). Licensing terms are undetermined — add a `LICENSE` file to clarify usage rights.
