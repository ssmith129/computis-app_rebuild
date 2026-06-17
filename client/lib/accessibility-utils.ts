import { useEffect, useCallback, useRef, useState } from "react";

// ARIA utilities
export const aria = {
  // Common ARIA attributes
  expanded: (isExpanded: boolean) => ({ "aria-expanded": isExpanded }),
  selected: (isSelected: boolean) => ({ "aria-selected": isSelected }),
  disabled: (isDisabled: boolean) => ({ "aria-disabled": isDisabled }),
  hidden: (isHidden: boolean) => ({ "aria-hidden": isHidden }),
  pressed: (isPressed: boolean) => ({ "aria-pressed": isPressed }),
  checked: (isChecked: boolean) => ({ "aria-checked": isChecked }),

  // Labeling
  label: (label: string) => ({ "aria-label": label }),
  labelledBy: (id: string) => ({ "aria-labelledby": id }),
  describedBy: (id: string) => ({ "aria-describedby": id }),

  // States
  invalid: (isInvalid: boolean) => ({ "aria-invalid": isInvalid }),
  required: (isRequired: boolean) => ({ "aria-required": isRequired }),
  readonly: (isReadonly: boolean) => ({ "aria-readonly": isReadonly }),

  // Live regions
  live: (type: "polite" | "assertive" | "off" = "polite") => ({
    "aria-live": type,
  }),
  atomic: (isAtomic: boolean) => ({ "aria-atomic": isAtomic }),

  // Relationships
  controls: (id: string) => ({ "aria-controls": id }),
  owns: (id: string) => ({ "aria-owns": id }),

  // Values
  valueNow: (value: number) => ({ "aria-valuenow": value }),
  valueMin: (value: number) => ({ "aria-valuemin": value }),
  valueMax: (value: number) => ({ "aria-valuemax": value }),
  valueText: (text: string) => ({ "aria-valuetext": text }),
};

// Keyboard navigation utilities
export const keyboardKeys = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
  TAB: "Tab",
  DELETE: "Delete",
  BACKSPACE: "Backspace",
} as const;

// Hook for keyboard navigation
export function useKeyboardNavigation(
  items: string[] | HTMLElement[],
  options: {
    loop?: boolean;
    orientation?: "horizontal" | "vertical";
    onActivate?: (index: number) => void;
    onEscape?: () => void;
  } = {},
) {
  const {
    loop = true,
    orientation = "vertical",
    onActivate,
    onEscape,
  } = options;
  const currentIndexRef = useRef(0);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      let newIndex = currentIndexRef.current;

      switch (key) {
        case keyboardKeys.ARROW_UP:
          if (orientation === "vertical") {
            event.preventDefault();
            newIndex = loop
              ? (currentIndexRef.current - 1 + items.length) % items.length
              : Math.max(0, currentIndexRef.current - 1);
          }
          break;

        case keyboardKeys.ARROW_DOWN:
          if (orientation === "vertical") {
            event.preventDefault();
            newIndex = loop
              ? (currentIndexRef.current + 1) % items.length
              : Math.min(items.length - 1, currentIndexRef.current + 1);
          }
          break;

        case keyboardKeys.ARROW_LEFT:
          if (orientation === "horizontal") {
            event.preventDefault();
            newIndex = loop
              ? (currentIndexRef.current - 1 + items.length) % items.length
              : Math.max(0, currentIndexRef.current - 1);
          }
          break;

        case keyboardKeys.ARROW_RIGHT:
          if (orientation === "horizontal") {
            event.preventDefault();
            newIndex = loop
              ? (currentIndexRef.current + 1) % items.length
              : Math.min(items.length - 1, currentIndexRef.current + 1);
          }
          break;

        case keyboardKeys.HOME:
          event.preventDefault();
          newIndex = 0;
          break;

        case keyboardKeys.END:
          event.preventDefault();
          newIndex = items.length - 1;
          break;

        case keyboardKeys.ENTER:
        case keyboardKeys.SPACE:
          event.preventDefault();
          onActivate?.(currentIndexRef.current);
          break;

        case keyboardKeys.ESCAPE:
          event.preventDefault();
          onEscape?.();
          break;
      }

      if (newIndex !== currentIndexRef.current) {
        currentIndexRef.current = newIndex;

        // Focus the new item if it's an HTMLElement
        if (items[newIndex] instanceof HTMLElement) {
          (items[newIndex] as HTMLElement).focus();
        }
      }
    },
    [items, loop, orientation, onActivate, onEscape],
  );

  return {
    currentIndex: currentIndexRef.current,
    setCurrentIndex: (index: number) => {
      currentIndexRef.current = index;
    },
    handleKeyDown,
  };
}

