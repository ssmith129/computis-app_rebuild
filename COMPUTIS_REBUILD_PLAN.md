# Computis Rebuild — Claude Code Execution Plan

> **Repository:** `ssmith129/computis-app_rebuild`
> **Stack (verified):** React 18 · React Router 6 (SPA) · TypeScript · Vite 7 · Tailwind 3 · Radix + shadcn/ui · TanStack Query · Express 5 · pnpm 10.14 · Vitest
> **Source of truth for *target state*:** the design critique. **Source of truth for *current state*:** this repo (all loci below verified against `main`).
> **Approach:** refactor-first. Do **not** rebuild the token system (`client/global.css`), the `Button` primitive (`client/components/ui/button.tsx`), or the global focus ring (`global.css:980`) — they are sound. Wire, sweep, and extend.

---

## How to use this file with Claude Code

1. Place this file at the repo root (or in `.builder/rules/`) so it is in-context.
2. Execute **phase by phase, in order**. Phases are dependency-ordered; do not skip ahead.
3. Each task has: **Locus** (verified path:line) → **Current** → **Target** → **Steps** → **Done-when** (machine- or eye-checkable).
4. After each phase, run the **Phase gate** commands. Do not open the next phase until the gate passes.
5. Tags: `[VERIFY]` = needs a live/visual check code can't settle · `[DATA NEEDED]` = blocked on backend fields · `[ASSUMED]` = depends on real async not yet present · `[LOCUS UNCONFIRMED]` = exact path not pinned, search first.

### Baseline commands (run once, before Phase 0)

```bash
pnpm install
pnpm typecheck            # must pass before you start
node scripts/capture-screenshots.mjs   # baseline screenshots for visual-regression diffing later
```

### Repo-grounded corrections to the critique (read before starting)

The critique was authored against a different clone (`computis-app`). Re-measured against **this** repo (`computis-app_rebuild` @ `main`):

- Raw color literals: **672** (broad regex), not 301. `bg-blue-600/700` dupes: **34** (exact match). `dark:` utilities: **13** (exact match). `text-{size}` utilities: **707**.
- `--primary` = `#0B5ED7` (vivid blue) — `bg-blue-600` is *near* but **not identical**; codemod must map to `--primary`, never assume equality.
- `--warning` **is already** AA-darkened to `#B45309` (`global.css:48`) — confirms components ignore it.
- `EmptyState` **already exists** (`client/components/ui/loading-states.tsx:122`) and is **unused** in primary flows → P1-7 is wiring, not building.
- A **route-derived nav already exists** (`client/components/nav/SideNavigation.tsx` + `NavItem.tsx`, both use `useLocation()`) but is **dead code**; the **live** nav is the string-matched `DashboardSidebar` (`AppLayout.tsx:39` → `sidebar.tsx:130/170/212`). P1-5 is a swap-to-existing.
- The critique's "597 type refs vs 6 token uses" figure and its referenced design-audit `.md` were **not found** in this repo: `[LOCUS UNCONFIRMED]`.

---

## Phase 0 — Token enforcement guard *(do first; unblocks the whole sweep)*

**Goal:** make tokens a CI constraint before sweeping, so literals can't silently re-accrue.
**Effort:** S · **Dependencies:** none.

### Task 0.1 — Add ESLint + no-raw-palette rule (P1-1, part 1)

- **Locus:** `package.json` (no `eslint` dependency currently exists — verified).
- **Current:** no lint guard; tokens are documentation only.
- **Target:** CI fails on any new raw Tailwind palette literal under `client/components`.
- **Steps:**
  1. Add dev deps: `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react`, and `eslint-plugin-tailwindcss` (or a custom `no-restricted-syntax` rule).
  2. Create `.eslintrc.cjs` (or `eslint.config.js` flat config to match Vite 7 / ESLint 9). Add a rule banning class strings matching `/(bg|text|border|ring|from|to|via)-(blue|red|green|yellow|orange|amber|purple|gray|slate|zinc|neutral|stone)-[0-9]{2,3}/` inside `client/components/**` and `client/pages/**`. Allow them only in `client/components/ui/**` if a primitive legitimately needs a raw value (prefer none).
  3. Add script: `"lint": "eslint client --ext .ts,.tsx"`.
  4. Wire `pnpm lint` into the same CI step as `pnpm typecheck`. Document the rule in `AGENTS.md`.
