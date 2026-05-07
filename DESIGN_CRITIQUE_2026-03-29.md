# Design Critique: Computis App — Full Codebase UI Audit

**Date:** March 29, 2026
**Stage:** Final Polish
**Scope:** 49 UI components, 14 feature directories, 2 standalone HTML pages, design tokens, layout system
**Components Reviewed:** 111+ | **Issues Found:** 34 | **Audit Score:** 68/100

---

## Overall Impression

The foundation is strong — a well-architected token system (CSS variables → Tailwind → CVA), consistent file/export naming, and solid accessibility primitives from Radix UI. However, a significant gap exists between the design system's *intent* and its *implementation*: roughly 40% of feature components bypass the token system entirely, using hardcoded Tailwind color classes and arbitrary pixel values. For a final polish pass, the biggest opportunity is closing this gap to make the system truly consistent and themeable.

---

## Usability

| Finding | Severity | Recommendation |
|---------|----------|----------------|
| Duplicate Button and Input components create consumer confusion (`button.tsx` vs `enhanced-button.tsx`, `input.tsx` vs `enhanced-input.tsx`) | 🔴 Critical | Merge into single components. `enhanced-*` versions bypass the token system with hardcoded pixel sizing. |
| Two toast systems running simultaneously (Radix Toaster + Sonner) in App.tsx | 🟡 Moderate | Consolidate to one. Having both creates inconsistent notification UX and inflates bundle size. |
| Confidence filter buttons in TransactionsContent use hardcoded color classes (`bg-green-100 text-green-800`, etc.) instead of semantic Badge variants | 🟡 Moderate | Replace with `<Badge variant="success">`, `<Badge variant="warning">`, `<Badge variant="error">` — these already exist in the system. |
| Icon-only buttons throughout dashboard (MoreHorizontal, menu triggers) lack `aria-label` attributes | 🟡 Moderate | Add `aria-label="More options"` or equivalent to every icon-only `<Button>`. Affects screen reader navigation. |

---

## Visual Hierarchy

**What draws the eye first:** Page titles and large metric displays (text-display-lg) — this is correct for a data-dense financial dashboard.

**Reading flow:** Title → KPI cards → Data tables → Sidebar navigation. The hierarchy is well-structured, though some feature components break it by using raw Tailwind sizes (`text-2xl`, `text-lg`) instead of the design system's semantic scale (`text-heading-lg`, `text-display-sm`).

**Emphasis concerns:**

| Area | Issue |
|------|-------|
| Dashboard cards | Trend indicators use `text-green-600` / `text-red-600` (hardcoded) rather than `text-success` / `text-error` tokens. Functional but not themeable. |
| Sidebar active state | Active items use `bg-sidebar-accent text-white` — good. But inactive text is hardcoded `text-[#a3a3a3]` (9 instances) instead of a token. |
| Chart sections | 10+ raw hex values for segment colors in `enhanced-pie-charts.tsx` and `pie-chart-sections.tsx`. These won't adapt to dark mode or theme changes. |

---

## Consistency

### Token Adherence — Color

| Element | Issue | Files Affected | Recommendation |
|---------|-------|----------------|----------------|
| Hardcoded Tailwind colors (bg-red-*, bg-green-*, bg-blue-*, etc.) | ~30 instances bypass semantic tokens | `enhanced-button.tsx`, `enhanced-input.tsx`, `loading-states.tsx`, `status-badge.tsx`, `anomaly-flags.tsx`, `dashboard-cards.tsx`, `dashboard-content.tsx`, `transactions-content.tsx` | Replace with `bg-success`, `bg-error`, `bg-warning`, `text-success-text`, etc. — all already defined in global.css and Tailwind config. |
| Sidebar muted text `#a3a3a3` | Hardcoded hex repeated 9 times | `sidebar.tsx` | Create `--sidebar-muted` token, use `text-sidebar-muted` utility. |
| Chart segment colors | 10+ inline hex values | `enhanced-pie-charts.tsx`, `pie-chart-sections.tsx` | Move to `--chart-*` tokens (6 already exist — extend the set). |
| Modal overlays `bg-black/80` | Hardcoded in 4 components | `alert-dialog.tsx`, `dialog.tsx`, `drawer.tsx`, `sheet.tsx` | Create `--overlay` token (e.g., `hsl(0 0% 0% / 0.8)`). |

