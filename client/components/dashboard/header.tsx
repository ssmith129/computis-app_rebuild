import { Search, ChevronDown, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationsDropdown } from "@/components/dashboard/notifications-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { helpAccountMenuItems } from "@/components/dashboard/menu-config";
import { Link } from "react-router-dom";
import { SidebarToggleButton } from "@/components/dashboard/sidebar-toggle-button";

/**
 * DashboardHeader Component
 *
 * Fixed header with:
 * - Mobile hamburger toggle (md:hidden)
 * - Compact search bar (40px height)
 * - Notifications dropdown
 * - User profile dropdown
 *
 * Z-Index: Inherits from parent (z-50)
 * Min Height: 3.5rem (56px)
 */
export function DashboardHeader() {
  return (
    <header
      className="
        app-header
        flex
        items-center
        justify-between
        gap-2 sm:gap-3
        px-2 sm:px-3
        py-2
        flex-shrink-0
        min-h-[3.5rem]
        overflow-x-hidden
        w-full
      "
      role="banner"
      aria-label="Main navigation header"
    >
      {/* Left side: mobile hamburger + search */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Mobile-only hamburger toggle */}
        <div className="md:hidden shrink-0">
          <SidebarToggleButton />
        </div>

        {/* Search Bar */}
        <div
          className="
            flex
            items-center
            bg-sidebar-accent
            rounded-md
            px-2 sm:px-2.5
            py-1.5
            flex-1
            min-w-0
            max-w-header-sm
            sm:max-w-header-md
            md:max-w-sm
            lg:max-w-md
            xl:max-w-lg
            h-10
            transition-all
            duration-200
          "
          role="search"
        >
          <Search
            className="h-4 w-4 sm:h-5 sm:w-5 text-white shrink-0 mr-2 sm:mr-3"
            aria-hidden="true"
          />
          <Input
            placeholder="Search..."
            className="
              bg-transparent
              border-none
              text-white
              placeholder:text-muted-foreground
              focus-visible:ring-0
              focus-visible:ring-offset-0
              p-0
              min-w-0
              text-sm sm:text-base
            "
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right Side - Notifications and User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-6 shrink-0">
        <NotificationsDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="
                flex
                items-center
                gap-1 sm:gap-2
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                rounded-md
                shrink-0
                transition-all
                hover:opacity-80
              "
              aria-label="User menu"
              aria-haspopup="menu"
            >
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 bg-muted-foreground">
                <AvatarFallback className="bg-muted-foreground text-white">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-white font-medium text-sm hidden lg:inline-block">
                John Smith
              </span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-white hidden lg:inline-block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 sm:w-56"
            sideOffset={8}
          >
            {helpAccountMenuItems.map((item) => (
              <DropdownMenuItem
                key={item.title}
                className="cursor-pointer"
                asChild
              >
                <Link to={item.href} className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>{item.title}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
