import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { NavItem, NavItemProps } from "./nav-item";
import { cn } from "@/lib/utils";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";

export type SideNavigationItem = Omit<NavItemProps, "collapsed">;

export interface SideNavigationProps {
  items: SideNavigationItem[];
  logo?: React.ReactNode;
  title?: string;
  className?: string;
  storageKey?: string; // localStorage key to persist state
}

export const SideNavigation: React.FC<SideNavigationProps> = ({
  items,
  logo,
  title = "",
  className,
  storageKey = "sidebar:collapsed",
}) => {
  const location = useLocation();
  const isMobile = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
    [],
  );
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) return saved === "true";
    return isMobile; // default collapsed on mobile, expanded on desktop
  });
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Persist state
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(storageKey, String(collapsed));
  }, [collapsed, storageKey]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navWidth = collapsed ? "w-16" : "w-64";

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-hidden
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "relative z-30 h-screen border-r border-sidebar bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-in-out md:sticky md:top-0",
          navWidth,
          className,
          mobileOpen ? "fixed left-0 top-0" : "",
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sidebar p-3">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md hover:bg-sidebar-accent md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Menu className="size-5" />
          </button>
          <div
            className={cn(
              "flex items-center gap-2 overflow-hidden",
              collapsed ? "w-0 md:w-0" : "",
            )}
            aria-hidden={collapsed}
          >
            {logo}
            {!!title && <span className="truncate font-semibold">{title}</span>}
          </div>
          <button
            type="button"
            className="ml-auto inline-flex size-9 items-center justify-center rounded-md hover:bg-sidebar-accent"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-controls="app-sidenav"
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? (
              <ChevronRight className="size-5" />
            ) : (
              <ChevronLeft className="size-5" />
            )}
          </button>
        </div>

        {/* Nav items */}
        <nav id="app-sidenav" className="space-y-1 p-2">
          {items.map((it) => (
            <NavItem key={it.to} {...it} collapsed={collapsed} />
          ))}
        </nav>
      </aside>
    </>
  );
};
