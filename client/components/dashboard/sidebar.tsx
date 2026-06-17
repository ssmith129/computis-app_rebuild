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
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { helpAccountMenuItems } from "@/components/dashboard/menu-config";
import { SidebarToggleButton } from "@/components/dashboard/sidebar-toggle-button";

const mainNavItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/",
  },
  {
    title: "Transactions",
    icon: ArrowLeftRight,
    href: "/transactions",
  },
  {
    title: "Wallets and Exchanges",
    icon: Wallet,
    href: "/wallets",
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

interface DashboardSidebarProps {
  activeItem?: string;
}

export function DashboardSidebar({
  activeItem = "Dashboard",
}: DashboardSidebarProps) {
  useSidebar();

  return (
    <Sidebar className="border-r border-sidebar bg-sidebar" collapsible="icon">
      <SidebarHeader className="border-sidebar bg-sidebar p-3 group-data-[collapsible=icon]:p-1.5">
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

      <SidebarContent className="border-sidebar bg-sidebar px-4 text-sidebar-foreground group-data-[collapsible=icon]:px-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = activeItem === item.title;
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
                        <item.icon className="size-5" />
                        <span className="text-body-md font-semibold">
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
              <CollapsibleTrigger className="flex w-full items-center justify-between text-body-md font-semibold text-sidebar-muted hover:text-white">
                Reports
                <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {reportsItems.map((item) => {
                    const isActive = activeItem === item.title;
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
                            <item.icon className="size-5" />
                            <span className="text-body-md font-semibold">
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
              <CollapsibleTrigger className="flex w-full items-center justify-between text-body-md font-semibold text-sidebar-muted hover:text-white">
                Settings
                <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {settingsItems.map((item) => {
                    const isActive = activeItem === item.title;
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
                            <item.icon className="size-5" />
                            <span className="text-body-md font-semibold">
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
              <CollapsibleTrigger className="flex w-full items-center justify-between text-body-md font-semibold text-sidebar-muted hover:text-white">
                Help & Account
                <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {helpAccountMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className="text-sidebar-muted hover:bg-sidebar-accent hover:text-white"
                      >
                        <Link to={item.href}>
                          <item.icon className="size-5" />
                          <span className="text-body-md font-semibold">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
