# Design System Audit — Computis App

**Date:** March 29, 2026
**Components reviewed:** 111 | **Issues found:** 18 | **Score:** 68/100

---

## Naming Consistency

| Issue | Components Affected | Recommendation |
|-------|---------------------|----------------|
| Badge has `error`, `info`, `neutral` variants not present in Button or Alert | `badge.tsx` vs `button.tsx`, `alert.tsx` | Standardize semantic variant names across all components. If Badge needs `error`/`info`, add them to Button and Alert too — or alias them. |
| Status color naming diverges between docs and code | `colors.css` uses `--status-success`, global.css uses `--success` | Pick one convention. Implementation (`--success`) is simpler — update docs to match. |

**What's working well:** All 52 UI files use kebab-case. All exported components use PascalCase. `cn()` imports are consistent everywhere it's needed.

---

## Token Coverage

| Category | Tokens Defined | Hardcoded Values Found | Severity |
|----------|---------------|----------------------|----------|
| **Colors** | 15 semantic groups + gray scale | **~30 instances** of hardcoded hex (sidebar alone has 9× `#a3a3a3`, pie charts use 10+ raw hex values) | 🔴 High |
| **Spacing** | 4px grid, 0–8 scale | **~25 instances** of arbitrary Tailwind brackets (`w-[120px]`, `max-w-[160px]`, `min-w-[140px]`, etc.) | 🟡 Medium |
| **Typography** | 10-step scale | **2 instances** (`text-[11px]`, `fontSize: 14` inline) | 🟢 Low |
| **Border Radius** | xs–xl scale | **3 instances** (`rounded-[2px]`, `rounded-[10px]`, `rounded-[inherit]`) | 🟢 Low |
| **Shadows** | xs–lg scale | **2 instances** of inline `drop-shadow()` and custom `shadow-[...]` | 🟢 Low |
| **Z-Index** | No defined scale | **4 instances** (`z-[1]`, `z-[100]`, `z-[9998]`, `z-[9999]`) | 🟡 Medium |

### Worst Offenders (by file)

| File | Hardcoded Count | Types |
|------|----------------|-------|
| `dashboard/sidebar.tsx` | 9 | Color (`#a3a3a3` repeated), spacing |
| `dashboard/enhanced-pie-charts.tsx` | 12+ | Colors (5+ hex), shadows, spacing |
| `dashboard/pie-chart-sections.tsx` | 5 | Colors (all chart segment hex values) |
| `transactions/transactions-table.tsx` | 4 | Spacing (max-width brackets) |
| `exports/audit-trail-drawer.tsx` | 3 | Spacing, z-index |

---

## Component Completeness

| Component | Variants | Sizes | States | forwardRef | displayName | Score |
|-----------|----------|-------|--------|------------|-------------|-------|
| Button | ✅ 8 variants | ✅ Token-based | ✅ | ✅ | ✅ | 10/10 |
| Enhanced Button | ✅ 8 variants | ⚠️ Hardcoded px | ✅ | ✅ | ✅ | 6/10 |
| Badge | ✅ 9 variants | ❌ None | ✅ | ❌ Missing | ❌ Missing | 5/10 |
| Input | ✅ | ❌ No size prop | ✅ | ✅ | ✅ | 6/10 |
| Enhanced Input | ✅ | ✅ 3 sizes | ✅ | ✅ | ✅ | 9/10 |
| Toggle | ✅ 2 variants | ⚠️ Hardcoded px | ✅ | ✅ | ✅ | 7/10 |
| Card | ✅ | N/A | ✅ | ✅ | ✅ | 9/10 |
| Skeleton | N/A | N/A | N/A | ❌ Missing | ❌ Missing | 5/10 |
| Calendar | ✅ | N/A | ✅ | ❌ Missing | ❌ Missing | 5/10 |
| Toast | ✅ 2 variants | N/A | ✅ | ✅ | ✅ | 8/10 |
| Alert | ✅ 2 variants | N/A | ✅ | ✅ | ✅ | 8/10 |

### Duplicate Components

There are **two parallel implementations** for both Button and Input:

- `button.tsx` (token-based sizing) vs `enhanced-button.tsx` (hardcoded sizing)
- `input.tsx` (no size variants) vs `enhanced-input.tsx` (has size variants)