- **Done-when:**
  - `pnpm lint` runs and **reports** the existing ~672 violations (do not fix yet — Phase 1 does).
  - A newly added `bg-blue-600` in any `client/components/**` file fails `pnpm lint`.

### Phase 0 gate

```bash
pnpm lint            # exits non-zero, lists existing literal violations
pnpm typecheck       # still passes
```

---

## Phase 1 — Token & system sweep *(raises Color, Typography, Component-Consistency together)*

**Goal:** collapse the adoption gap. **Effort:** L · **Dependencies:** Phase 0 (guard must exist so the sweep stays clean).

### Task 1.1 — Codemod the 34 `bg-blue-600/700` primary-button dupes (P1-1, part 2)

- **Locus (verified files):**
  - `client/components/clients/tax-entities-management.tsx`
  - `client/components/clients/clients-content.tsx`
  - `client/components/clients/permissions-management.tsx`
  - `client/components/clients/users-management.tsx`
  - `client/components/dashboard/animated-mini-chart.tsx`
  - `client/pages/MyAccount.tsx`
- **Current:** `bg-blue-600 hover:bg-blue-700` hardcoded; clients module rebuilds a primary button instead of using `<Button>`.
- **Target:** `bg-primary hover:bg-primary-hover` (tokens already exist: `global.css:28-29`); primary **buttons** route through `<Button variant="default">`.
- **Steps:**
  1. Codemod: replace `bg-blue-600` → `bg-primary`, `bg-blue-700`/`hover:bg-blue-700` → `hover:bg-primary-hover`. **Verify hue intent** — `--primary` is `#0B5ED7`, not Tailwind blue-600; eyeball each in screenshots `[VERIFY]`.
  2. Where the literal styles a `<button>`/clickable, replace the element with `<Button>` (import from `@/components/ui/button`) using the appropriate variant.
- **Done-when:** `grep -rE 'bg-blue-(600|700)' client --include=*.tsx` → **0 results**; `pnpm typecheck` passes; screenshot diff of Clients + MyAccount shows no unintended visual change.

### Task 1.2 — Triage remaining raw literals (P1-1, part 3 + P0-3 replacements)

- **Locus:** repo-wide, ~638 remaining after 1.1. Known a11y-relevant ones: `transactions-table.tsx:335` (`text-red-500`), dashboard active tab (`border-yellow-400`), asset glyphs (`text-orange-500`).
- **Current:** brighter raw hues, several never contrast-checked.
- **Target:** every meaningful-UI literal → semantic token (`--error`, `--warning`, `--primary`, `--accent`, `--muted-foreground`, etc.).
- **Steps:**
  1. Generate the full list: `grep -rEon '(bg|text|border|ring|from|to|via)-(blue|red|green|yellow|orange|amber|purple|gray|slate|zinc|neutral|stone)-[0-9]{2,3}' client --include=*.tsx > /tmp/literals.txt`.
  2. Map each to its semantic token. Status colors → `--success/--warning/--error`; neutrals → `--muted/--muted-foreground/--border`; brand → `--accent` (decorative only — see Task 1.4).
  3. Replace `text-red-500` at `transactions-table.tsx:335` → `text-error` (token, AA-tuned).
- **Done-when:** `pnpm lint` (Phase 0 rule) → **0 violations** in `client/components` and `client/pages`; screenshot diff reviewed for the top 10 changed screens.

### Task 1.3 — Add `--pending` token, fix Pending→info conflation (P2-3)

- **Locus:** `client/components/ui/status-badge.tsx` and/or `ui/badge.tsx` `[LOCUS UNCONFIRMED — grep "pending" first]`; consumer `transactions-table.tsx:144-148` (`getStatusVariant` returns `"pending"`).
- **Current:** `pending` renders with the `info`/blue variant — conflates informational with pending semantics.
- **Target:** dedicated `--pending` token + badge variant, visually distinct from `info`.
- **Steps:** add `--pending` / `--pending-bg` / `--pending-foreground` to `global.css` (neutral-amber family, AA-checked); add a `pending` variant to the badge CVA; confirm `getStatusVariant` maps to it.
- **Done-when:** a Pending badge and an Info badge are visually distinguishable; token used, no raw literal.

