// Flat ESLint config (ESLint 9/10, Vite 7).
//
// Primary purpose: enforce the design-token system by failing on raw Tailwind
// palette literals (e.g. `bg-blue-600`, `text-red-500`) inside application code.
// Tokens live in client/global.css; components must use semantic utilities
// (bg-primary, text-error, ...) instead of raw palette values.
//
// See AGENTS.md ("Token enforcement") for the rule and how to extend it.
import tsParser from "@typescript-eslint/parser";

// Raw Tailwind palette literal: <utility>-<palette>-<shade>.
// Keep in sync with the codemod/grep used in the rebuild plan.
const RAW_PALETTE =
  /(bg|text|border|ring|from|to|via)-(blue|red|green|yellow|orange|amber|purple|gray|slate|zinc|neutral|stone)-[0-9]{2,3}/;

const noRawPalette = [
  "error",
  {
    selector: `Literal[value=/${RAW_PALETTE.source}/]`,
    message:
      "Raw Tailwind palette literal is banned in app code. Use a semantic token utility (bg-primary, text-error, text-muted-foreground, ...). See AGENTS.md.",
  },
  {
    selector: `TemplateElement[value.raw=/${RAW_PALETTE.source}/]`,
    message:
      "Raw Tailwind palette literal is banned in app code (template string). Use a semantic token utility. See AGENTS.md.",
  },
];

export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "dist-ssr/**",
      "scripts/**",
      "public/**",
      "**/*.config.{js,ts}",
    ],
  },
  // Application code: enforce the token guard.
  {
    files: ["client/components/**/*.{ts,tsx}", "client/pages/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-restricted-syntax": noRawPalette,
    },
  },
  // UI primitives (client/components/ui/**) are exempt: a primitive may
  // legitimately need a raw value. Prefer none — keep this list shrinking.
  {
    files: ["client/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
];
