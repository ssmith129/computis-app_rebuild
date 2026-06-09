# Computis App

A full-stack crypto tax and accounting workspace — transaction classification, anomaly detection, gain/loss calculation, and IRS Form 8949 export — built as a React 18 SPA with an integrated Express server.

## Overview

Computis is a professional-grade web application for crypto tax preparation. It ingests wallet and exchange data, classifies transactions through a rule engine, surfaces data anomalies for review, computes capital gains/losses, and produces audit-ready exports including IRS Form 8949.

The repository is a single-port full-stack TypeScript project: a Vite-powered React SPA on the front end and an Express API mounted as Vite middleware in development. The package is scaffolded from a "Fusion Starter" template — the underlying `package.json` name is `fusion-starter`. [VERIFY: whether the package should be renamed to `computis-app` before publishing]

Key capabilities:

- Dashboard with portfolio metrics, charts, recent uploads, and anomaly flags
- Transaction ledger with AI-assisted classification insights and detail review
- Rule engine for automated transaction classification, including conflict detection
- Data anomaly detection with issue triage tables
- Wallet ingestion flow: upload → schema mapping → validation → review/import
- Gain/Loss calculation and IRS Form 8949 generation (short- and long-term)
- Exports with data validation and audit-trail metadata
- Client, wallet, user, and tax-entity management
- Built-in design-system showcase route

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [API](#api)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

- **Frontend:** React 18, React Router 6 (SPA mode), TypeScript, Vite 7
- **Styling:** Tailwind CSS 3, CSS custom properties, `tailwindcss-animate`, `@tailwindcss/typography`
- **UI primitives:** Radix UI, shadcn/ui patterns, `class-variance-authority`, `lucide-react` icons
- **Data/state:** TanStack React Query, React Hook Form, Zod
- **Visualization:** Recharts, Three.js (`@react-three/fiber`, `@react-three/drei`), Framer Motion
- **Backend:** Express 5 (integrated with Vite dev server; deployed as Vercel functions)
- **Testing:** Vitest
- **Tooling:** pnpm, Prettier, SWC, Playwright/Puppeteer (screenshot scripts), `sharp`

## Prerequisites

- **Node.js** `>=18.0.0` (declared in `package.json` `engines`)
- **pnpm** `10.14.0` (declared via `packageManager`; pnpm is the project's preferred package manager)

## Installation

```bash
git clone https://github.com/ssmith129/computis-app.git
cd computis-app
pnpm install
```

## Configuration

Environment variables are read from a `.env` file (loaded via `dotenv`). The repo ships a `.env` containing public variables; there is no `.env.example`. [VERIFY: committing `.env` is intentional — secret values should use a secrets manager rather than `.env`]

| Name                       | Required | Default  | Description                                                                 |
| -------------------------- | -------- | -------- | --------------------------------------------------------------------------- |
| `PING_MESSAGE`             | No       | `"ping"` | Response payload for the `GET /api/ping` health-check endpoint.             |
| `VITE_PUBLIC_BUILDER_KEY`  | No       | —        | Builder.io public API key (client-exposed via the `VITE_` prefix).          |
| `PORT`                     | No       | `8080`   | Port for the production server (`server/node-build.ts`).                    |
| `NODE_ENV`                 | No       | —        | Standard Node environment flag; influences server build behavior.           |

## Usage

Start the development server (client + API on a single port):

```bash
pnpm dev
```

The app runs at `http://localhost:8080`. The Express API is available under `/api/*` on the same port.

Build and run the production server:

```bash
pnpm build
pnpm start
```

`pnpm build` runs both the client build (`vite build` → `dist/spa`) and the server build (`vite build --config vite.config.server.ts` → `dist/server`). `pnpm start` runs `node dist/server/node-build.mjs`.

## Scripts

| Script                | Command                                       | Description                                          |
| --------------------- | --------------------------------------------- | ---------------------------------------------------- |
| `pnpm dev`            | `vite`                                        | Start the dev server (client + Express middleware).  |
| `pnpm build`          | `npm run build:client && npm run build:server`| Full production build (client + server).             |
| `pnpm build:client`   | `vite build`                                  | Build the SPA to `dist/spa`.                         |
| `pnpm build:server`   | `vite build --config vite.config.server.ts`   | Build the Node server bundle to `dist/server`.       |
| `pnpm vercel-build`   | `npm run build:client`                        | Client-only build used by Vercel.                    |
| `pnpm start`          | `node dist/server/node-build.mjs`             | Run the built production server.                     |
| `pnpm test`           | `vitest --run`                                | Run the test suite once.                             |
| `pnpm typecheck`      | `tsc`                                         | Type-check the project (no emit).                    |
| `pnpm format.fix`     | `prettier --write .`                          | Format the codebase with Prettier.                   |

Additional maintenance scripts live in `scripts/` and are invoked directly with `node` (not wired into `package.json`):

```bash
node scripts/capture-screenshots.mjs          # Capture 1920x1080 @3x, 300-DPI screenshots of every route
node scripts/check-dpi.mjs                     # Verify PNG DPI metadata
node scripts/capture-classification-insights.mjs
node scripts/gen-code-classification-svg.mjs
```

`capture-screenshots.mjs` honors a `BASE_URL` env var (default `http://localhost:8080`):

```bash
BASE_URL=http://localhost:8080 node scripts/capture-screenshots.mjs
```

## Project Structure

```
.
├── api/                  # Vercel serverless function entry points (index, ping, demo)
├── client/               # React SPA
│   ├── App.tsx           # App entry + React Router route table
│   ├── global.css        # Tailwind layers + CSS-variable design tokens
│   ├── components/        # Feature components grouped by domain + ui/ primitives
│   │   ├── ui/            # shadcn/ui-style primitives (button, table, dialog, …)
│   │   ├── layout/        # AppLayout shell
│   │   ├── dashboard/     # Dashboard, sidebar, header, charts
│   │   ├── transactions/  # Ledger, classification insights, detail modal
│   │   ├── rule-engine/   # Rule table, create-rule modal, conflict view
│   │   ├── data-anomaly-detection/
│   │   ├── gain-loss/  ├── irs-8949/  ├── wallet-ingestion/
│   │   ├── exports/   ├── clients/   └── wallets/
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities (incl. cn())
│   └── pages/            # Route components
├── server/               # Express server (dev middleware + node build)
│   ├── index.ts          # createServer(): middleware + /api routes
│   └── routes/           # Route handlers (demo)
├── shared/               # Types shared across client/server (api.ts)
├── scripts/              # Screenshot / insight-capture utilities
├── documentation/        # Design system resources, audits, generation guides
├── tailwind.config.ts    # Tailwind theme (tokens, breakpoints)
├── vite.config.ts        # Client config + Express dev plugin
├── vite.config.server.ts # Server build config
└── vercel.json           # Vercel build, rewrites, security headers
```

Path aliases (configured in `tsconfig.json` and `vite.config.ts`):

- `@/*` → `client/*`
- `@shared/*` → `shared/*`

## Routes

Client routes are declared in `client/App.tsx`:

| Path                              | Page                          |
| --------------------------------- | ----------------------------- |
| `/`                               | Dashboard (Index)             |
| `/transactions`                   | Transactions                  |
| `/data-anomaly-detection`         | Data Anomaly Detection        |
| `/wallets`                        | Wallets                       |
| `/wallet-ingestion`               | Wallet Ingestion              |
| `/clients`                        | Clients                       |
| `/irs-8949`                       | IRS Form 8949                 |
| `/gain-loss`                      | Gain / Loss                   |
| `/exports`                        | Exports                       |
| `/rule-engine`                    | Rule Engine                   |
| `/settings`                       | Settings                      |
| `/preferences`                    | Preferences                   |
| `/my-account`                     | My Account                    |
| `/help`                           | Help                          |
| `/keyboard-shortcuts`             | Keyboard Shortcuts            |
| `/design-system`                  | Design System Showcase        |
| `/_render/classification-insights`| Render target (screenshots)   |
| `*`                               | NotFound                      |

## API

The Express server (`server/index.ts`) applies `cors`, `express.json`, and `express.urlencoded`, and exposes:

| Method | Path        | Description                                              |
| ------ | ----------- | ------------------------------------------------------- |
| `GET`  | `/api/ping` | Health check; returns `{ message: PING_MESSAGE }`.      |
| `GET`  | `/api/demo` | Demo endpoint returning a `DemoResponse` (`shared/api.ts`). |

On Vercel, `api/index.ts` additionally returns a self-describing endpoint listing and handles CORS preflight; `api/ping.ts` and `api/demo.ts` provide the serverless equivalents.

Shared response types live in `shared/api.ts` and can be imported from both client and server via `@shared/api`.

## Testing

```bash
pnpm test
```

Tests run with Vitest in single-run mode. [GAP: no test files were located in the repository at documentation time — `pnpm test` may report no tests until specs are added]

## Deployment

The project is configured for **Vercel** (`vercel.json`):

- Build command: `npm run build:client`; output directory: `dist/spa`; framework preset: `vite`.
- SPA rewrites route all non-API paths to `index.html`; `/api/*` is served by functions in `api/` (`maxDuration: 10s`, region `iad1`).
- Security headers are set globally (`X-Content-Type-Options`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy`) plus long-lived caching for static assets.

A self-contained Node deployment is also supported via `pnpm build` + `pnpm start` (serves `dist/spa` through the Express build in `dist/server`).

## Contributing

No `CONTRIBUTING.md` is present. In the meantime:

1. Use **pnpm** for all dependency operations.
2. Run `pnpm typecheck` and `pnpm format.fix` before opening a PR.
3. Add routes above the catch-all `*` route in `client/App.tsx`.
4. Use design tokens and the `ui/` primitives rather than hardcoded Tailwind colors — see `documentation/design system resources/` and the design audit in `documentation/design-audits/`.

## License

[DATA NEEDED: no `LICENSE` file exists in the repository. `package.json` sets `"private": true` and declares no `license` field. Add a LICENSE file and a `license` field before distribution.]

---

## Assumptions & Gaps

- `[VERIFY]` Package name is `fusion-starter` in `package.json`, not `computis-app`; confirm intended public package name.
- `[VERIFY]` A `.env` with public variables is committed and no `.env.example` exists; confirm this is intentional and that no secrets are tracked.
- `[GAP]` No test files found — Testing section documents the runner only.
- `[DATA NEEDED]` No `LICENSE` file and no `license` field; license is undetermined.
- **Omitted — Badges:** no CI workflow, coverage service, published version, or license file was found, so no badge endpoints could be verified.
- **Omitted — Acknowledgments/Contact:** no verifiable maintainer or contact metadata in-repo.
