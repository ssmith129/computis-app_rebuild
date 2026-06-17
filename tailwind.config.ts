import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          light: "hsl(var(--primary-light))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          hover: "hsl(var(--secondary-hover))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          light: "hsl(var(--accent-light))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Semantic Status Colors */
        success: {
          DEFAULT: "hsl(var(--success))",
          bg: "hsl(var(--success-bg))",
          text: "hsl(var(--success-text))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          bg: "hsl(var(--warning-bg))",
          text: "hsl(var(--warning-text))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          bg: "hsl(var(--error-bg))",
          text: "hsl(var(--error-text))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          bg: "hsl(var(--info-bg))",
          text: "hsl(var(--info-text))",
        },
        pending: {
          DEFAULT: "hsl(var(--pending))",
          bg: "hsl(var(--pending-bg))",
          foreground: "hsl(var(--pending-foreground))",
        },
        category: {
          purple: "hsl(var(--category-purple))",
          "purple-bg": "hsl(var(--category-purple-bg))",
          "purple-fg": "hsl(var(--category-purple-foreground))",
        },
        asset: "hsl(var(--asset-symbol))",
        overlay: "hsl(var(--overlay))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          muted: "hsl(var(--sidebar-muted))",
        },
        chart: {
          blue: "hsl(var(--chart-blue))",
          green: "hsl(var(--chart-green))",
          orange: "hsl(var(--chart-orange))",
          yellow: "hsl(var(--chart-yellow))",
          cyan: "hsl(var(--chart-cyan))",
          red: "hsl(var(--chart-red))",
        },
        gray: {
          50: "hsl(var(--gray-50))",
          100: "hsl(var(--gray-100))",
          200: "hsl(var(--gray-200))",
          300: "hsl(var(--gray-300))",
          400: "hsl(var(--gray-400))",
          500: "hsl(var(--gray-500))",
          600: "hsl(var(--gray-600))",
          700: "hsl(var(--gray-700))",
          800: "hsl(var(--gray-800))",
          900: "hsl(var(--gray-900))",
        },
      },
      fontSize: {
        "display-lg": "var(--font-size-display-lg)",
        "display-sm": "var(--font-size-display-sm)",
        "heading-lg": "var(--font-size-heading-lg)",
        "heading-md": "var(--font-size-heading-md)",
        "heading-sm": "var(--font-size-heading-sm)",
        "body-lg": "var(--font-size-body-lg)",
        "body-md": "var(--font-size-body-md)",
        "body-sm": "var(--font-size-body-sm)",
        caption: "var(--font-size-caption)",
        overline: "var(--font-size-overline)",
      },
      spacing: {
        "0.5": "var(--space-0-5)",
        "1.5": "var(--space-1-5)",
        "2.5": "var(--space-2-5)",
        "3.5": "var(--space-3-5)",
      },
      borderRadius: {
        xs: "var(--radius-sm)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      height: {
        "btn-sm": "var(--button-height-sm)",
        "btn-md": "var(--button-height-md)",
        "btn-lg": "var(--button-height-lg)",
        "input-sm": "var(--input-height-sm)",
        "input-md": "var(--input-height-md)",
        "input-lg": "var(--input-height-lg)",
      },
      width: {
        "table-sm": "100px",
        "table-md": "120px",
        "table-lg": "140px",
        "select-default": "180px",
      },
      maxWidth: {
        "header-sm": "200px",
        "header-md": "280px",
        "chart-sm": "120px",
        "chart-md": "160px",
        "content": "1920px",
      },
      minWidth: {
        "rule-card": "280px",
        "progress-bar": "120px",
      },
      zIndex: {
        base: "var(--z-base)",
        elevated: "var(--z-elevated)",
        sticky: "var(--z-sticky)",
        dropdown: "var(--z-dropdown)",
        overlay: "var(--z-overlay)",
        drawer: "var(--z-drawer)",
        modal: "var(--z-modal)",
        toast: "var(--z-toast)",
        tooltip: "var(--z-tooltip)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Noto Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
