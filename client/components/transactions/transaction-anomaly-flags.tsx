import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

const anomalyFlags = [
  {
    id: "volume-spike",
    type: "error",
    icon: AlertTriangle,
    title: "Volume Spike",
    description: "Aug 14, 2022",
    iconBg: "bg-error-bg",
    iconColor: "text-error",
    actionLabel: "Investigate",
  },
  {
    id: "missing-fmv",
    type: "warning",
    icon: TrendingUp,
    title: "Missing FMV",
    description: "3 transactions",
    iconBg: "bg-warning-bg",
    iconColor: "text-warning",
    actionLabel: "Fix Values",
  },
  {
    id: "classification-conflict",
    type: "info",
    icon: Users,
    title: "Rule Conflict",
    description: "2 transactions",
    iconBg: "bg-info-bg",
    iconColor: "text-info",
    actionLabel: "Resolve",
  },
];

export function TransactionAnomalyFlags() {
  return (
    <div className="flex gap-4">
      {anomalyFlags.map((flag) => {
        const IconComponent = flag.icon;
        return (
          <div
            key={flag.id}
            className="flex flex-1 items-center gap-3 rounded-lg border bg-card p-3"
          >
            <div className={`rounded-full p-2 ${flag.iconBg} shrink-0`}>
              <IconComponent className={`size-4 ${flag.iconColor}`} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-body-md font-medium">
                {flag.title}
              </h4>
              <p className="truncate text-caption text-muted-foreground">
                {flag.description}
              </p>
            </div>
            <Link to="/data-anomaly-detection">
              <Button
                size="sm"
                variant="link"
                className="h-auto shrink-0 p-0 text-body-md text-primary"
              >
                {flag.actionLabel}
              </Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
