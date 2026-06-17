import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Building2,
  Database,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

const exportTypes = [
  {
    id: "irs-8949",
    title: "IRS 8949 Export",
    description: "Precisely curated gains report",
    icon: FileText,
    iconColor: "text-info",
    bgColor: "bg-info-bg",
    borderColor: "border-info/30",
    stats: {
      transactionsReady: 24,
      unclassifiedTransactions: 12,
      missingFmvData: 4,
      aiClassifiedTransactions: 8,
    },
    includes: "Includes audit trail",
    actionText: "Export 8949",
    actionVariant: "default" as const,
  },
  {
    id: "quickbooks",
    title: "QuickBooks Export",
    description: "QBO format for accounting",
    icon: Building2,
    iconColor: "text-success",
    bgColor: "bg-success-bg",
    borderColor: "border-success/30",
    stats: {
      transactionsReady: 124,
      qboMappingStatus: "Complete",
      chartOfAccounts: "Standard Crypto",
      lastExported: "Never",
    },
    includes: "Includes metadata",
    actionText: "Export QBO",
    actionVariant: "default" as const,
  },
  {
    id: "csv",
    title: "CSV Export",
    description: "Raw data with audit trail",
    icon: Database,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    stats: {
      transactionsReady: 124,
      exportFormat: "Standard",
      includeAuditData: "Yes",
      dataValidation: "Passed",
    },
    includes: "Includes all fields",
    actionText: "Export CSV",
    actionVariant: "default" as const,
  },
];

const getStatusIcon = (value: string | number) => {
  if (typeof value === "string") {
    switch (value) {
      case "Complete":
      case "Passed":
      case "Yes":
        return <CheckCircle className="size-3 text-green-500" />;
      case "Never":
        return <AlertCircle className="size-3 text-red-500" />;
      default:
        return <Clock className="size-3 text-yellow-500" />;
    }
  }
  return null;
};

export function ExportCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {exportTypes.map((exportType) => {
        const IconComponent = exportType.icon;
        return (
          <Card
            key={exportType.id}
            className={`${exportType.borderColor} transition-shadow hover:shadow-md`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2 ${exportType.bgColor}`}>
                  <IconComponent className={`size-6 ${exportType.iconColor}`} />
                </div>
                <Badge variant="outline" className="text-caption">
                  {exportType.includes}
                </Badge>
              </div>
              <div>
                <h3 className="text-heading-lg font-semibold">
                  {exportType.title}
                </h3>
                <p className="text-body-md text-muted-foreground">
                  {exportType.description}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="space-y-2">
                {Object.entries(exportType.stats).map(([key, value]) => {
                  const label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());
                  const isHighlight = key === "transactionsReady";

                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between text-body-md"
                    >
                      <span className="text-muted-foreground">{label}:</span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(value)}
                        <span className={isHighlight ? "font-semibold" : ""}>
                          {value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <Button
                className="w-full"
                variant={exportType.actionVariant}
                size="sm"
              >
                {exportType.actionText}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
