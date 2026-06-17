import { TrendingUp, DollarSign, GitBranch } from "lucide-react";
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
        <h2 className="text-heading-lg font-bold text-gray-900">
          Anomaly Flags
        </h2>
        <Button variant="link" className="h-auto p-0 text-primary">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {anomalyFlags.map((flag, index) => (
          <Card key={index} className="border border-gray-200 p-4 shadow-sm">
            <div className="space-y-3">
              {/* Header with icon and title */}
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 ${iconBgColors[flag.type]}`}>
                  <flag.icon className={`size-4 ${iconColors[flag.type]}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-body-md font-medium text-gray-900">
                    {flag.title}
                  </h3>
                  <p className="mt-0.5 text-body-md text-gray-500">
                    {flag.description}
                  </p>
                </div>
              </div>

              {/* Details */}
              <p className="text-body-md leading-relaxed text-gray-700">
                {flag.details}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <Button
                  variant="link"
                  className="h-auto p-0 text-body-md text-primary"
                >
                  {flag.primaryAction}
                </Button>
                {flag.secondaryAction && (
                  <Button
                    variant="link"
                    className="h-auto p-0 text-body-md text-gray-400"
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
