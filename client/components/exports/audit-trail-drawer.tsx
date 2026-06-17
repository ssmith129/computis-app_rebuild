import { useEffect } from "react";
import {
  X,
  Eye,
  Upload,
  User,
  Download,
  Printer,
  CheckCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditEntry {
  time: string;
  user: string;
  action: string;
  icon: "classify" | "accept" | "view" | "export" | "override";
  details: string;
}

interface AuditTrailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exportId: string | null;
}

const auditData: Record<string, AuditEntry[]> = {
  "1": [
    {
      time: "2023-10-24 14:23:45",
      user: "john.smith@company.com",
      action: "Export Initiated",
      icon: "classify",
      details:
        "CSV export started for Tax Year 2022 (124 transactions selected)",
    },
    {
      time: "2023-10-24 14:23:46",
      user: "System",
      action: "Data Validation",
      icon: "view",
      details:
        "All transactions validated: FMV data complete, cost basis verified",
    },
    {
      time: "2023-10-24 14:24:12",
      user: "System",
      action: "AI Classification Review",
      icon: "classify",
      details:
        "AI confidence scores calculated: 118 High, 6 Medium confidence classifications",
    },
    {
      time: "2023-10-24 14:24:38",
      user: "john.smith@company.com",
      action: "Manual Review",
      icon: "view",
      details:
        "User reviewed 6 medium-confidence transactions and approved classifications",
    },
    {
      time: "2023-10-24 14:25:01",
      user: "System",
      action: "CSV Generation",
      icon: "export",
      details:
        "CSV file generated with all required fields and audit trail metadata",
    },
    {
      time: "2023-10-24 14:26:15",
      user: "john.smith@company.com",
      action: "Export Approved",
      icon: "accept",
      details:
        "Final export approved and marked for download (File: crypto_export_2022.csv)",
    },
    {
      time: "2023-10-24 16:45:22",
      user: "admin@company.com",
      action: "Download Completed",
      icon: "view",
      details: "Export file downloaded successfully by user",
    },
  ],
  "2": [
    {
      time: "2023-10-20 09:15:32",
      user: "System",
      action: "IRS 8949 Export Initiated",
      icon: "classify",
      details:
        "IRS Form 8949 export started for 120 transactions (Tax Year 2022)",
    },
    {
      time: "2023-10-20 09:15:33",
      user: "System",
      action: "Form Validation",
      icon: "view",
      details: "All required fields validated for IRS compliance",
    },
    {
      time: "2023-10-20 10:22:18",
      user: "john.smith@company.com",
      action: "Tax Review",
      icon: "view",
      details:
        "Verified tax treatment and holding periods for all transactions",
    },
    {
      time: "2023-10-20 10:22:45",
      user: "System",
      action: "Form 8949 Generated",
      icon: "export",
      details:
        "IRS Form 8949 generated with proper formatting and calculations",
    },
  ],
  "3": [
    {
      time: "2023-10-15 11:30:15",
      user: "System",
      action: "QBO Export Initiated",
      icon: "classify",
      details: "QuickBooks export requested for 118 transactions",
    },
    {
      time: "2023-10-15 11:30:16",
      user: "System",
      action: "Account Mapping",
      icon: "view",
      details:
        "Chart of Accounts mapped: Crypto assets to Asset accounts, gains to Income",
    },
    {
      time: "2023-10-15 11:45:22",
      user: "john.smith@company.com",
      action: "Mapping Review",
      icon: "view",
      details: "Verified account mappings against QuickBooks chart of accounts",
    },
    {
      time: "2023-10-15 11:52:33",
      user: "System",
      action: "QBO File Generated",
      icon: "export",
      details:
        "QuickBooks import file created with 118 transactions and metadata",
    },
  ],
};

const getIconComponent = (type: string) => {
  const icons = {
    classify: Sparkles,
    accept: CheckCircle,
    view: Eye,
    export: Upload,
    override: AlertTriangle,
  };
  return icons[type as keyof typeof icons] || Eye;
};

const getIconClass = (icon: string) => {
  const classes = {
    classify: "bg-chart-blue/20 text-info",
    accept: "bg-success/20 text-success",
    view: "bg-category-purple/20 text-category-purple",
    export: "bg-category-purple/20 text-category-purple",
    override: "bg-warning/20 text-warning",
  };
  return (
    classes[icon as keyof typeof classes] ||
    "bg-muted-foreground/20 text-muted-foreground"
  );
};

export function AuditTrailDrawer({
  isOpen,
  onClose,
  exportId,
}: AuditTrailDrawerProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const entries = exportId ? auditData[exportId] || [] : [];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-overlay transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-[450px] bg-background border-l border-border z-drawer flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-labelledby="drawer-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 id="drawer-title" className="text-lg font-semibold">
            Audit Trail
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-accent"
            onClick={onClose}
            aria-label="Close audit trail drawer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {entries.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Select an export to view its audit trail
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry, index) => (
                <div
                  key={index}
                  className="p-4 bg-card border border-border rounded-lg"
                >
                  <div className="text-xs text-muted-foreground mb-2">
                    {entry.time}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${getIconClass(entry.icon)}`}
                    >
                      {(() => {
                        const IconComponent = getIconComponent(entry.icon);
                        return <IconComponent className="h-3 w-3" />;
                      })()}
                    </span>
                    <span className="font-medium text-sm">{entry.action}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-info mb-2">
                    <User className="h-3 w-3" />
                    <span>{entry.user}</span>
                  </div>
                  <div className="text-sm text-muted-foreground pt-2 border-t border-border">
                    {entry.details}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-border">
          <Button className="flex-1" variant="default">
            <Download className="h-4 w-4 mr-2" />
            Export Trail
          </Button>
          <Button className="flex-1" variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
    </>
  );
}
