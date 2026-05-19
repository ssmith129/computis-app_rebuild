import { ReactNode } from "react";
import {
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
  activeItem?: string;
}

/**
 * Inner layout component that can access SidebarContext.
 * Adjusts the fixed header width/offset based on sidebar collapsed vs expanded state.
 */
function AppLayoutInner({ children, activeItem }: AppLayoutProps) {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = state === "collapsed";

  /*
   * Determine the CSS offset for the fixed header on desktop:
   * - Expanded sidebar: 16rem (--sidebar-width)
   * - Collapsed sidebar: 3rem  (--sidebar-width-icon)
   * - Mobile: 0 (full width, no sidebar visible)
   */
  const sidebarOffset = isMobile
    ? "0px"
    : isCollapsed
      ? "var(--sidebar-width-icon)"
      : "var(--sidebar-width)";

  return (
    <div className="app-layout-grid min-h-screen w-full max-w-full overflow-x-clip box-border">
      <DashboardSidebar activeItem={activeItem} />

      <div className="app-layout-right-column flex flex-col min-h-screen min-w-0 max-w-full overflow-x-clip">
        {/* Fixed Header - dynamically adjusts left/width based on sidebar state */}
        <div
          className="header-container-fixed bg-sidebar border-b border-sidebar-border fixed top-0 z-50 overflow-hidden transition-[left,width] duration-200 ease-linear"
          style={{
            isolation: "isolate",
            left: sidebarOffset,
            width: `calc(100% - ${sidebarOffset})`,
          }}
        >
          <div className="w-full max-w-content mx-auto overflow-hidden">
            <DashboardHeader />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 min-h-0 w-full max-w-content mx-auto overflow-x-clip pt-[3.5rem] box-border">
          <SidebarInset className="flex flex-col min-w-0 flex-1 w-full max-w-full overflow-x-clip box-border">
            {children}
          </SidebarInset>
        </div>
      </div>
    </div>
  );
}

/**
 * AppLayout Component
 *
 * Layout with collapsible sidebar (icon mode):
 *
 * Expanded (Desktop):
 * ┌──────────┬─────────────────────┐
 * │  LOGO ☰  │     HEADER          │
 * │          ├─────────────────────┤
 * │  NAV     │                     │
 * │  ITEMS   │     CONTENT         │
 * └──────────┴─────────────────────┘
 *
 * Collapsed (Desktop):
 * ┌───┬────────────────────────────┐
 * │ ☰ │     HEADER                 │
 * │   ├────────────────────────────┤
 * │ 🔘│                            │
 * │ 🔘│     CONTENT                │
 * └───┴────────────────────────────┘
 *
 * Mobile (< 768px):
 * ┌─────────────────────────────┐
 * │  ☰    HEADER                │
 * ├─────────────────────────────┤
 * │        CONTENT              │
 * └─────────────────────────────┘
 * (Sidebar becomes overlay sheet)
 */
export function AppLayout({ children, activeItem }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppLayoutInner activeItem={activeItem}>{children}</AppLayoutInner>
    </SidebarProvider>
  );
}
