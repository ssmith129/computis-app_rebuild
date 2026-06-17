#!/usr/bin/env node
// One-shot codemod: map raw Tailwind palette literals -> semantic design tokens.
// Phase 1, Task 1.2. Applied to client/components/** and client/pages/**.
// UI primitives (client/components/ui/**) are left untouched (lint-exempt).
import fs from "node:fs";
import path from "node:path";

// Exact utility -> token utility. Word boundaries are applied at match time so
// `text-red-50` and `text-red-500` never collide, and opacity suffixes
// (e.g. `bg-purple-500/20`) are preserved.
const MAP = {
  // ---- Neutrals (gray) -> semantic roles ----
  "text-gray-900": "text-foreground",
  "text-gray-800": "text-foreground",
  "text-gray-700": "text-foreground",
  "text-gray-600": "text-muted-foreground",
  "text-gray-500": "text-muted-foreground",
  "text-gray-400": "text-muted-foreground",
  "text-gray-300": "text-muted-foreground",
  "bg-gray-50": "bg-muted",
  "bg-gray-100": "bg-muted",
  "bg-gray-200": "bg-muted",
  "bg-gray-300": "bg-border",
  "bg-gray-400": "bg-muted-foreground",
  "bg-gray-500": "bg-muted-foreground",
  "bg-gray-900": "bg-foreground",
  "border-gray-100": "border-border",
  "border-gray-200": "border-border",
  "border-gray-300": "border-border",
  "border-gray-400": "border-border",
  "to-gray-600": "to-muted-foreground",
  "via-gray-300": "via-border",
  "from-slate-500": "from-muted-foreground",

  // ---- Error (red) ----
  "text-red-900": "text-error",
  "text-red-800": "text-error",
  "text-red-700": "text-error",
  "text-red-600": "text-error",
  "text-red-500": "text-error",
  "text-red-400": "text-error",
  "text-red-300": "text-error",
  "text-red-50": "text-error",
  "bg-red-950": "bg-error",
  "bg-red-700": "bg-error",
  "bg-red-600": "bg-error",
  "bg-red-500": "bg-error",
  "bg-red-100": "bg-error-bg",
  "bg-red-50": "bg-error-bg",
  "border-red-900": "border-error",
  "border-red-500": "border-error",
  "border-red-200": "border-error",
  "ring-red-400": "ring-error",
  "to-red-500": "to-error",

  // ---- Success (green) ----
  "text-green-800": "text-success",
  "text-green-700": "text-success",
  "text-green-600": "text-success",
  "text-green-500": "text-success",
  "text-green-400": "text-success",
  "bg-green-600": "bg-success",
  "bg-green-500": "bg-success",
  "bg-green-100": "bg-success-bg",

  // ---- Warning (yellow / amber) ----
  "text-yellow-800": "text-warning",
  "text-yellow-600": "text-warning",
  "text-yellow-500": "text-warning",
  "text-yellow-400": "text-warning",
  "text-amber-700": "text-warning",
  "text-amber-600": "text-warning",
  "bg-yellow-600": "bg-warning",
  "bg-yellow-500": "bg-warning",
  "bg-yellow-400": "bg-warning",
  "bg-yellow-100": "bg-warning-bg",
  "bg-yellow-50": "bg-warning-bg",
  "bg-amber-100": "bg-warning-bg",
  "bg-amber-50": "bg-warning-bg",
  "border-yellow-200": "border-warning",
  "border-amber-200": "border-warning",
  "from-yellow-500": "from-warning",
  "to-amber-500": "to-warning",

  // ---- Orange -> decorative chart-orange / warning surfaces ----
  "text-orange-600": "text-chart-orange",
  "text-orange-500": "text-chart-orange",
  "bg-orange-600": "bg-chart-orange",
  "bg-orange-500": "bg-chart-orange",
  "bg-orange-50": "bg-warning-bg",
  "border-orange-500": "border-chart-orange",
  "border-orange-200": "border-warning",
  "from-orange-500": "from-chart-orange",
  "from-orange-50": "from-warning-bg",
  "to-orange-400": "to-chart-orange",
  "to-orange-100": "to-warning-bg",

  // ---- Blue -> primary (brand/links) / info surfaces / chart ----
  "text-blue-900": "text-info-text",
  "text-blue-800": "text-info-text",
  "text-blue-700": "text-primary",
  "text-blue-600": "text-primary",
  "text-blue-500": "text-info",
  "text-blue-400": "text-info",
  "bg-blue-500": "bg-chart-blue",
  "bg-blue-100": "bg-info-bg",
  "bg-blue-50": "bg-info-bg",
  "border-blue-400": "border-info",
  "border-blue-200": "border-info",
  "border-blue-100": "border-info",
  "from-blue-500": "from-primary",
  "from-blue-50": "from-info-bg",

  // ---- Purple -> categorical accent token ----
  "text-purple-900": "text-category-purple-fg",
  "text-purple-800": "text-category-purple-fg",
  "text-purple-700": "text-category-purple-fg",
  "text-purple-600": "text-category-purple",
  "text-purple-500": "text-category-purple",
  "text-purple-400": "text-category-purple",
  "bg-purple-600": "bg-category-purple",
  "bg-purple-500": "bg-category-purple",
  "bg-purple-200": "bg-category-purple-bg",
  "bg-purple-100": "bg-category-purple-bg",
  "bg-purple-50": "bg-category-purple-bg",
  "border-purple-200": "border-category-purple",
  "from-purple-50": "from-category-purple-bg",
  "to-purple-600": "to-category-purple",
  "to-purple-100": "to-category-purple-bg",
};

// Longest keys first so e.g. `text-red-500` is tried before `text-red-50`.
const keys = Object.keys(MAP).sort((a, b) => b.length - a.length);

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (p.includes(path.join("components", "ui"))) continue; // exempt
      walk(p, acc);
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      acc.push(p);
    }
  }
  return acc;
}

const roots = ["client/components", "client/pages"];
let totalFiles = 0;
let totalRepl = 0;

for (const root of roots) {
  for (const file of walk(root)) {
    let src = fs.readFileSync(file, "utf8");
    let count = 0;
    for (const key of keys) {
      // \b at start, and (?![\w-]) at end so a trailing digit/hyphen blocks
      // partial matches (text-red-50 vs text-red-500) while `/20` suffixes pass.
      const re = new RegExp(`\\b${key.replace(/[-]/g, "\\-")}(?![\\w-])`, "g");
      src = src.replace(re, () => {
        count++;
        return MAP[key];
      });
    }
    if (count > 0) {
      fs.writeFileSync(file, src);
      totalFiles++;
      totalRepl += count;
    }
  }
}

console.log(`Replaced ${totalRepl} literal(s) across ${totalFiles} file(s).`);
