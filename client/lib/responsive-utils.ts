import { useEffect, useState } from "react";

// Breakpoint definitions (matching Tailwind defaults)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Hook to detect current screen size
export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>("lg");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width >= breakpoints["2xl"]) {
        setCurrentBreakpoint("2xl");
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint("xl");
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint("lg");
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint("md");
      } else {
        setCurrentBreakpoint("sm");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return currentBreakpoint;
}

// Hook to check if screen is mobile
export function useIsMobile() {
  const breakpoint = useBreakpoint();
  return breakpoint === "sm";
}

// Hook to check if screen is tablet
export function useIsTablet() {
  const breakpoint = useBreakpoint();
  return breakpoint === "md";
}

// Hook to check if screen is desktop
export function useIsDesktop() {
  const breakpoint = useBreakpoint();
  return ["lg", "xl", "2xl"].includes(breakpoint);
}

// Device-specific helpers (non-breaking additions)
export const deviceBreakpoints = {
  ipadPortrait: 834,
  ipadLandscape: 1194,
  desktop: 1920,
} as const;

export type ViewportKind =
  | "mobile"
  | "tablet-portrait"
  | "tablet-landscape"
  | "desktop"
  | "desktop-2k";

export function getViewportKind(
  width: number = typeof window !== "undefined"
    ? window.innerWidth
    : deviceBreakpoints.desktop,
): ViewportKind {
  if (width >= 1920) return "desktop-2k";
  if (width >= deviceBreakpoints.ipadLandscape) return "desktop";
  if (width >= deviceBreakpoints.ipadPortrait) return "tablet-landscape";
  if (width >= breakpoints.md) return "tablet-portrait";
  return "mobile";
}

export function useViewportKind(): ViewportKind {
  const [kind, setKind] = useState<ViewportKind>(getViewportKind());
  useEffect(() => {
    const onResize = () => setKind(getViewportKind());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return kind;
}

// Responsive grid utilities
export const responsiveGridClasses = {
  cards:
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6",
  dashboard: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6",
  twoColumn: "grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6",
  threeColumn: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6",
  fourColumn: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6",
} as const;

// Responsive padding/margin utilities
export const responsiveSpacing = {
  page: "p-4 sm:p-6",
  section: "space-y-4 sm:space-y-6",
  card: "p-4 sm:p-6",
  header: "px-4 py-3 sm:px-6 sm:py-4",
} as const;

// Responsive text utilities
export const responsiveText = {
  pageTitle: "text-display-sm sm:text-display-lg font-bold",
  sectionTitle: "text-heading-lg sm:text-display-sm font-semibold",
  cardTitle: "text-heading-md sm:text-heading-lg font-medium",
  body: "text-body-md sm:text-heading-md",
  caption: "text-caption sm:text-body-md text-muted-foreground",
} as const;

// Container utilities for responsive layouts
export function getResponsiveContainer(
  variant: "page" | "section" | "card" = "page",
) {
  const variants = {
    page: "w-full max-w-7xl mx-auto px-4 sm:px-6",
    section: "w-full max-w-4xl mx-auto px-2 sm:px-4",
    card: "w-full max-w-2xl mx-auto px-2",
  };

  return variants[variant];
}

// Responsive flex utilities
export const responsiveFlex = {
  betweenStack:
    "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
  centerStack: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4",
  endStack:
    "flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-4",
  wrap: "flex flex-wrap items-center gap-2 sm:gap-4",
} as const;

// Table responsive utilities
export function getResponsiveTableClasses(
  density: "compact" | "comfortable" | "spacious" = "comfortable",
) {
  const baseClasses = "w-full overflow-auto";
  const densityClasses = {
    compact: "text-caption sm:text-body-md",
    comfortable: "text-body-md",
    spacious: "text-body-md sm:text-heading-md",
  };

  return `${baseClasses} ${densityClasses[density]}`;
}

// Helper function to conditionally apply classes based on screen size
export function responsiveClass(
  mobile: string,
  tablet?: string,
  desktop?: string,
) {
  const breakpoint = useBreakpoint();

  if (
    desktop &&
    (breakpoint === "lg" || breakpoint === "xl" || breakpoint === "2xl")
  ) {
    return desktop;
  }
  if (tablet && breakpoint === "md") {
    return tablet;
  }
  return mobile;
}

// Form responsive utilities
export const responsiveForm = {
  field: "space-y-2",
  fieldGroup: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  fieldGroupThree: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
  actions: "flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-end",
  actionsCenter: "flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-center",
} as const;

// Animation utilities that respect reduced motion preferences
export function getAnimationClasses(respectReducedMotion = true) {
  const baseClasses = "transition-all duration-200";

  if (respectReducedMotion) {
    return `${baseClasses} motion-reduce:transition-none`;
  }

  return baseClasses;
}

// Focus management utilities
export const focusClasses = {
  visible:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  button:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  input:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  card: "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
} as const;

// Helper to get appropriate text size based on content length
export function getResponsiveTextSize(
  content: string,
  context: "title" | "body" | "caption" = "body",
) {
  const length = content.length;

  if (context === "title") {
    return length > 50
      ? "text-heading-lg sm:text-display-sm"
      : "text-display-sm sm:text-display-lg";
  }

  if (context === "body") {
    return "text-body-md sm:text-heading-md";
  }

  return "text-caption sm:text-body-md";
}
