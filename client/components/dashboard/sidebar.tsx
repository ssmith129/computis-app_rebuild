import {
  BarChart3,
  ArrowLeftRight,
  Wallet,
  Users,
  FileText,
  Settings,
  User,
  ChevronDown,
  TrendingUp,
  Download,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { helpAccountMenuItems } from "@/components/dashboard/menu-config";
import { SidebarToggleButton } from "@/components/dashboard/sidebar-toggle-button";

interface NavConfigItem {
  title: string;
  icon: typeof BarChart3;
  href: string;
  /** Extra paths (e.g. sub-flows) that should also mark this item active. */
  match?: string[];
}

const mainNavItems: NavConfigItem[] = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/",
  },
  {
    title: "Transactions",
    icon: ArrowLeftRight,
    href: "/transactions",
    match: ["/data-anomaly-detection"],
  },
  {
    title: "Wallets and Exchanges",
    icon: Wallet,
    href: "/wallets",
    match: ["/wallet-ingestion"],
  },
  {
    title: "Clients",
    icon: Users,
    href: "/clients",
  },
];

const reportsItems = [
  {
    title: "IRS 8949",
    icon: FileText,
    href: "/irs-8949",
  },
  {
    title: "Gain/Loss",
    icon: TrendingUp,
    href: "/gain-loss",
  },
  {
    title: "Exports",
    icon: Download,
    href: "/exports",
  },
];

const settingsItems = [
  {
    title: "General Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "Preferences",
    icon: User,
    href: "/preferences",
  },
  {
    title: "Rule Engine",
    icon: Settings,
    href: "/rule-engine",
  },
];

/**
 * Active state is derived from the current route (useLocation), not a string
 * prop — so renaming a label can't silently desync the highlight, and nested
 * routes resolve to the right parent.
 */
function useIsItemActive() {
  const { pathname } = useLocation();
  return (item: { href: string; match?: string[] }) => {
    // Exact-only for the dashboard root, otherwise it would match everything.
    if (item.href === "/") return pathname === "/";
    const paths = [item.href, ...(item.match ?? [])];
    return paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  };
}

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isItemActive = useIsItemActive();

  return (
    <Sidebar className="bg-sidebar border-r border-sidebar" collapsible="icon">
      <SidebarHeader className="p-3 bg-sidebar border-sidebar group-data-[collapsible=icon]:p-1.5">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
          {/* Logo - hidden when collapsed */}
          <div className="flex items-center overflow-hidden transition-all duration-200 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/b9597295463998a42a59ddadf868fade81af1f2b?width=364"
              alt="Computis Logo"
              className="h-[34px] w-auto"
            />
          </div>
          {/* Toggle button */}
          <SidebarToggleButton />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 bg-sidebar text-sidebar-foreground border-sidebar group-data-[collapsible=icon]:px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = isItemActive(item);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`${
                        isActive
                          ? "bg-sidebar-accent text-white"
                          : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
                      }`}
                    >
                      <Link to={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span className="font-semibold text-sm">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Reports Section */}
        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-sidebar-muted hover:text-white font-semibold text-sm">
                Reports
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {reportsItems.map((item) => {
                    const isActive = isItemActive(item);
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.title}
                          className={`${
                            isActive
                              ? "bg-sidebar-accent text-white"
                              : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
                          }`}
                        >
                          <Link to={item.href}>
                            <item.icon className="h-5 w-5" />
                            <span className="font-semibold text-sm">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-sidebar-muted hover:text-white font-semibold text-sm">
                Settings
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {settingsItems.map((item) => {
                    const isActive = isItemActive(item);
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.title}
                          className={`${
                            isActive
                              ? "bg-sidebar-accent text-white"
                              : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
                          }`}
                        >
                          <Link to={item.href}>
                            <item.icon className="h-5 w-5" />
                            <span className="font-semibold text-sm">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Help & Account Section */}
        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-sidebar-muted hover:text-white font-semibold text-sm">
                Help & Account
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {helpAccountMenuItems.map((item) => {
                    const isActive = isItemActive(item);
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.title}
                          className={`${
                            isActive
                              ? "bg-sidebar-accent text-white"
                              : "text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
                          }`}
                        >
                          <Link to={item.href}>
                            <item.icon className="h-5 w-5" />
                            <span className="font-semibold text-sm">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