This is a maintenance risk — consumers may pick the wrong one, and changes need to be synced across both.

---

## Token Documentation vs Implementation

| Token | DESIGN_SYSTEM.md / global.css | colors.css / colors.json (docs) | Match? |
|-------|-------------------------------|--------------------------------|--------|
| **Primary color** | `218 91% 45%` (#2563EB) | `218 91% 48%` (lighter) | ❌ |
| **Accent color** | `45 90% 51%` (Gold) | `210 40% 96.1%` (light gray) | ❌ |
| **Button height sm** | 32px | 36px (spacing.json) | ❌ |
| **Button height md** | 36px | 44px (spacing.json) | ❌ |
| **Button height lg** | 44px | 48px (spacing.json) | ❌ |
| **Shadow notation** | `rgba()` in global.css | `rgb( / %)` in docs | ⚠️ |
| **Border radius** | Static values in global.css | `calc()` expressions in docs | ⚠️ |
| Typography scale | All 10 sizes match | All 10 sizes match | ✅ |
| Gray scale | 50–900 match | 50–900 match | ✅ |
| Chart colors | 6 colors match | 6 colors match | ✅ |
| Sidebar dimensions | Match | Match | ✅ |

**Dark mode note:** The accent color shifts from gold to dark gray in dark mode, but this isn't documented in DESIGN_SYSTEM.md.

---

## Priority Actions

### 🔴 P0 — Fix Now

1. **Consolidate duplicate components.** Merge `button.tsx` / `enhanced-button.tsx` and `input.tsx` / `enhanced-input.tsx` into single components that use design tokens for sizing. The `enhanced-*` versions bypass your token system entirely.

2. **Reconcile token documentation with implementation.** `colors.css` and `spacing.json` in `/documentation/` are out of sync with `global.css` (the source of truth). Primary color lightness, accent color identity, and all three button heights are wrong in the docs. Developers referencing these docs will build against incorrect values.

3. **Extract chart colors into tokens.** `pie-chart-sections.tsx` and `enhanced-pie-charts.tsx` define 10+ raw hex colors inline. These should be CSS custom properties (e.g., `--chart-processed`, `--chart-success`) mapped through Tailwind so they're themeable and consistent.

### 🟡 P1 — Fix Soon

4. **Replace `#a3a3a3` with a token.** This exact hex appears 9 times across sidebar and nav. Create a `--sidebar-muted` or `text-sidebar-muted` utility and use it everywhere.

5. **Add `forwardRef` to Badge, Skeleton, and Calendar.** These three components break the ref-forwarding contract that every other UI primitive follows. This will cause issues when consumers need DOM access.

6. **Define a z-index scale.** Currently z-index values are ad hoc (1, 100, 9998, 9999). Define tokens like `--z-dropdown: 50`, `--z-modal: 100`, `--z-toast: 200`, `--z-overlay: 300` and use them consistently.

7. **Standardize semantic variants across components.** Badge supports `error` / `info` / `neutral` but Button and Alert don't. Either promote these to the shared variant set or document why Badge diverges.

### 🟢 P2 — Improve Over Time

8. **Reduce arbitrary Tailwind brackets.** ~25 instances of `w-[Xpx]` / `max-w-[Xpx]` in feature components. For recurring values (120px, 140px, 160px), add named width tokens to Tailwind config.

9. **Document the dark mode accent color change.** DESIGN_SYSTEM.md describes accent as gold but dark mode shifts it to gray. Add a section explaining this intentional decision.

10. **Normalize shadow/radius notation in docs.** Minor formatting inconsistency — `rgba()` vs `rgb( / %)` and static values vs `calc()`. Pick one format for documentation.

---

## What's Working Well

- **File and export naming** is rock solid — 100% kebab-case files, 100% PascalCase exports
- **Typography tokens** are perfectly aligned across docs, config, and CSS
- **Gray scale and chart colors** are consistent everywhere
- **CVA + Tailwind + CSS variables** is a strong architecture — the foundation is right
- **Accessibility features** in global.css (focus-visible, reduced motion, high contrast) are thorough
- **`cn()` utility** usage is consistent across all components that need it
- **Radix UI primitives** provide a strong accessible base for interactive components
