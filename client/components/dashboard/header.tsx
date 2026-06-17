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
        min-h-14
        w-full
        shrink-0 items-center
        justify-between gap-2
        overflow-x-hidden
        p-2
        sm:gap-3
        sm:px-3
      "
      role="banner"
      aria-label="Main navigation header"
    >
      {/* Left side: mobile hamburger + search */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {/* Mobile-only hamburger toggle */}
        <div className="shrink-0 md:hidden">
          <SidebarToggleButton />
        </div>

        {/* Search Bar */}
        <div
          className="
            flex
            h-10
            min-w-0
            max-w-header-sm
            flex-1 items-center
            rounded-md
            bg-sidebar-accent
            px-2
            py-1.5
            transition-all
            duration-200
            sm:max-w-header-md
            sm:px-2.5
            md:max-w-sm
            lg:max-w-md
            xl:max-w-lg
          "
          role="search"
        >
          <Search
            className="mr-2 size-4 shrink-0 text-white sm:mr-3 sm:size-5"
            aria-hidden="true"
          />
          <Input
            placeholder="Search..."
            className="
              min-w-0
              border-none
              bg-transparent
              p-0
              text-body-md
              text-white
              placeholder:text-gray-300
              focus-visible:ring-0
              focus-visible:ring-offset-0 sm:text-heading-md
            "
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right Side - Notifications and User Profile */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-6">
        <NotificationsDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="
                flex
                shrink-0
                items-center gap-1
                rounded-md
                transition-all
                hover:opacity-80
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                sm:gap-2
              "
              aria-label="User menu"
              aria-haspopup="menu"
            >
              <Avatar className="size-8 bg-gray-400 sm:size-9">
                <AvatarFallback className="bg-gray-400 text-white">
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-body-md font-medium text-white lg:inline-block">
                John Smith
              </span>
              <ChevronDown className="hidden size-3 text-white sm:size-4 lg:inline-block" />
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
                  <item.icon className="mr-2 size-4" aria-hidden="true" />
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
