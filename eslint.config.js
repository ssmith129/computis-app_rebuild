import js from "@eslint/js";
import tseslint from "typescript-eslint";
import tailwind from "eslint-plugin-tailwindcss";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tailwind.configs["flat/recommended"],
  {
    files: ["client/**/*.{ts,tsx}"],
    ignores: ["client/components/ui/**", "client/pages/DesignSystemShowcase.tsx"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/\\b(text-(xs|sm|base|lg|xl|2xl|3xl))\\b/]",
          message:
            "Use semantic font-size tokens (text-caption, text-body-sm, text-body-md, text-heading-md, text-heading-lg, text-display-sm, text-display-lg). See Phase 2.",
        },
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message:
            "Use a design token: hsl(var(--token)) or a token-backed Tailwind class. See Phase 1.",
        },
      ],
      "tailwindcss/no-arbitrary-value": "warn",
      "tailwindcss/no-custom-classname": "off",
    },
    settings: { tailwindcss: { config: "tailwind.config.ts" } },
  },
);