### Task 1.4 — Gold gets one job (P2-2) + tokenized asset glyph (P2-4)

- **Locus:** `border-yellow-400` (dashboard active tab); `--accent #D4AF37` (`global.css:39`); inline `font-mono text-orange-500` asset symbols.
- **Current:** gold doubles as active-tab indicator **and** brand accent; crypto symbols styled inline ad-hoc.
- **Target:** active-tab indicator → `--primary`; gold reserved for brand/decorative (≥3:1 graphical, 1.4.11); crypto symbols → `<AssetSymbol>` component.
- **Steps:**
  1. Replace active-tab `border-yellow-400` → `border-primary` (or the existing active token).
  2. Create `client/components/ui/asset-symbol.tsx` encapsulating the mono + tokenized color; replace inline usages.
- **Done-when:** no `border-yellow-400` on tabs; no inline `text-orange-500` asset styling; `<AssetSymbol>` is the single source.

### Phase 1 gate

```bash
grep -rE 'bg-blue-(600|700)' client --include=*.tsx      # 0
pnpm lint                                                # 0 violations
pnpm typecheck                                           # passes
node scripts/capture-screenshots.mjs                     # diff vs baseline, review
```

---

## Phase 2 — Accessibility-critical surface fixes *(most-used screen)*

**Goal:** close the most defensible a11y gaps. **Effort:** M · **Dependencies:** Phase 1 tokens.

### Task 2.1 — Redundant (non-color) confidence encoding (P0-1) — WCAG 1.4.1

- **Locus:**
  - `transactions-table.tsx:137-141` (`getConfidenceColor` returns hue only)
  - `transactions-table.tsx:329-339` (color span; `AlertTriangle` gated `confidence < 40` only)
  - `transaction-details-modal.tsx:37,239,245` (same pattern)
- **Current:** good/bad *judgment* is color-only; icon appears **only** below 40%, so the 40–69% tier has no non-color signal.
- **Target:** every tier (≥70 / 40–69 / <40) carries icon **and** text label, plus color.
- **Steps:**
  1. Create a `<ConfidenceIndicator confidence={n} />` (place in `ui/` or `transactions/`): maps tier → `{ icon, label, tokenColor }`. e.g. ≥70 → check-circle + "High", 40–69 → alert-circle + "Med", <40 → alert-triangle + "Low". Use AA tokens (`--success/--warning/--error`).
  2. Render `{icon} {label} {n}%` as a small leading-glyph layout (keep 40px row density — abbreviated label, not a full pill — per critique tradeoff).
  3. Replace both the table cell (`:329-339`) and the modal block (`:239-245`) with the component.
  4. Keep `aria-valuenow` (already present) and add the textual label to the accessible name.
- **Done-when:**
  - All three tiers render a distinct icon + word.
  - **Grayscale test** `[VERIFY]`: screenshot the table, desaturate — tier is still distinguishable.
  - axe-core (add to a Vitest/Playwright check) reports no 1.4.1 violation on the transactions screen.

### Task 2.2 — Functional sort on all sortable headers (P1-2)

- **Locus:** `transactions-table.tsx:250-258` — `<Button aria-label="Sort by date">` with `ArrowUpDown` and **no `onClick`** (verified). Other 7 columns have no sort control.
- **Current:** false affordance (promises sort to sighted **and** SR users, does nothing).
- **Target:** wired sort state, directional caret, `aria-sort` on the active header.
- **Steps:**
  1. Add `sortKey`/`sortDir` state. Sort the `filteredTransactions` array before pagination (note pagination math at `:207-211`).
  2. Wire `onClick` on every header that should sort (date, type, amount, asset, status, confidence). Toggle asc↔desc↔none.
  3. Swap `ArrowUpDown` for a directional caret (`ChevronUp`/`ChevronDown`) reflecting current dir; neutral icon when unsorted.
  4. Set `aria-sort="ascending|descending|none"` on the `<th>`; update the `aria-label` to reflect state.
- **Done-when:** clicking any sortable header reorders rows + flips caret; `aria-sort` present; no header advertises a sort it can't perform; add a Vitest unit test asserting sort order.

