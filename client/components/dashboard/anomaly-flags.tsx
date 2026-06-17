import { TrendingUp, DollarSign, GitBranch, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AnomalyFlag {
  type: "error" | "warning" | "info";
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details: string;
  primaryAction: string;
  secondaryAction?: string;
}

const anomalyFlags: AnomalyFlag[] = [
  {
    type: "error",
    icon: TrendingUp,
    title: "Volume Spike Detected",
    description: "Unusual transaction volume on Aug 14, 2022",
    details: "Transaction volume increased by 450% compared to 30-day average.",
    primaryAction: "Investigate",
    secondaryAction: "Dismiss",
  },
  {
    type: "warning",
    icon: DollarSign,
    title: "Missing FMV Data",
    description: "3 transactions missing accurate pricing",
    details: "Fair market value may be inaccurate for these transactions.",
    primaryAction: "Fix Values",
    secondaryAction: "Dismiss",
  },
  {
    type: "info",
    icon: GitBranch,
    title: "Classification Conflict",
    description: "Rule conflict detected in 2 transactions",
    details:
      "Multiple rules are trying to classify the same transactions differently.",
    primaryAction: "Resolve",
    secondaryAction: "Dismiss",
  },
];

const iconBgColors = {
  error: "bg-error-bg",
  warning: "bg-warning-bg",
  info: "bg-info-bg",
};

const iconColors = {
  error: "text-error",
  warning: "text-warning",
  info: "text-info",
};

export function AnomalyFlags() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Anomaly Flags</h2>
        <Button variant="link" className="text-primary p-0 h-auto">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {anomalyFlags.map((flag, index) => (
          <Card key={index} className="p-4 border border-border shadow-sm">
            <div className="space-y-3">
              {/* Header with icon and title */}
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${iconBgColors[flag.type]}`}>
                  <flag.icon className={`h-4 w-4 ${iconColors[flag.type]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm">
                    {flag.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {flag.description}
                  </p>
                </div>
              </div>

              {/* Details */}
              <p className="text-sm text-foreground leading-relaxed">
                {flag.details}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <Button
                  variant="link"
                  className="text-primary p-0 h-auto text-sm"
                >
                  {flag.primaryAction}
                </Button>
                {flag.secondaryAction && (
                  <Button
                    variant="link"
                    className="text-muted-foreground p-0 h-auto text-sm"
                  >
                    {flag.secondaryAction}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
