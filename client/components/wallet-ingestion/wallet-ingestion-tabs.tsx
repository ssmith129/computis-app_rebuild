import { cn } from "@/lib/utils";

interface WalletIngestionTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "upload", label: "Upload" },
  { id: "validate", label: "Validate" },
  { id: "mapping", label: "Schema Mapping" },
  { id: "review", label: "Review & Import" },
];

export function WalletIngestionTabs({
  activeTab,
  onTabChange,
}: WalletIngestionTabsProps) {
  return (
    <div className="flex space-x-6 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === tab.id
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
