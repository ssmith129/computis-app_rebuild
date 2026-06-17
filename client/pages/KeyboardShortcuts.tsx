import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Keyboard,
  Search,
  Command,
  Navigation,
  MousePointer,
  Eye,
  Download,
  Settings,
  HelpCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function KeyboardShortcuts() {
  const [searchQuery, setSearchQuery] = useState("");

  const shortcutCategories = [
    {
      title: "Navigation",
      icon: Navigation,
      color: "blue",
      shortcuts: [
        {
          keys: ["G", "D"],
          description: "Go to Dashboard",
          action: "Navigate to main dashboard",
        },
        {
          keys: ["G", "T"],
          description: "Go to Transactions",
          action: "Navigate to transactions page",
        },
        {
          keys: ["G", "W"],
          description: "Go to Wallets",
          action: "Navigate to wallets page",
        },
        {
          keys: ["G", "R"],
          description: "Go to Reports",
          action: "Navigate to reports section",
        },
        {
          keys: ["G", "S"],
          description: "Go to Settings",
          action: "Navigate to settings page",
        },
        {
          keys: ["G", "H"],
          description: "Go to Help",
          action: "Open help center",
        },
        {
          keys: ["Esc"],
          description: "Close Modal/Sidebar",
          action: "Close any open modal or sidebar",
        },
      ],
    },
    {
      title: "Search & Filter",
      icon: Search,
      color: "green",
      shortcuts: [
        {
          keys: ["Ctrl", "K"],
          description: "Global Search",
          action: "Open global search modal",
        },
        {
          keys: ["/"],
          description: "Quick Search",
          action: "Focus on search input",
        },
        {
          keys: ["Ctrl", "F"],
          description: "Filter Current Page",
          action: "Open filter options",
        },
        {
          keys: ["Alt", "C"],
          description: "Clear Filters",
          action: "Reset all active filters",
        },
        {
          keys: ["Enter"],
          description: "Apply Search/Filter",
          action: "Execute search or apply filters",
        },
      ],
    },
    {
      title: "Actions",
      icon: Zap,
      color: "purple",
      shortcuts: [
        {
          keys: ["Ctrl", "N"],
          description: "New Transaction",
          action: "Add new transaction manually",
        },
        {
          keys: ["Ctrl", "I"],
          description: "Import Data",
          action: "Open import wizard",
        },
        {
          keys: ["Ctrl", "E"],
          description: "Export Data",
          action: "Open export options",
        },
        {
          keys: ["Ctrl", "S"],
          description: "Save Changes",
          action: "Save current form or changes",
        },
        {
          keys: ["Ctrl", "Z"],
          description: "Undo",
          action: "Undo last action",
        },
        {
          keys: ["Ctrl", "Shift", "Z"],
          description: "Redo",
          action: "Redo last undone action",
        },
        {
          keys: ["Del"],
          description: "Delete Selected",
          action: "Delete selected items",
        },
      ],
    },
    {
      title: "View & Display",
      icon: Eye,
      color: "orange",
      shortcuts: [
        {
          keys: ["Ctrl", "1"],
          description: "Card View",
          action: "Switch to card layout",
        },
        {
          keys: ["Ctrl", "2"],
          description: "List View",
          action: "Switch to list layout",
        },
        {
          keys: ["Ctrl", "3"],
          description: "Table View",
          action: "Switch to table layout",
        },
        {
          keys: ["Ctrl", "+"],
          description: "Zoom In",
          action: "Increase content zoom",
        },
        {
          keys: ["Ctrl", "-"],
          description: "Zoom Out",
          action: "Decrease content zoom",
        },
        {
          keys: ["Ctrl", "0"],
          description: "Reset Zoom",
          action: "Reset zoom to default",
        },
        {
          keys: ["F11"],
          description: "Fullscreen",
          action: "Toggle fullscreen mode",
        },
      ],
    },
    {
      title: "Selection & Editing",
      icon: MousePointer,
      color: "red",
      shortcuts: [
        {
          keys: ["Ctrl", "A"],
          description: "Select All",
          action: "Select all items on current page",
        },
        {
          keys: ["Ctrl", "Click"],
          description: "Multi-select",
          action: "Add/remove item from selection",
        },
        {
          keys: ["Shift", "Click"],
          description: "Range Select",
          action: "Select range of items",
        },
        {
          keys: ["Tab"],
          description: "Next Field",
          action: "Move to next form field",
        },
        {
          keys: ["Shift", "Tab"],
          description: "Previous Field",
          action: "Move to previous form field",
        },
        {
          keys: ["Enter"],
          description: "Confirm Edit",
          action: "Save inline edit",
        },
        {
          keys: ["Esc"],
          description: "Cancel Edit",
          action: "Cancel inline edit",
        },
      ],
    },
    {
      title: "General",
      icon: Command,
      color: "gray",
      shortcuts: [
        {
          keys: ["Ctrl", "R"],
          description: "Refresh Page",
          action: "Reload current page data",
        },
        {
          keys: ["?"],
          description: "Show Shortcuts",
          action: "Open this shortcuts guide",
        },
        {
          keys: ["Ctrl", ","],
          description: "Open Preferences",
          action: "Open user preferences",
        },
        {
          keys: ["Alt", "M"],
          description: "Toggle Sidebar",
          action: "Collapse/expand sidebar",
        },
        {
          keys: ["Ctrl", "Shift", "D"],
          description: "Toggle Dark Mode",
          action: "Switch between light/dark theme",
        },
      ],
    },
  ];

  const platformShortcuts = [
    { platform: "Windows", modifier: "Ctrl" },
    { platform: "Mac", modifier: "⌘" },
    { platform: "Linux", modifier: "Ctrl" },
  ];

  const filteredCategories = shortcutCategories
    .map((category) => ({
      ...category,
      shortcuts: category.shortcuts.filter(
        (shortcut) =>
          shortcut.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          shortcut.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shortcut.keys.some((key) =>
            key.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      ),
    }))
    .filter((category) => category.shortcuts.length > 0);

  const renderShortcutKeys = (keys: string[]) => (
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <span key={index} className="flex items-center gap-1">
          <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1 text-caption font-semibold text-gray-800 shadow-sm">
            {key}
          </kbd>
          {index < keys.length - 1 && (
            <span className="text-caption text-gray-400">+</span>
          )}
        </span>
      ))}
    </div>
  );

  return (
    <DashboardLayout activeItem="Keyboard Shortcuts">
      <div className="app-content bg-gray-50">
        {/* Page Header */}
        <div className="page-titlebar">
          <div className="flex flex-col p-6 text-left">
            <h1 className="flex items-center gap-2 text-heading-lg font-bold text-foreground">
              <Keyboard className="size-5" />
              Keyboard Shortcuts
            </h1>
            <p className="mt-1 text-body-md text-muted-foreground">
              Master CryptoTax Pro with these time-saving keyboard shortcuts
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="no-h-scroll space-y-6 p-4 sm:p-6">
          {/* Search and Platform Info */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search shortcuts..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-body-md font-medium">
                  Platform Support
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {platformShortcuts.map((platform) => (
                    <div
                      key={platform.platform}
                      className="flex items-center justify-between text-body-md"
                    >
                      <span className="text-gray-600">{platform.platform}</span>
                      <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-caption font-semibold text-gray-800">
                        {platform.modifier}
                      </kbd>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shortcut Categories */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.title} className="h-fit">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-heading-lg">
                      <div
                        className={`rounded-lg p-2 ${
                          category.color === "blue"
                            ? "bg-info-bg"
                            : category.color === "green"
                              ? "bg-success-bg"
                              : category.color === "purple"
                                ? "bg-purple-100"
                                : category.color === "orange"
                                  ? "bg-warning-bg"
                                  : category.color === "red"
                                    ? "bg-error-bg"
                                    : "bg-muted"
                        }`}
                      >
                        <IconComponent
                          className={`size-4 ${
                            category.color === "blue"
                              ? "text-info"
                              : category.color === "green"
                                ? "text-success"
                                : category.color === "purple"
                                  ? "text-purple-600"
                                  : category.color === "orange"
                                    ? "text-warning"
                                    : category.color === "red"
                                      ? "text-error"
                                      : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      {category.title}
                      <Badge variant="secondary" className="ml-auto">
                        {category.shortcuts.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {category.shortcuts.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 text-body-md font-medium text-gray-900">
                              {shortcut.description}
                            </div>
                            <div className="text-caption text-gray-500">
                              {shortcut.action}
                            </div>
                          </div>
                          <div className="ml-4 shrink-0">
                            {renderShortcutKeys(shortcut.keys)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="size-5" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">
                    💡 Power User Tips
                  </h4>
                  <ul className="space-y-1 text-body-md text-gray-600">
                    <li>
                      • Hold{" "}
                      <kbd className="rounded bg-gray-100 px-1 py-0.5 text-caption">
                        Ctrl
                      </kbd>{" "}
                      while clicking to select multiple items
                    </li>
                    <li>
                      • Use{" "}
                      <kbd className="rounded bg-gray-100 px-1 py-0.5 text-caption">
                        Tab
                      </kbd>{" "}
                      to navigate through forms quickly
                    </li>
                    <li>
                      • Press{" "}
                      <kbd className="rounded bg-gray-100 px-1 py-0.5 text-caption">
                        ?
                      </kbd>{" "}
                      on any page to see relevant shortcuts
                    </li>
                    <li>
                      • Most shortcuts work in combination with mouse actions
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">
                    ⚙️ Customization
                  </h4>
                  <ul className="space-y-1 text-body-md text-gray-600">
                    <li>• Shortcuts can be customized in Settings</li>
                    <li>• Some shortcuts are context-sensitive</li>
                    <li>• Tooltips show shortcuts for interactive elements</li>
                    <li>
                      • Press{" "}
                      <kbd className="rounded bg-gray-100 px-1 py-0.5 text-caption">
                        Esc
                      </kbd>{" "}
                      to cancel most actions
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <Button variant="outline">
              <Download className="mr-2 size-4" />
              Download PDF
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 size-4" />
              Customize Shortcuts
            </Button>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="py-4 text-center">
              <p className="text-body-md text-gray-500">
                {filteredCategories.reduce(
                  (total, cat) => total + cat.shortcuts.length,
                  0,
                )}{" "}
                shortcuts found for "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
