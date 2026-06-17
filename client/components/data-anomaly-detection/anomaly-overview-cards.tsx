import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, AlertTriangle, Copy } from "lucide-react";

const anomalyTypes = [
  {
    id: "data-spikes",
    title: "Data Spikes",
    description: "Unusual transaction volume patterns detected",
    count: 8,
    status: "25 since last week",
    statusColor: "bg-error-bg text-error-text",
    iconColor: "text-error",
    icon: TrendingUp,
    borderColor: "border-error/30",
  },
  {
    id: "missing-fmv",
    title: "Missing FMV",
    description: "Transactions with missing price data",
    count: 2,
    status: "2 since last week",
    statusColor: "bg-success-bg text-success-text",
    iconColor: "text-success",
    icon: DollarSign,
    borderColor: "border-success/30",
  },
  {
    id: "classification-conflicts",
    title: "Classification Conflicts",
    description: "Multiple rules affecting same transactions",
    count: 12,
    status: "5 since last week",
    statusColor: "bg-warning-bg text-warning-text",
    iconColor: "text-warning",
    icon: AlertTriangle,
    borderColor: "border-warning/30",
  },
  {
    id: "potential-duplicates",
    title: "Potential Duplicates",
    description: "Transactions that may be duplicated",
    count: 5,
    status: "3 since last week",
    statusColor: "bg-purple-100 text-purple-700",
    iconColor: "text-purple-500",
    icon: Copy,
    borderColor: "border-purple-200",
  },
];

export function AnomalyOverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {anomalyTypes.map((anomaly) => {
        const IconComponent = anomaly.icon;
        return (
          <Card
            key={anomaly.id}
            className={`${anomaly.borderColor} hover:shadow-lg transition-shadow cursor-pointer`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-background border ${anomaly.borderColor}`}
                  >
                    <IconComponent className={`h-5 w-5 ${anomaly.iconColor}`} />
                  </div>
                  <div className="text-display-xl font-bold text-foreground">
                    {anomaly.count}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  {anomaly.title}
                </h3>
                <p className="text-body-md text-muted-foreground">
                  {anomaly.description}
                </p>
                <Badge
                  variant="secondary"
                  className={`text-caption ${anomaly.statusColor} border-0`}
                >
                  {anomaly.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
