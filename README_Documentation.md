# Computis — Crypto Tax & Accounting Workspace

A professional crypto tax preparation platform for accountants and tax professionals — turning raw wallet and exchange data into classified, reconciled, audit-ready IRS filings.

## Overview

Crypto tax preparation is a reconciliation problem at scale. A single client may hold dozens of wallets across multiple exchanges, generating thousands of transactions in inconsistent formats, many of which are ambiguous (transfer vs. disposal, income vs. internal movement). Misclassification propagates directly into cost-basis errors and incorrect capital-gains reporting.

Computis is built for the professional who does this work repeatedly — not the individual filer doing it once. It ingests transaction data from wallets and exchanges, applies a rule engine to classify transactions automatically, surfaces anomalies for human review before they corrupt downstream numbers, computes gains and losses, and exports IRS Form 8949 with an attached audit trail.

The design thesis: **make the ambiguous reviewable.** The product's center of gravity is the review surface — dense data tables, classification insights, anomaly flags, and conflict detection — designed so a professional can move through a high-volume ledger quickly while keeping every automated decision inspectable and reversible. Speed and auditability are treated as the same requirement, not competing ones.

Target users: crypto-focused accountants, tax preparers, and the firms that manage multiple client entities and their associated wallets.

## Key Features

Grouped by user-facing capability.

- **Dashboard** — Portfolio-level overview with metric cards, charts, recent uploads, and surfaced anomaly flags. *Gives the preparer an at-a-glance read on data health and outstanding review work before drilling in.*
- **Transaction ledger & classification insights** — A dense transaction table with AI-assisted classification insights, a per-transaction detail modal, and inline anomaly flagging. *Lets the preparer review and correct how each transaction is categorized — the decisions that determine tax outcomes.*
- **Rule engine** — Author rules that classify transactions automatically, with conflict detection when rules overlap. *Converts repetitive manual classification into reusable logic and warns when rules disagree, instead of silently picking one.*
- **Data anomaly detection** — Overview cards plus an issues table that triages suspect records and exposes issue-level detail. *Catches the gaps, duplicates, and inconsistencies that would otherwise surface as wrong numbers at filing time.*
- **Wallet ingestion** — A guided multi-step flow: upload → schema mapping → validation → review/import, with recognized exchange sources including Coinbase, Binance, Kraken, and MetaMask. *Normalizes inconsistent source formats into one reviewed dataset, with a checkpoint before anything is committed.*
- **Gain / Loss** — Capital gain/loss calculation built on tax lots and specific-identification methods. *Produces the figures that flow into tax forms, with the lot-level basis preserved.*
- **IRS Form 8949** — Generates Form 8949 with short-term and long-term dispositions separated. *Delivers the actual filing artifact, not just intermediate numbers.*
- **Exports** — Configurable exports with data validation and embedded audit-trail metadata; an audit-trail drawer records what was generated and which fields were validated for IRS compliance. *Makes every export defensible — the preparer can show how a number was produced.*
- **Client & entity management** — Management surfaces for clients, wallets, users, tax entities, and permissions. *Keeps multi-client, multi-entity work organized within one workspace.*
- **Support surfaces** — Settings, preferences, account, help, keyboard shortcuts, and a built-in design-system showcase.

## Design Specifications

The design system is documented in-repo under `documentation/design system resources/` (versioned 2.0.0 there) and validated against `documentation/design-audits/Computis_Design_System_Audit_Report.md`. The conventions below reflect the naming actually used in the project.

**Token architecture** — Colors are defined as HSL CSS custom properties (e.g. `--background`, `--foreground`, `--card`, `--primary`, `--muted-foreground`, `--border`, `--ring`) and consumed through Tailwind semantic classes (`bg-primary`, `text-muted-foreground`, `border-border`). Hardcoded Tailwind color utilities (e.g. `bg-blue-600`) are explicitly out-of-pattern.

- **Brand primary** — Vivid Blue, `hsl(218 91% 45%)` / `#0B5ED7`, used for primary actions, links, and active states.
- **Status colors** — Semantic `success` / `warning` / `error` / `info` tokens (with `-bg` / `-text` variants) for state communication.

**Typography** — Two families:

- `font-sans` → **Noto Sans** (UI text, headings, labels, buttons).
- `font-mono` → **JetBrains Mono** (transaction amounts, wallet addresses, code) — a deliberate choice so figures and hashes align and read unambiguously.
- Type scale: `xs` (12px) → `4xl`, on a 16px base. Weights: normal, medium, semibold, bold.

**Spacing** — 4px base scale (`0.5`=2px through `8`=32px), with 24px as the standard card padding.

**Components** — Radix UI primitives wrapped as shadcn/ui-style components in `client/components/ui/`, with type-safe variants via `class-variance-authority`. The primitive set is broad: button, input, select, table, dialog, drawer, sheet, tabs, accordion, tooltip, popover, command palette, calendar/date-picker, toast/sonner, skeleton/loading states, sidebar, and more. Conditional class composition uses a `cn()` helper (`clsx` + `tailwind-merge`).

**Interaction & layout patterns** — A persistent `AppLayout` shell (sidebar + header) frames feature content; data-dense tables, detail modals/drawers for record inspection, multi-step wizards for ingestion, and inline status badges/flags for review state.

**Responsive posture** — A device-aware breakpoint scale beyond Tailwind defaults, including tablet-specific stops: `sm` 640 · `md` 768 · `ipad` 834 · `lg` 1024 · `ipad-landscape` 1194 · `xl` 1280 · `2xl` 1400 · `desktop` 1920.