### Token Adherence — Spacing

| Element | Issue | Files Affected | Recommendation |
|---------|-------|----------------|----------------|
| Arbitrary bracket values (`w-[120px]`, `max-w-[160px]`, `min-w-[140px]`) | ~25 instances | `transactions-table.tsx`, `audit-trail-drawer.tsx`, various dashboard components | For recurring widths (120px, 140px, 160px), add named width tokens to Tailwind config. |
| Drawer border radius `rounded-t-[10px]` | Doesn't match radius token scale | `drawer.tsx` | Use `rounded-t-lg` (--radius-lg) instead. |
| Mixed spacing approaches | Some components use `p-standard` (semantic), others use `p-4` (Tailwind), others use `p-[16px]` (arbitrary) — all meaning 16px | Various | Decide on one convention. Recommend `p-4` (standard Tailwind) for simple cases, `p-standard` for semantic density contexts (compact/standard/featured). |

### Token Adherence — Z-Index

| Value | Location | Recommendation |
|-------|----------|----------------|
| `z-[1]` | `navigation-menu.tsx` | Define `--z-dropdown: 50` |
| `z-[100]` | `toast.tsx` | Define `--z-toast: 200` |
| `z-[9998]`, `z-[9999]` | Various overlays | Define `--z-overlay: 300` |
| `z-50` | `enhanced-button.tsx`, header | Align with token scale |

### Variant Parity Across Components

| Variant | Badge | Button | Alert | Input |
|---------|-------|--------|-------|-------|
| success | ✅ | ✅ | ❌ | ✅ (enhanced only) |
| warning | ✅ | ✅ | ❌ | ✅ (enhanced only) |
| error | ✅ | ❌ | ❌ | ✅ (enhanced only) |
| info | ✅ | ❌ | ❌ | ❌ |
| neutral | ✅ | ❌ | ❌ | ❌ |

**Recommendation:** Either promote `error`, `info`, and `neutral` to Button and Alert, or document why Badge intentionally diverges.

### Documentation vs Implementation Drift

