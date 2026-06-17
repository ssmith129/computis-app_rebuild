import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/**
 * SidebarToggleButton
 *
 * An animated hamburger / collapse icon that toggles sidebar state.
 * - Expanded state: three horizontal lines (hamburger)
 * - Collapsed state: lines morph into a narrower stacked layout
 *
 * Uses CSS transitions for smooth animation between states.
 */
export function SidebarToggleButton({ className }: { className?: string }) {
  const { toggleSidebar, state, isMobile, setOpenMobile } = useSidebar();
  const isExpanded = state === "expanded";

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(true);
    } else {
      toggleSidebar();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md w-9 h-9 transition-colors",
        "hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "shrink-0",
        className,
      )}
      aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      aria-expanded={isExpanded}
    >
      {/* Animated hamburger icon using three bars */}
      <div className="relative flex h-3.5 w-4 flex-col justify-between">
        {/* Top bar */}
        <span
          className={cn(
            "block h-[2px] rounded-full bg-white transition-all duration-300 ease-in-out",
            isExpanded ? "w-4" : "w-3",
          )}
        />
        {/* Middle bar */}
        <span className="block h-[2px] w-4 rounded-full bg-white transition-all duration-300 ease-in-out" />
        {/* Bottom bar */}
        <span
          className={cn(
            "block h-[2px] rounded-full bg-white transition-all duration-300 ease-in-out",
            isExpanded ? "w-4" : "w-3",
          )}
        />
      </div>
    </button>
  );
}