**Accessibility posture** — The system specifies focus-ring styling (`ring-2 ring-ring`) for WCAG 2.4.7 and uses accessible Radix primitives and ARIA labelling (e.g. labelled close controls on the audit-trail drawer). The internal audit, however, records real gaps: duplicate/parallel button components with colliding variant exports, and widespread use of raw color utilities instead of semantic tokens, including missing focus indicators on some hand-rolled buttons. [VERIFY: remediation status of the audit's critical findings] No formal WCAG conformance level is claimed in-repo. [DATA NEEDED: target conformance level, e.g. WCAG 2.1 AA]

## Product Specifications

**Supported surfaces** — Responsive web application (desktop-first, tablet-aware down to ~640px). No native mobile or offline client. [ASSUMED: desktop/tablet professional use is the intended context, inferred from data-density and breakpoint scale]

**Primary user flows**

1. **Ingest** — Upload wallet/exchange data → map source schema → validate → review → import.
2. **Classify** — Auto-classify via the rule engine; review classification insights and resolve rule conflicts.
3. **Review anomalies** — Triage flagged issues from the anomaly surfaces and correct records.
4. **Compute** — Calculate gain/loss across tax lots.
5. **File & export** — Generate IRS Form 8949 and export validated data with an audit trail.

**Key states** — Empty (no export selected; no data imported), validation pass/fail, anomaly-flagged records, rule-conflict warnings, and short-term vs. long-term disposition splits.

**Scope boundaries (intentionally out of scope)** — No end-user/consumer filing experience; this is a preparer tool. No payments or e-filing transmission surface is present in the product. Authentication, billing, and live exchange API integrations are not represented in the reviewed codebase. [GAP: auth/integration layer not evidenced in-repo — confirm whether handled elsewhere]

## Design Decisions & Rationale

1. **Semantic tokens over raw utilities** — *Principle: a single source of truth for visual meaning.* Colors, type, and spacing are expressed as semantic CSS variables so brand and status changes propagate centrally. **Honest limitation:** the in-repo audit found this only partially enforced — many components still reference raw Tailwind colors, and two parallel button implementations diverge on the same semantic intent. The system is aspirational in places, not yet uniformly applied.

2. **Monospace for numbers and addresses** — *Constraint: financial data must be scannable and unambiguous.* JetBrains Mono is reserved for amounts and wallet hashes so digits and characters align in dense tables and can't be misread.

3. **Review-first surfaces (insights, flags, conflicts)** — *Principle: automation must stay inspectable.* Rather than silently auto-classifying, the product exposes classification insights, anomaly flags, and rule-conflict warnings — keeping the human in the loop on the decisions that drive tax outcomes. **Tradeoff:** more surface area and review steps than a fully automated pipeline, accepted in exchange for auditability.

4. **Radix + shadcn primitive layer** — *Constraint: accessibility and consistency at component scale.* Building on Radix primitives buys keyboard/focus behavior and ARIA semantics by default instead of re-implementing them per component.

5. **Audit trail as a first-class export concern** — *Principle: every reported number must be defensible.* Exports carry validation results and audit-trail metadata, reflecting that the deliverable is not just a file but a defensible record for IRS compliance.

## Screens / Visual Reference

The repository includes a Playwright-based capture pipeline (`scripts/capture-screenshots.mjs`) that renders every route at 1920×1080 @3× with 300-DPI metadata, but no committed image assets were located for embedding here.

- `[SCREENSHOT NEEDED: Dashboard]`
- `[SCREENSHOT NEEDED: Transactions ledger + classification insights]`
- `[SCREENSHOT NEEDED: Rule Engine — rule list & conflict view]`
- `[SCREENSHOT NEEDED: Data Anomaly Detection — issues table]`
- `[SCREENSHOT NEEDED: Wallet Ingestion — upload → mapping → validation → review]`
- `[SCREENSHOT NEEDED: Gain / Loss]`
- `[SCREENSHOT NEEDED: IRS Form 8949]`
- `[SCREENSHOT NEEDED: Exports + audit-trail drawer]`
- `[SCREENSHOT NEEDED: Design System Showcase]`

## Outcomes / Impact

[DATA NEEDED: no verified adoption, performance, or business-outcome metrics were found in the repository. Section intentionally left without figures rather than fabricated.]

## Links

- **Repository** — https://github.com/ssmith129/computis-app
- **Live demo** — `[DATA NEEDED: no deployed URL verified in-repo]`
- **Design system resources** — `documentation/design system resources/` (in-repo)
- **Design audit** — `documentation/design-audits/Computis_Design_System_Audit_Report.md` (in-repo)

---

## Appendix A — Gap Log

| Flag | Location | What's missing |
| ---- | -------- | -------------- |
| `[VERIFY]` | Design Specifications — Accessibility | Remediation status of the audit's critical findings (parallel button components, raw color usage, missing focus rings). |
| `[DATA NEEDED]` | Design Specifications — Accessibility | Stated target WCAG conformance level. |
| `[ASSUMED]` | Product Specifications — Surfaces | Desktop/tablet professional context inferred from data density and breakpoint scale. |
| `[GAP]` | Product Specifications — Scope | Authentication / billing / live exchange-API integration layer not evidenced in the reviewed codebase. |
| `[DATA NEEDED]` | Outcomes / Impact | No verified metrics available; section omitted of figures. |
| `[DATA NEEDED]` | Links | No deployed live-demo URL verified. |

## Appendix B — Fabrication Ledger

No `[FABRICATED-PLAUSIBLE]` content was introduced. All product, design-token, and feature claims trace to repository sources (`client/`, `tailwind.config.ts`, `documentation/design system resources/`, `documentation/design-audits/`). Gaps are flagged rather than filled.