### Task 2.3 — Pagination range math (P1-6)

- **Locus:** `transactions-table.tsx:417` — `Showing {startIndex + 1} of {filteredTransactions.length} transactions` (verified; `itemsPerPage = 25` at `:185`, `startIndex` at `:208`).
- **Current:** always reads "Showing 1 of N" — shows start index, not visible range.
- **Target:** `Showing {startIndex+1}–{min(startIndex+itemsPerPage, total)} of {total} transactions`.
- **Steps:** replace the expression at `:417`.
- **Done-when:** on page 2 of >25 rows it reads "Showing 26–50 of N"; correct on first/last page; add a Vitest test for the range formula.

### Phase 2 gate

```bash
grep -n 'onClick' client/components/transactions/transactions-table.tsx   # sort handlers present
pnpm test     # sort + pagination unit tests pass
pnpm typecheck
# Manual: grayscale screenshot of /transactions — confidence tiers distinguishable [VERIFY]
```

---

## Phase 3 — Workflow / decision surface

**Goal:** attack core triage efficiency. **Effort:** M · **Dependencies:** Phase 2 (reuse ConfidenceIndicator + row-action handlers).

### Task 3.1 — Detail modal becomes the decision surface (P1-3)

- **Locus:** `transaction-details-modal.tsx` — no `DialogFooter` / Confirm / Reject / Reclassify (grep found none). Row actions live in `transactions-content.tsx` / `transactions-table.tsx`.
- **Current:** read-only; user closes the modal and finds the row to act → open→close→find→act loop per transaction.
- **Target:** the modal is the primary review/triage surface.
- **Steps:**
  1. Lift the row-action handlers (confirm / flag / reject) so both the row and the modal call the same functions. Pass them into the modal as props (or via a shared store/context if one exists).
  2. Add a `<DialogFooter>` with: Confirm, Flag, Reject buttons (use `<Button>` variants) + a Reclassify `<Select>` of categories.
  3. Add keyboard shortcuts (e.g. `C`/`F`/`R`) scoped to the open dialog; document them on `/keyboard-shortcuts`.
  4. On action: apply, toast (see 3.2), close, and optionally advance to the next unreviewed transaction.
- **Done-when:** a transaction can be confirmed/reclassified/rejected without leaving the modal; keyboard shortcuts work; focus returns sanely on close.

### Task 3.2 — Toasts: count + undo (P2-5)

- **Locus:** bulk-action toast call sites (transactions; bulk buttons gated at `transactions-table.tsx:427/435/443`).
- **Current:** generic "Transaction confirmed", no count, no undo, irreversible.
- **Target:** "{n} transactions confirmed" with a working **Undo** action.
- **Steps:** pass the affected count into the toast; add an `action` that restores prior state (snapshot before mutate). Requires the action to be reversible in the state layer.
- **Done-when:** bulk-confirm of N rows shows "{N} transactions confirmed" + Undo that restores prior classification/status.

### Task 3.3 — Flatten nested dashboard tabs (P2-1)

- **Locus:** `client/pages/EnhancedDashboard.tsx` (Tabs present — verified).
- **Current:** role-view tabs (Admin/Client/CPA) wrap a second tab set (Overview/Reports/Portfolio) — two stacked rows.
- **Target:** role switch promoted to a header segmented control; single content tab row.
- **Steps:** extract the role switch into a segmented control in the dashboard header; leave one content-tab row beneath. `[VERIFY]` no route depends on the old nested structure.
- **Done-when:** only one visible tab row; role switching still works; screenshot diff reviewed.

### Phase 3 gate

```bash
pnpm typecheck && pnpm test
# Manual: confirm a tx from inside the modal; bulk-confirm shows count + undo; dashboard has one tab row
```

---

## Phase 4 — Architecture wiring *(connect infra that exists but is dead)*

**Goal:** remove desync risk and dead infra. **Effort:** P1-5 S, P1-4 M · **Dependencies:** none hard; do after surface work to limit churn.

### Task 4.1 — Route-derived nav active state (P1-5)