// Hook for focus management
export function useFocusManagement() {
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  const getFocusableElements = useCallback((container: HTMLElement) => {
    const focusableSelectors = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(", ");

    return Array.from(
      container.querySelectorAll(focusableSelectors),
    ) as HTMLElement[];
  }, []);

  const trapFocus = useCallback(
    (container: HTMLElement) => {
      const focusableElements = getFocusableElements(container);
      focusableElementsRef.current = focusableElements;

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== keyboardKeys.TAB) return;

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      container.addEventListener("keydown", handleKeyDown);
      firstElement.focus();

      return () => {
        container.removeEventListener("keydown", handleKeyDown);
      };
    },
    [getFocusableElements],
  );

  const restoreFocus = useCallback((previousElement?: HTMLElement | null) => {
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus();
    }
  }, []);

  return {
    trapFocus,
    restoreFocus,
    getFocusableElements,
  };
}

// Hook for announcements to screen readers
export function useScreenReaderAnnouncement() {
  const announcementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create live region for announcements
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.setAttribute("class", "sr-only");
    liveRegion.style.position = "absolute";
    liveRegion.style.left = "-10000px";
    liveRegion.style.width = "1px";
    liveRegion.style.height = "1px";
    liveRegion.style.overflow = "hidden";

    document.body.appendChild(liveRegion);
    announcementRef.current = liveRegion;

    return () => {
      if (
        announcementRef.current &&
        document.body.contains(announcementRef.current)
      ) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);

  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (announcementRef.current) {
        announcementRef.current.setAttribute("aria-live", priority);
        announcementRef.current.textContent = message;

        // Clear after announcement
        setTimeout(() => {
          if (announcementRef.current) {
            announcementRef.current.textContent = "";
          }
        }, 1000);
      }
    },
    [],
  );

  return { announce };
}

// Hook for reduced motion preferences
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

// Color contrast utilities
export function getContrastRatio(
  foreground: string,
  background: string,
): number {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd want a more robust color parsing library
  const getLuminance = (color: string): number => {
    // This is a simplified implementation
    // You might want to use a library like chroma-js for accurate calculations
    void color;
    return 0.5; // Placeholder
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function isAccessibleContrast(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA",
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return level === "AA" ? ratio >= 4.5 : ratio >= 7;
}

// Skip link utilities
export function createSkipLink(
  targetId: string,
  label: string = "Skip to main content",
) {
  const skipLink = document.createElement("a");
  skipLink.href = `#${targetId}`;
  skipLink.textContent = label;
  skipLink.className =
    "sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-primary-foreground px-4 py-2 z-50";

  // Insert as first element in body
  document.body.insertBefore(skipLink, document.body.firstChild);

  return skipLink;
}

// High contrast mode detection
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-contrast: high)");
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsHighContrast(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isHighContrast;
}

// Screen reader only utility class
export const srOnly =
  "absolute left-[-10000px] w-[1px] h-[1px] overflow-hidden";

// Common accessibility patterns
export const accessibilityPatterns = {
  button: {
    role: "button",
    tabIndex: 0,
  },
  link: {
    role: "link",
    tabIndex: 0,
  },
  menuitem: {
    role: "menuitem",
    tabIndex: -1,
  },
  tab: {
    role: "tab",
    tabIndex: -1,
  },
  tabpanel: {
    role: "tabpanel",
    tabIndex: 0,
  },
  dialog: {
    role: "dialog",
    tabIndex: -1,
  },
  alert: {
    role: "alert",
    "aria-live": "assertive" as const,
  },
  status: {
    role: "status",
    "aria-live": "polite" as const,
  },
} as const;
