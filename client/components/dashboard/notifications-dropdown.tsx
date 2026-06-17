import React from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  UserPlus,
  Download,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type NotificationType =
  | "success"
  | "warning"
  | "info"
  | "user"
  | "export"
  | "error"
  | "time";

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  read?: boolean;
  type?: NotificationType;
}

const typeIconMap: Record<
  NotificationType,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
  user: UserPlus,
  export: Download,
  error: XCircle,
  time: Clock,
};

const demoNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "Export finished",
    description: "Your CSV export for Transactions completed successfully.",
    time: "2m ago",
    read: false,
    type: "export",
  },
  {
    id: "2",
    title: "New client added",
    description: "Jane Cooper was added to your client list.",
    time: "25m ago",
    read: false,
    type: "user",
  },
  {
    id: "3",
    title: "Scheduled maintenance",
    description: "System maintenance today at 11:00 PM UTC.",
    time: "1h ago",
    read: true,
    type: "info",
  },
  {
    id: "4",
    title: "Import failed",
    description: "Wallet import from Exchange XYZ failed. View details.",
    time: "3h ago",
    read: true,
    type: "error",
  },
];

export interface NotificationsDropdownProps {
  items?: NotificationItem[];
  onItemClick?: (item: NotificationItem) => void;
  onMarkAllRead?: () => void;
}

export function NotificationsDropdown({
  items = demoNotifications,
  onItemClick,
  onMarkAllRead,
}: NotificationsDropdownProps) {
  const [data, setData] = React.useState<NotificationItem[]>(items);

  const unreadCount = data.filter((n) => !n.read).length;

  const markAllRead = () => {
    setData((prev) => prev.map((n) => ({ ...n, read: true })));
    onMarkAllRead?.();
  };

  const handleClick = (item: NotificationItem) => {
    setData((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
    );
    onItemClick?.(item);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white hover:bg-sidebar-accent"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0">
        <DropdownMenuLabel className="flex items-center justify-between py-3 px-3">
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-primary hover:underline"
            >
              Mark all as read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-80">
          <div className="py-1">
            {data.length === 0 ? (
              <div className="px-3 py-6 text-sm text-muted-foreground">
                You're all caught up.
              </div>
            ) : (
              data.map((n) => {
                const Icon = typeIconMap[n.type || "info"];
                return (
                  <DropdownMenuItem
                    key={n.id}
                    className={cn(
                      "px-3 py-3 gap-3 cursor-pointer focus:bg-sidebar-accent/60",
                      !n.read ? "bg-sidebar-accent/30" : undefined,
                    )}
                    onClick={() => handleClick(n)}
                  >
                    <div className="relative">
                      <Icon className="h-5 w-5" />
                      {!n.read && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {n.title}
                      </div>
                      {n.description && (
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {n.description}
                        </div>
                      )}
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {n.time}
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })
            )}
          </div>
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between py-2 px-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            className="text-xs"
          >
            Mark all read
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            View all
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