- **Locus:**
  - Live (string-matched): `client/components/dashboard/sidebar.tsx:130,170,212` (`isActive = activeItem === item.title`), driven by `AppLayout.tsx:39` and `dashboard/dashboard-layout.tsx:5-12`; `activeItem` passed by every page.
  - Existing route-derived (dead): `client/components/nav/SideNavigation.tsx` + `nav/NavItem.tsx` (both use `useLocation()`).
- **Current:** active state is a string prop; any rename/refactor silently desyncs; can't express active-parent for nested routes.
- **Target:** active derived from `useLocation()` matched against each item's `href`.
- **Steps:**
  1. Port the `useLocation()` matching from `NavItem.tsx` into `DashboardSidebar` (preserve its `SidebarProvider`/`SidebarMenu` integration — do **not** swap the whole component).
  2. Add `href` to each nav item config; compute `isActive` from path match (exact for leaves, prefix for parents).
  3. Remove the `activeItem` prop from `DashboardSidebar`, `AppLayout`, `dashboard-layout.tsx`, and all pages that pass it.
  4. `[VERIFY]` feature parity, then delete dead `nav/SideNavigation.tsx` + `nav/NavItem.tsx` (or promote them if preferred — pick one nav, not two).
- **Done-when:** `grep -rn 'activeItem' client` → 0 (or only the new internal impl); navigating to each route highlights the correct item; renaming a route label does not break highlighting.

### Task 4.2 — Wire dark mode (P1-4)

- **Locus:** `global.css` `.dark` block (exists); `client/components/preferences/preferences-content.tsx:41,150-165` (theme radio sets local state only); **0** `document.documentElement` / `setTheme` / `classList … dark` hits app-wide (verified); 13 `dark:` utilities total.
- **Current:** theming infra built, never connected; a Preferences control that does nothing.
- **Target:** toggle sets + persists the `dark` class on `<html>`; honors `system`.
- **Steps:**
  1. Add a `ThemeProvider` (or a `useTheme` hook) that sets/removes `dark` on `document.documentElement`, persists to `localStorage`, and resolves `system` via `prefers-color-scheme`.
  2. Mount it in `client/App.tsx` above the router.
  3. Drive it from the Preferences radio (`preferences-content.tsx:150`).
  4. **Coverage gate (decision):** only 13 `dark:` utilities exist — full dark coverage is **out of scope** for this pass. Wire the provider, but **gate the Preferences "dark" option behind a coverage check**: if dark styling is incomplete, keep `system`/`light` selectable and hide/disable `dark` with a "coming soon" note, OR complete dark coverage as a separately-scoped task. Do **not** ship a half-dark UI.
- **Done-when:** selecting a theme sets `.dark` and persists across reload; **either** dark is visually complete **or** the dark option is gated with rationale. `[DEFERRED: full dark-mode visual coverage]` unless explicitly in scope.

### Phase 4 gate

```bash
grep -rn 'activeItem' client --include=*.tsx     # 0 (or only new internal impl)
grep -rn 'document.documentElement' client       # theme provider present
pnpm typecheck && pnpm test
```

---

## Phase 5 — Data integrity *(P0; partly blocked on backend)*

**Goal:** remove trust/compliance liabilities. **Effort:** P0-2 S (interim)/M (bound), P1-7 M · **Dependencies:** real async + on-chain fields for full closure.

### Task 5.1 — Kill fabricated ledger precision (P0-2)

- **Locus:** `transaction-details-modal.tsx:320` (`$2.45`), `:326` (`15000000 + parseInt(id)*1000`), `:332` (`12,543`).
- **Current:** invented gas fee / block number / confirmations shipped, in an IRS-adjacent system of record.
- **Target:** bind to real fields; until present, render `—` or a skeleton. A wrong value is worse than a blank here.
- **Steps:**
  1. **Now (no backend):** replace the three literals with conditional render — show the real field if present, else em-dash `—` or `<Skeleton>`. Never compute a fake block number.
  2. **When backend lands `[DATA NEEDED]`:** add `gasFee`, `blockNumber`, `confirmations` to the transaction type in `shared/api.ts`; bind the modal to them.
- **Done-when:** `grep -n '2.45\|15000000\|12,543\|12543' client/components/transactions/transaction-details-modal.tsx` → 0; absent data renders `—`/skeleton, never a fabricated value.

### Task 5.2 — Empty / error / loading states (P1-7)