| Token | global.css (source of truth) | Documentation files | Match? |
|-------|------------------------------|---------------------|--------|
| Primary color | `218 91% 45%` (#2563EB) | `218 91% 48%` (lighter) | ❌ |
| Accent color | `45 90% 51%` (Gold) | `210 40% 96.1%` (gray) | ❌ |
| Button height sm | 32px | 36px (spacing.json) | ❌ |
| Button height md | 36px | 44px (spacing.json) | ❌ |
| Button height lg | 44px | 48px (spacing.json) | ❌ |
| Typography scale | All 10 sizes | All 10 sizes | ✅ |
| Gray scale | 50–900 | 50–900 | ✅ |

Developers referencing documentation files will build against incorrect values. Reconcile immediately.

---

## Accessibility

### Color Contrast
The semantic color system in global.css is WCAG 2.1 AA compliant — all `*-text` on `*-bg` combinations meet 4.5:1 ratio. However, feature components using hardcoded Tailwind colors (e.g., `text-green-600` on `bg-green-100`) have not been verified. The standalone HTML pages use their own color palettes entirely outside the token system.

### Touch Targets
Button sizes (sm: 32px, md: 36px, lg: 44px) are documented correctly. The sm size (32px) falls below the 44px WCAG 2.5.5 minimum — the design system correctly notes this should be desktop-only, but no enforcement mechanism exists.

### Semantic HTML
The React app has good landmark structure: `<nav>` (sidebar), `<header>` (top bar with `role="banner"`), `<main>` (content area via SidebarInset). However, heading hierarchy is inconsistent — some pages use `<h1>` correctly, while others use `<p className="text-display-lg">` for primary headings, breaking the document outline.

### Missing Accessibility Attributes

| Issue | Components | Fix |
|-------|-----------|-----|
| Icon-only buttons without `aria-label` | `dashboard-cards.tsx`, `dashboard-content.tsx`, `pie-chart-sections.tsx` | Add descriptive labels |
| Badge/Skeleton/Calendar missing `forwardRef` | `badge.tsx`, `skeleton.tsx`, `calendar.tsx` | Add `React.forwardRef` wrapper and `displayName` |
| HTML page tables missing `aria-label` | Both standalone HTML files | Add `aria-label="Transaction data"` or similar |
| Confidence slider missing `aria-describedby` | `sliding-confidence-transactions.html` | Link tooltip content via `aria-describedby` |

### Standalone HTML Pages vs React App
The two standalone HTML pages (`binary-automation-transactions.html` and `sliding-confidence-transactions.html`) operate entirely outside the design system. They use different color palettes, different typography scales, different spacing, and different responsive breakpoints. If these are production pages, they need to be migrated to the React component system or at minimum adopt the same CSS custom properties.

---

## What Works Well

The audit identified several areas of genuine strength that should be preserved and built on:

- **Token architecture is sound.** CSS variables → Tailwind config → CVA variants is the right pattern. The foundation supports theming, dark mode, and density adjustments.
- **File and export naming is 100% consistent.** All 52 UI files use kebab-case, all exports use PascalCase.
- **`cn()` utility usage is universal.** Every component that needs class merging uses it correctly.
- **Typography token scale is perfectly aligned** across docs, config, and CSS — the one token category with zero drift.
- **Accessibility primitives are solid.** Radix UI provides keyboard navigation, focus management, and ARIA attributes out of the box. The header component (`role="banner"`, `aria-label`) and search (`role="search"`) are well-labeled.
- **Focus-visible states** are properly implemented with `ring-2` across interactive elements.
- **Reduced motion and high contrast** media queries are defined in global.css.
- **Responsive sidebar** transitions cleanly between expanded, collapsed, and mobile sheet states.

---

## Priority Recommendations

### 🔴 P0 — Fix Before Ship

1. **Consolidate duplicate components.** Merge `button.tsx` / `enhanced-button.tsx` and `input.tsx` / `enhanced-input.tsx`. The enhanced versions bypass your token system with hardcoded sizing and Tailwind color classes. One component each, using design tokens for all variants and sizes.

2. **Reconcile documentation with implementation.** Primary color, accent color, and all three button heights are wrong in the documentation files. Update `colors.css`, `spacing.json`, and any generated docs to match `global.css` (the source of truth).

3. **Replace hardcoded colors in feature components.** The ~30 instances of raw Tailwind colors (`bg-green-100`, `text-red-600`, etc.) should use your semantic tokens (`bg-success-bg`, `text-error-text`). This is the single highest-impact change for consistency and dark mode readiness.

### 🟡 P1 — Fix Soon

4. **Extract chart colors into tokens.** Create `--chart-processed`, `--chart-success`, etc. in global.css and map through Tailwind. Eliminates 10+ inline hex values.

5. **Create sidebar muted token.** Replace 9 instances of `#a3a3a3` with `text-sidebar-muted`.

6. **Add `aria-label` to all icon-only buttons.** Audit every `<Button size="icon">` and ensure it has a descriptive label.

7. **Define z-index scale.** Create 4–5 z-index tokens (`--z-base`, `--z-dropdown`, `--z-modal`, `--z-toast`, `--z-overlay`) and replace all arbitrary values.

8. **Consolidate to one toast system.** Pick either Radix Toaster or Sonner, not both.

### 🟢 P2 — Improve Over Time

9. **Tokenize recurring arbitrary widths.** Add named width utilities for 120px, 140px, 160px to Tailwind config.

10. **Standardize heading hierarchy in React.** Ensure every page has exactly one `<h1>`, and that visual size classes don't replace semantic heading elements.

11. **Migrate standalone HTML pages.** `binary-automation-transactions.html` and `sliding-confidence-transactions.html` use completely independent design systems. Either convert to React components or share the CSS custom properties from global.css.

12. **Document dark mode accent behavior.** The accent shifts from gold to gray in dark mode — this is undocumented and may confuse implementers.

---

*Audit performed against Computis Design System v2.0. Findings based on static code analysis of all client-side files.*
