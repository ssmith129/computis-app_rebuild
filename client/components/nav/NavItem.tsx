import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface NavItemProps {
  to: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  collapsed?: boolean;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  to,
  label,
  icon: Icon,
  collapsed = false,
  onClick,
}) => {
  const location = useLocation();
  const active = location.pathname === to;

  const content = (
    <Link
      to={to}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-white"
          : "text-[#a3a3a3] hover:bg-sidebar-accent hover:text-white",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span className="font-semibold truncate">{label}</span>}
      {collapsed && <span className="sr-only">{label}</span>}
    </Link>
  );

  if (!collapsed) return content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