- **Locus:** `transactions-table.tsx` has **no** `length === 0` render branch (only disabled-button checks at `:427/435/443`); `EmptyState` **exists unused** at `ui/loading-states.tsx:122`; skeletons in `ui/loading-states.tsx` + `ui/skeleton.tsx`.
- **Current:** the states a new user hits first (empty everything) don't exist; skeletons aren't imported into primary flows.
- **Target:** empty, error, and loading states wired into the transactions table (and dashboard) with next-action guidance.
- **Steps:**
  1. Add a zero-row branch rendering `<EmptyState>` (already built) with copy "No transactions yet — import a wallet to begin" linking to `/wallet-ingestion`.
  2. Add an error branch (when the data call fails) with a retry affordance.
  3. Wire the existing skeletons to the loading state. **Note:** all data is currently mock/synchronous `[ASSUMED]` — wire against the mock layer now; full closure (real perceived-perf) requires real async via TanStack Query (already a dependency).
- **Done-when:** forcing zero rows renders the EmptyState + working CTA; a simulated fetch shows skeletons then data; an error path renders guidance + retry. Add a Vitest test for the zero-row branch.

### Phase 5 gate

```bash
grep -n '2.45\|15000000\|12,543\|12543' client/components/transactions/transaction-details-modal.tsx   # 0
grep -rn 'EmptyState' client/components/transactions                                                     # wired
pnpm typecheck && pnpm test
```

---

## Cross-cutting system standards (apply throughout, not per-screen)

1. **Tokens are a constraint, not a suggestion** (Phase 0 guard). Every new color, type, spacing value uses a token. The existing token architecture (`global.css`) is the source of truth — extend it (`--pending`), don't bypass it.
2. **No status by color alone.** The `ConfidenceIndicator` (Task 2.1) is the reference pattern; any new status surface (anomaly flags, badges) must pair color with icon + text.
3. **No fabricated domain data.** In this tax/audit context, render `—`/skeleton over invented ledger values — always.
4. **Affordances must be honest.** Anything that looks interactive (sort headers, toggles, theme control) must function or not appear. A control that does nothing is an a11y defect and a trust defect.
5. **Preserve the strong baseline — do not regress:** global `*:focus-visible` ring (`global.css:980`), skip-link, per-row aria-labels, 44px touch targets, `aria-valuenow`, the `Button` primitive's loading/focus/active states, and 40px/25-per-page CPA density. These meet or exceed the bar — protect them.

## Definition of done (whole plan)

```bash
pnpm lint        # 0 raw-palette violations in client/components + client/pages
pnpm typecheck   # passes
pnpm test        # sort, pagination, zero-row, theme tests pass
grep -rE 'bg-blue-(600|700)' client --include=*.tsx                 # 0
grep -rn 'activeItem' client --include=*.tsx                        # 0 (or new internal only)
# Manual / live [VERIFY]: grayscale confidence legibility; contrast audit (1.4.3/1.4.11);
#   live focus order + SR flow; breakpoint reflow [SCREENSHOT NEEDED] at sm/md/lg/xl.
```

## Risks / open questions Claude Code should surface, not silently resolve

- **Mock-data ceiling:** P1-7 and perceived-performance can't be *verified* closed until real async lands. Wire structurally now; flag that verification is deferred. `[ASSUMED]`
- **Contrast (P0-3):** code can replace suspect literals but cannot sign off 1.4.3 — needs a live measurement pass. `[VERIFY]`
- **Dark mode scope (P1-4):** 13 `dark:` utilities ≠ a dark theme. Default decision: wire provider, gate the control. Confirm whether full dark coverage is in scope before unhiding it. `[GAP]`
- **Two navs (P1-5):** porting active-logic into `DashboardSidebar` is safer than swapping to `SideNavigation`. Confirm parity before deleting the dead path. `[VERIFY]`
- **No tests exist** (`pnpm test` finds none). Acceptance criteria above add the first specs; until CI runs them, "done" rests on manual checks. `[GAP]`
- **Critique/repo provenance mismatch:** literal counts and the audit doc differ from the critique's clone. Treat the critique as *target*, this repo's measured state as *current*; don't chase figures that don't reproduce here. `[LOCUS UNCONFIRMED]`
